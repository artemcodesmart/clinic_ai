from django.utils import timezone

from rest_framework import serializers
from rest_framework.generics import ListCreateAPIView,UpdateAPIView,ListAPIView
from rest_framework.permissions import IsAuthenticated

from appointments.models import Appointment,Doctor
from appointments.serializers import AppointmantSerializer,AppointmentStatusSerializer,DoctorSerializer,AppointmentEditSerializer

class AppointmentListCreateAPIView(ListCreateAPIView):
    serializer_class = AppointmantSerializer
    permission_classes = [IsAuthenticated]


    def get_queryset(self):
        user = self.request.user
        clinic = getattr(user, "clinic", None)

        if clinic:
            return Appointment.objects.filter(
                clinic=clinic
            ).select_related("lead")

        return Appointment.objects.filter(
            lead__user=user
        ).select_related("lead")

    def perform_create(self, serializer):
        user = self.request.user
        clinic = getattr(user, "clinic", None)

        if clinic:
            raise serializers.ValidationError(
                "Clinic administrators cannot create appointments through this endpoint yet."
            )

        try:
            lead = user.lead
        except Exception:
            raise serializers.ValidationError(
                "Your account is not linked to a patient profile."
            )

        scheduled_at = serializer.validated_data["scheduled_at"]

        if scheduled_at <= timezone.now():
            raise serializers.ValidationError(
                {"scheduled_at": "Appointment must be scheduled in the future."}
            )

        serializer.save(
            lead=lead,
            clinic=lead.clinic,
        )

from django.shortcuts import render

class AppointmentStatusUpdateAPIView(UpdateAPIView):
    serializer_class = AppointmentStatusSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["patch", "options"]

    def get_queryset(self):
        user = self.request.user
        clinic = getattr(user, "clinic", None)

        if not clinic:
            return Appointment.objects.none()

        return Appointment.objects.filter(
            clinic=clinic
        )

    def get_serializer(self, *args, **kwargs):
        kwargs["partial"] = True
        return super().get_serializer(*args, **kwargs)




class DoctorListAPIView(ListAPIView):
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        clinic = getattr(self.request.user, "clinic", None)

        if not clinic:
            return Doctor.objects.none()

        return Doctor.objects.filter(
            clinic=clinic,
            is_active=True,
        )



class AppointmentEditAPIView(UpdateAPIView):
    serializer_class = AppointmentEditSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["patch", "options"]

    def get_queryset(self):
        clinic = getattr(self.request.user, "clinic", None)

        if not clinic:
            return Appointment.objects.none()

        return Appointment.objects.filter(clinic=clinic)

    def get_serializer(self, *args, **kwargs):
        kwargs["partial"] = True
        return super().get_serializer(*args, **kwargs)

# Create your views here.
