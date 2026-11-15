
import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import api from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartLoading, setChartLoading] = useState(true);
    const [error, setError] = useState("");
    const [chartError, setChartError] = useState("");
    const [recentAppointments, setRecentAppointments] = useState([]);
    const [appointmentsLoading, setAppointmentsLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/dashboard/stats/");
                setStats(response.data);

            } catch (error) {
                console.error("Dashboard stats error:", error);
                setError("Failed to load dashboard statistics");
            } finally {
                setLoading(false);
            }
        };

        const loadChart = async () => {
            try {
                setChartLoading(true);
                setChartError("");

                const response = await api.get("/dashboard/chart/");
                setChartData(response.data);

            } catch (error) {
                console.error("Dashboard chart error:", error);
                setChartError("Failed to load appointments chart");
            } finally {
                setChartLoading(false);
            }
        };
        const loadRecentAppointments = async () => {
    try {
        setAppointmentsLoading(true);

        const response = await api.get(
            "/dashboard/recent-appointments/"
        );

        setRecentAppointments(response.data);

    } catch (error) {
        console.error("Recent appointments error:", error);
    } finally {
        setAppointmentsLoading(false);
    }
    };

        loadStats();
        loadChart();
        loadRecentAppointments();
    }, []);

    return (
        <div className="dashboard-page">

            <header className="dashboard-page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome to CLINIC1 management panel</p>
                </div>
            </header>

            {error && (
                <p className="dashboard-error">{error}</p>
            )}

            <section className="dashboard-stats">

                <div className="dashboard-stat-card">
                    <span>Total Appointments</span>
                    <h2>{loading ? "..." : stats?.appointments ?? 0}</h2>
                </div>

                <div className="dashboard-stat-card">
                    <span>Total Patients</span>
                    <h2>{loading ? "..." : stats?.patients ?? 0}</h2>
                </div>

                <div className="dashboard-stat-card">
                    <span>Doctors</span>
                    <h2>{loading ? "..." : stats?.doctors ?? 0}</h2>
                </div>

                <div className="dashboard-stat-card">
                    <span>Conversations</span>
                    <h2>{loading ? "..." : stats?.conversations ?? 0}</h2>
                </div>

            </section>

<section className="dashboard-chart-card">

    <div className="dashboard-chart-header">
        <h2>Appointments</h2>
        <span>Last 7 days</span>
    </div>

    {chartError && (
        <p className="dashboard-error">{chartError}</p>
    )}

    {chartLoading ? (
        <p>Loading chart...</p>
    ) : (
        !chartError && (

<div className="dashboard-chart">
    <ResponsiveContainer width="100%" height="100%">
        <BarChart
            data={chartData}
            margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
            barCategoryGap="25%"
        >
            <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e6eeec"
            />

            <XAxis
                dataKey="date"
                tickFormatter={(date) => date.slice(5)}
                tick={{ fontSize: 11, fill: "#8a9a9c" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={10}
            />

            <YAxis
                allowDecimals={false}
                width={35}
                tick={{ fontSize: 11, fill: "#8a9a9c" }}
                axisLine={false}
                tickLine={false}
            />

            <Tooltip
                cursor={{ fill: "#f0f7f5" }}
                contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e6eeec",
                    fontSize: "12px",
                }}
                labelFormatter={(date) => `Date: ${date}`}
                formatter={(value) => [value, "Appointments"]}
            />

            <Bar
                dataKey="appointments"
                name="Appointments"
                fill="#247f79"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
            />
        </BarChart>
    </ResponsiveContainer>
</div>

        )
    )}

</section>

             <section className="dashboard-table-card">

                <div className="dashboard-chart-header">
                    <h2>Recent Appointments</h2>
                    <span>Latest 5 appointments</span>
                </div>

                {appointmentsLoading ? (
                    <p>Loading appointments...</p>
                ) : recentAppointments.length === 0 ? (
                    <p>No appointments found</p>
                ) : (
                    <div className="dashboard-table-wrapper">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Patient</th>
                                    <th>Doctor</th>
                                    <th>Date & Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentAppointments.map((appointment) => (
                                    <tr key={appointment.id}>
                                        <td>
                                            <strong>{appointment.patient_name || "Unknown"}</strong>
                                            <small>{appointment.patient_phone}</small>
                                        </td>

                                        <td>{appointment.doctor_name || "Not assigned"}</td>

                                        <td>
                                            {new Date(appointment.scheduled_at).toLocaleString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </td>

                                        <td>
                                            <span className={`appointment-status ${appointment.status}`}>
                                                {appointment.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </section>

        </div>
    );
}

export default AdminDashboard;
