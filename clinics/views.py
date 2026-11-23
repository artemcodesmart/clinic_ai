from datetime import timedelta

from django.db.models import Count
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateAPIView,ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from clinics.serializers import ClinicPublicSerializer,ClinicBrandingSerializer,ClinicPageSerializer,ClinicAssetSerializer
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django.db import transaction
from rest_framework import status

from clinics.models import Clinic,ClinicBranding,ClinicPage,ClinicAsset

from appointments.models import Appointment, Doctor
from conversations.models import Conversation
from leads.models import Lead
from .services import get_appointments_chart_data,get_dashboard_stats,ClinicPageService


class DashboardStatsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        clinic = getattr(request.user, "clinic", None)

        if not clinic:
            raise PermissionDenied(
                "You do not have access to clinic statistics."
            )

        stats = get_dashboard_stats(clinic)

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

        result = get_appointments_chart_data(clinic)

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



class ClinicPublicAPIView(RetrieveAPIView):
    serializer_class = ClinicPublicSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"
    queryset = Clinic.objects.filter(is_active=True)




class ClinicBrandingAPIView(RetrieveUpdateAPIView):
    serializer_class = ClinicBrandingSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return ClinicBranding.objects.get(
            clinic=self.request.user.clinic
        )

class ClinicPageListCreateAPIView(ListCreateAPIView):
    serializer_class = ClinicPageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ClinicPage.objects.filter(
            clinic=self.request.user.clinic
        )

    def perform_create(self, serializer):
        serializer.save(
            clinic=self.request.user.clinic
        )


class ClinicPageDetailAPIView(RetrieveUpdateAPIView):
    serializer_class = ClinicPageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ClinicPage.objects.filter(
            clinic=self.request.user.clinic
        )

class ClinicPagePublishAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        page = ClinicPageService.publish(
            clinic=request.user.clinic,
            page_id=pk,
        )

        return Response({
            "message": "Page published successfully",
            "is_published": page.is_published,
        })


class ClinicAssetListCreateAPIView(ListCreateAPIView):
    serializer_class = ClinicAssetSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return ClinicAsset.objects.filter(
            clinic=self.request.user.clinic
        )

    def perform_create(self, serializer):
        serializer.save(
            clinic=self.request.user.clinic
        )