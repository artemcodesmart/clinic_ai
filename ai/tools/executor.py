
from datetime import date, timedelta

from django.utils import timezone

from appointments.models import Doctor
from appointments.services import (
    get_available_slots,
    book_appointment,
    get_patient_appointments,
    cancel_appointment,
    reschedule_appointment,
)

from ai.tools.definitions import DURATION_OPTIONS


def execute_tool(conversation, tool_name, arguments):
    """
    Выполняет инструмент, который запросил OpenAI.

    conversation — текущая беседа пациента.
    tool_name — название инструмента.
    arguments — аргументы, переданные OpenAI.
    """

    if not isinstance(arguments, dict):
        return {
            "success": False,
            "message": "Некорректные аргументы инструмента.",
        }

    clinic = conversation.lead.clinic
    today = timezone.localdate()

    # 1. Список врачей
    if tool_name == "list_doctors":
        doctors = Doctor.objects.filter(
            clinic=clinic,
            is_active=True,
        ).order_by("name")

        return {
            "success": True,
            "doctors": [
                {
                    "id": str(doctor.id),
                    "name": doctor.name,
                    "specialty": doctor.specialty,
                }
                for doctor in doctors
            ],
        }

    # 2. Свободное время на конкретную дату
    if tool_name == "find_available_slots":
        try:
            requested_date = date.fromisoformat(
                arguments["date"]
            )
            duration = int(
                arguments.get("duration_minutes", 40)
            )
        except (ValueError, TypeError, KeyError):
            return {
                "success": False,
                "message": "Некорректная дата или длительность.",
            }

        if requested_date < today:
            return {
                "success": False,
                "message": "Нельзя искать запись в прошлом.",
            }

        if duration not in DURATION_OPTIONS:
            return {
                "success": False,
                "message": "Недопустимая длительность записи.",
            }

        slots = get_available_slots(
            clinic,
            requested_date,
            duration_minutes=duration,
        )

        saved_slots = [
            {
                **slot,
                "doctor_id": str(slot["doctor_id"]),
                "date": str(slot["date"]),
            }
            for slot in sorted(
                slots,
                key=lambda item: (
                    item["start_time"],
                    item["doctor_name"],
                ),
            )[:5]
        ]

        conversation.pending_slots = saved_slots
        conversation.pending_selected_time = ""

        conversation.save(update_fields=[
            "pending_slots",
            "pending_selected_time",
        ])

        return {
            "success": True,
            "date": requested_date.isoformat(),
            "slots": saved_slots,
        }

    # 3. Поиск свободных дат
    if tool_name == "find_available_dates":
        try:
            start_date = date.fromisoformat(
                arguments["start_date"]
            )
            days = int(arguments["days"])
            duration = int(
                arguments.get("duration_minutes", 40)
            )
        except (ValueError, TypeError, KeyError):
            return {
                "success": False,
                "message": "Некорректные параметры поиска.",
            }

        if start_date < today or not 1 <= days <= 14:
            return {
                "success": False,
                "message": "Выберите будущую дату и диапазон от 1 до 14 дней.",
            }

        if duration not in DURATION_OPTIONS:
            return {
                "success": False,
                "message": "Недопустимая длительность записи.",
            }

        all_slots = []

        for offset in range(days):
            check_date = start_date + timedelta(days=offset)

            slots = get_available_slots(
                clinic,
                check_date,
                duration_minutes=duration,
            )

            for slot in slots:
                all_slots.append({
                    **slot,
                    "doctor_id": str(slot["doctor_id"]),
                    "date": str(slot["date"]),
                })

        all_slots.sort(
            key=lambda item: (
                item["date"],
                item["start_time"],
                item["doctor_name"],
            )
        )

        offered_slots = all_slots[:10]

        conversation.pending_slots = offered_slots
        conversation.pending_selected_time = ""

        conversation.save(update_fields=[
            "pending_slots",
            "pending_selected_time",
        ])

        return {
            "success": True,
            "available_dates": sorted({
                slot["date"] for slot in offered_slots
            }),
            "slots": offered_slots,
        }



    # 4. Создание записи
    if tool_name == "book_appointment":
        try:
            requested = {
                "doctor_name": str(arguments["doctor_name"]).strip(),
                "date": str(arguments["date"]).strip(),
                "start_time": str(arguments["start_time"]).strip()[:5],
            }
        except (ValueError, TypeError, KeyError):
            return {
                "success": False,
                "message": "Некорректные параметры записи.",
            }

        # Нормализуем имя: Dr. Ahmet и Dr.Ahmet
        # должны считаться одним врачом.
        normalized_name = "".join(
            requested["doctor_name"].split()
        ).casefold()

        selected_slot = next(
            (
                slot
                for slot in (conversation.pending_slots or [])
                if "".join(
                    str(slot.get("doctor_name", "")).split()
                ).casefold() == normalized_name
                and str(slot.get("date")) == requested["date"]
                and str(slot.get("start_time", ""))[:5]
                == requested["start_time"]
            ),
            None,
        )

        if selected_slot is None:
            return {
                "success": False,
                "message": (
                    "Не удалось найти выбранное время среди "
                    "предложенных слотов. Уточни врача и время."
                ),
            }

        # Продолжительность берём из реального сохранённого слота.
        duration = int(selected_slot["duration_minutes"])

        if duration not in DURATION_OPTIONS:
            return {
                "success": False,
                "message": "Недопустимая длительность слота.",
            }

        result = book_appointment(
            conversation=conversation,
            doctor_id=selected_slot["doctor_id"],
            appointment_date=selected_slot["date"],
            start_time=selected_slot["start_time"],
            duration_minutes=duration,
        )

        if result.get("success"):
            conversation.pending_slots = []
            conversation.pending_selected_time = ""

            conversation.save(update_fields=[
                "pending_slots",
                "pending_selected_time",
            ])

        return result



    # 5. Просмотр записей пациента
    if tool_name == "find_my_appointments":
        return {
            "success": True,
            "appointments": get_patient_appointments(
                conversation
            ),
        }

    # 6. Отмена записи
    if tool_name == "cancel_appointment":
        appointment_id = arguments.get("appointment_id")

        if not appointment_id:
            return {
                "success": False,
                "message": "Не указан ID записи.",
            }

        return cancel_appointment(
            conversation,
            str(appointment_id),
        )

    # 7. Перенос записи
    if tool_name == "reschedule_appointment":
        try:
            appointment_id = str(arguments["appointment_id"])
            new_date = str(arguments["new_date"])
            new_start_time = str(arguments["new_start_time"])
        except (ValueError, TypeError, KeyError):
            return {
                "success": False,
                "message": "Не указаны параметры переноса.",
            }

        return reschedule_appointment(
            conversation,
            appointment_id,
            new_date,
            new_start_time,
        )

    return {
        "success": False,
        "message": "Неизвестный инструмент.",
    }
