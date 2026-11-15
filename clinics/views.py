from datetime import timedelta

from django.db.models import Count
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from appointments.models import Appointment, Doctor
from conversations.models import Conversation
from leads.models import Lead


class DashboardStatsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        clinic = getattr(user, "clinic", None)

        if not clinic:
            raise PermissionDenied(
                "You do not have access to clinic statistics."
            )

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

        return Response(stats)


# Create your views here.
class DashboardAppointmentsChartAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        clinic = getattr(request.user, "clinic", None)

        if not clinic:
            raise PermissionDenied(
                "You do not have access to clinic statistics."
            )

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

        return Response(result)

from appointments.serializers import AppointmantSerializer


class RecentAppointmentsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        clinic = getattr(request.user, "clinic", None)

        if not clinic:
            raise PermissionDenied(
                "You do not have access to clinic appointments."
            )

        appointments = (
            Appointment.objects
            .filter(clinic=clinic)
            .select_related("lead", "doctor")
            .order_by("-scheduled_at")[:5]
        )

        serializer = AppointmantSerializer(
            appointments,
            many=True
        )

        return Response(serializer.data)

