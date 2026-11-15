from django.urls import path
from appointments.views import AppointmentListCreateAPIView,AppointmentStatusUpdateAPIView,\
    DoctorListAPIView,AppointmentEditAPIView

urlpatterns = [
    path("", AppointmentListCreateAPIView.as_view(), name="appointment-list-create"),
    path("<uuid:pk>/status/",AppointmentStatusUpdateAPIView.as_view(), name="appointment-status-update",),
    path("doctors/",DoctorListAPIView.as_view(),name="doctor-list",),
    path("<uuid:pk>/edit/",AppointmentEditAPIView.as_view(),name="appointment-edit",),


]
