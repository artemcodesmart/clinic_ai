
DURATION_OPTIONS = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60]


def function_tool(name, description, properties=None, required=None):
    """Формирует описание функции для OpenAI."""
    return {
        "type": "function",
        "function": {
            "name": name,
            "description": description,
            "parameters": {
                "type": "object",
                "properties": properties or {},
                "required": required or [],
                "additionalProperties": False,
            },
        },
    }


TOOLS = [
    function_tool(
        "list_doctors",
        "Показать активных врачей клиники.",
    ),

    function_tool(
        "find_available_slots",
        "Найти свободное время врачей на конкретную дату. "
        "Предлагай пациенту только возвращённые слоты.",
        {
            "date": {
                "type": "string",
                "description": "Дата в формате YYYY-MM-DD.",
            },
            "duration_minutes": {
                "type": "integer",
                "enum": DURATION_OPTIONS,
            },
        },
        ["date"],
    ),

    function_tool(
        "find_available_dates",
        "Найти даты со свободным временем в указанном диапазоне.",
        {
            "start_date": {
                "type": "string",
                "description": "Начальная дата YYYY-MM-DD.",
            },
            "days": {
                "type": "integer",
                "description": "Количество дней от 1 до 14.",
            },
            "duration_minutes": {
                "type": "integer",
                "enum": DURATION_OPTIONS,
            },
        },
        ["start_date", "days"],
    ),

    function_tool(
        "book_appointment",
        "Создать запись только на ранее предложенный пациенту "
        "свободный слот после его явного согласия.",
        {
            "doctor_name": {
             "type": "string",
            "description": "Точное имя врача из предложенных свободных слотов.",
             },
            "date": {
                "type": "string",
                "description": "Дата YYYY-MM-DD.",
            },
            "start_time": {
                "type": "string",
                "description": "Время HH:MM.",
            },

        },
        ["doctor_name", "date", "start_time"],
    ),

    function_tool(
        "find_my_appointments",
        "Показать будущие активные записи текущего пациента.",
    ),

    function_tool(
        "cancel_appointment",
        "Отменить существующую запись текущего пациента.",
        {
            "appointment_id": {
                "type": "string",
            },
        },
        ["appointment_id"],
    ),

    function_tool(
        "reschedule_appointment",
        "Перенести существующую запись текущего пациента.",
        {
            "appointment_id": {
                "type": "string",
            },
            "new_date": {
                "type": "string",
                "description": "Новая дата YYYY-MM-DD.",
            },
            "new_start_time": {
                "type": "string",
                "description": "Новое время HH:MM.",
            },
        },
        ["appointment_id", "new_date", "new_start_time"],
    ),
]
