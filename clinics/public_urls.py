from django.urls import path
from clinics.views import ClinicPublicAPIView

urlpatterns = [
    path(
        "<slug:slug>/",
        ClinicPublicAPIView.as_view(),
        name="clinic-public",
    ),
]