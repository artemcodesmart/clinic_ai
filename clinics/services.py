from django.db import transaction
from clinics.models import ClinicPage




from datetime import timedelta

from django.db.models import Count
from django.db.models.functions import TruncDate
from django.utils import timezone

from appointments.models import Appointment,Doctor
from leads.models import Lead
from conversations.models import Conversation



def get_appointments_chart_data(clinic):
    today = timezone.localdate()
    start_date = today - timedelta(days=6)

    appointments = (
        Appointment.objects
        .filter(
            clinic=clinic,
            scheduled_at__date__gte=start_date,
            scheduled_at__date__lte=today,
        )
        .annotate(date=TruncDate("scheduled_at"))
        .values("date")
        .annotate(count=Count("id"))
        .order_by("date")
    )

    data = {
        item["date"].isoformat(): item["count"]
        for item in appointments
    }

    result = []

    for day in range(7):
        date = start_date + timedelta(days=day)

        result.append({
            "date": date.isoformat(),
            "appointments": data.get(date.isoformat(), 0),
        })

    return result



class ClinicPageService:

    @staticmethod
    @transaction.atomic
    def publish(clinic, page_id):
        page = ClinicPage.objects.select_for_update().get(
            pk=page_id,
            clinic=clinic,
        )

        page.published_sections = page.sections
        page.is_published = True

        page.save(update_fields=[
            "published_sections",
            "is_published",
            "updated_at",
        ])

        return page


def get_dashboard_stats(clinic):
    stats = {
        "appointments": Appointment.objects.filter(
            clinic=clinic
        ).count(),

        "patients": Lead.objects.filter(
            clinic=clinic
        ).count(),

        "doctors": Doctor.objects.filter(
            clinic=clinic,
            is_active=True
        ).count(),

        "conversations": Conversation.objects.filter(
            lead__clinic=clinic
        ).count(),
    }

    return stats
