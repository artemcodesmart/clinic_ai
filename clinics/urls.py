
from django.urls import path
from clinics.views import DashboardStatsAPIView,DashboardAppointmentsChartAPIView,RecentAppointmentsAPIView

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
]
