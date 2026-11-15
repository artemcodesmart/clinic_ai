from rest_framework import serializers


from appointments.models import Appointment,Doctor


class AppointmantSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source="lead.name",read_only=True,)
    patient_phone = serializers.CharField(source="lead.phone",read_only=True,)
    doctor_name = serializers.CharField(
        source="doctor.name",
        read_only=True,
        allow_null=True,
    )


    class Meta:
        model = Appointment

        fields = [


            "id",
            "clinic",
            "lead",
            "patient_name",
            "patient_phone",
            "doctor_name",
            "doctor",
            "scheduled_at",
            "status",
            "notes",
            "created_at",

        ]

        read_only_fields = ["id", "clinic", "lead","doctor", "status", "created_at", "patient_name", "patient_phone",]



class AppointmentStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ["status"]


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ["id", "name", "specialty"]


class AppointmentEditSerializer(serializers.ModelSerializer):
    doctor = serializers.PrimaryKeyRelatedField(
        queryset=Doctor.objects.none(),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Appointment
        fields = ["scheduled_at", "doctor", "notes"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self.context.get("request")
        clinic = getattr(request.user, "clinic", None) if request else None

        if clinic:
            self.fields["doctor"].queryset = Doctor.objects.filter(
                clinic=clinic,
                is_active=True,
            )

    def validate_scheduled_at(self, value):
        from django.utils import timezone

        if value <= timezone.now():
            raise serializers.ValidationError(
                "Appointment must be scheduled in the future."
            )

        return value

