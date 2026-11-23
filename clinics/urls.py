
from django.urls import path
from clinics.views import DashboardStatsAPIView, DashboardAppointmentsChartAPIView,\
    RecentAppointmentsAPIView, ClinicBrandingAPIView, ClinicPageListCreateAPIView,ClinicPageDetailAPIView,\
    ClinicPagePublishAPIView,ClinicAssetListCreateAPIView


urlpatterns = [
    path(
        "stats/",
        DashboardStatsAPIView.as_view(),
        name="dashboard-stats",
    ),
    path(
        "chart/",
        DashboardAppointmentsChartAPIView.as_view(),
        name="dashboard-appointments-chart",
    ),
    path("recent-appointments/",RecentAppointmentsAPIView.as_view(),name="dashboard-recent-appointments",),
    path("branding/", ClinicBrandingAPIView.as_view(), name="clinic-branding",),
    path("pages/",ClinicPageListCreateAPIView.as_view(),name="clinic-pages",),
    path("pages/<uuid:pk>/",ClinicPageDetailAPIView.as_view(),name="clinic-page-detail",),
    path("pages/<uuid:pk>/publish/",ClinicPagePublishAPIView.as_view(),name="clinic-page-publish",),
    path("assets/",ClinicAssetListCreateAPIView.as_view(), name="clinic-assets",),



]
