
import json
import logging

from ai.clients.openai_client import OpenAIClient
from ai.prompts.receptionist import SYSTEM_PROMPT
from ai.tools.definitions import TOOLS
from ai.tools.executor import execute_tool


logger = logging.getLogger(__name__)


class AIService:
    client = OpenAIClient()

    @classmethod
    def generate_reply(cls, conversation):

        messages = [
            {
                "role": "system",
                "content": (
                    SYSTEM_PROMPT
                    + "\n\n"
                    + "Для записи пациента используй инструменты. "
                    + "Никогда не утверждай, что запись создана, "
                    + "если book_appointment не вернул success=true. "
                    + "Если инструмент не вызывался, запись не создана. "
                    + "Если операция завершилась ошибкой, сообщи об этом. "
                    + "Созданная запись ожидает подтверждения клиникой."
                ),
            }
        ]

        for message in conversation.messages.all().order_by("created_at"):
            role = (
                "user"
                if message.role == "patient"
                else "assistant"
            )

            messages.append({
                "role": role,
                "content": message.content,
            })

        for _ in range(5):

            assistant_message = cls.client.chat(
                messages,
                tools=TOOLS,
            )

            print("AI TOOL CALLS:", assistant_message.tool_calls)
            print("AI CONTENT:", assistant_message.content)

            # OpenAI ответил обычным текстом
            if not assistant_message.tool_calls:
                content = assistant_message.content or ""

                # Проверяем, не выдаёт ли AI обычный текст
                # за подтверждение реально созданной записи.
                booking_phrases = (
                    "запись создана",
                    "вы записаны",
                    "я записал вас",
                    "записал вас",
                    "записываю вас",
                    "запись оформлена",
                    "запись забронирована",
                )

                if any(
                    phrase in content.lower()
                    for phrase in booking_phrases
                ):
                    logger.warning(
                        "AI attempted to confirm booking without "
                        "calling book_appointment."
                    )

                    return (
                        "Я пока не создал запись. "
                        "Пожалуйста, уточните выбранное время."
                    )

                return content

            messages.append(
                assistant_message.model_dump(exclude_none=True)
            )

            # Здесь храним реальный результат бронирования.
            booking_result = None

            for tool_call in assistant_message.tool_calls:

                tool_name = tool_call.function.name

                try:
                    arguments = json.loads(
                        tool_call.function.arguments
                    )

                    result = execute_tool(
                        conversation=conversation,
                        tool_name=tool_name,
                        arguments=arguments,
                    )

                except Exception:
                    logger.exception(
                        "Error executing AI tool: %s",
                        tool_name,
                    )

                    result = {
                        "success": False,
                        "message": (
                            "Не удалось выполнить операцию. "
                            "Попробуй ещё раз."
                        ),
                    }

                print("TOOL RESULT:", result)

                if tool_name == "book_appointment":
                    booking_result = result

                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": json.dumps(
                        result,
                        ensure_ascii=False,
                        default=str,
                    ),
                })

            # Главное: результат бронирования проверяет Django,
            # а не текст, который сгенерировала модель.
            if booking_result is not None:

                if not booking_result.get("success"):
                    return booking_result.get(
                        "message",
                        "Не удалось создать запись. Попробуй ещё раз.",
                    )

                return booking_result.get(
                    "message",
                    "Запись успешно создана и ожидает подтверждения клиникой.",
                )

        raise RuntimeError(
            "OpenAI exceeded the maximum number of tool calls."
        )
