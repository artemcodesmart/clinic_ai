


from django.conf import settings
from openai import OpenAI


class OpenAIClient:
    def chat(self, messages,tools=None,tool_choice="auto"):
        api_key = getattr(settings, "OPENAI_API_KEY", "")

        if not api_key:
            raise RuntimeError(
                "OPENAI_API_KEY is not configured in .env"
            )

        client = OpenAI(api_key=api_key)
        kwargs = {
            "model": getattr(
                settings,
                "OPENAI_MODEL",
                "gpt-4.1-mini",
            ),
            "messages": messages,
        }

        if tools:
            kwargs["tools"] = tools
            kwargs["tool_choice"] = tool_choice

        response = client.chat.completions.create(**kwargs)

        assistant_message = response.choices[0].message

        if not assistant_message.content and not assistant_message.tool_calls:
            raise RuntimeError("OpenAI returned an empty response.")

        return assistant_message
