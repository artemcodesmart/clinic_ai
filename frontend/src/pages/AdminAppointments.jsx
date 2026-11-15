
import { useEffect, useState } from "react";
import api from "../services/api";
import "./AdminDashboard.css";

function AdminAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [doctorFilter, setDoctorFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [updatingId, setUpdatingId] = useState(null);
    const [statusError, setStatusError] = useState("");
    const [doctorsList, setDoctorsList] = useState([]);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [editError, setEditError] = useState("");
    const [savingEdit, setSavingEdit] = useState(false);


    const doctors = [
    ...new Set(
        appointments
            .map((appointment) => appointment.doctor_name)
            .filter(Boolean)
    ),
];

const filteredAppointments = appointments.filter((appointment) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
        (appointment.patient_name || "").toLowerCase().includes(search) ||
        (appointment.patient_phone || "").includes(search);

    const matchesStatus =
        statusFilter === "all" ||
        appointment.status === statusFilter;

    const matchesDoctor =
        doctorFilter === "all" ||
        appointment.doctor_name === doctorFilter;

    const matchesDate =
        !dateFilter ||
        appointment.scheduled_at.slice(0, 10) === dateFilter;

    return (
        matchesSearch &&
        matchesStatus &&
        matchesDoctor &&
        matchesDate
    );
});
const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(a.scheduled_at);
    const dateB = new Date(b.scheduled_at);

    return sortOrder === "asc"
        ? dateA - dateB
        : dateB - dateA;
});

    useEffect(() => {
        const loadAppointments = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/appointments/");
                setAppointments(response.data);

            } catch (error) {
                console.error("Appointments error:", error);
                setError("Failed to load appointments");
            } finally {
                setLoading(false);
            }
        };


        loadAppointments();
    }, []);
    useEffect(() => {
    const loadDoctors = async () => {
        try {
            const response = await api.get("/appointments/doctors/");
            setDoctorsList(response.data);
        } catch (error) {
            console.error("Doctors loading error:", error);
        }
    };

    loadDoctors();
}, []);


    const handleEditClick = (appointment) => {
    setEditingAppointment({
        id: appointment.id,
        scheduled_at: (() => {
    const date = new Date(appointment.scheduled_at);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
})(),
        doctor: appointment.doctor || "",
        notes: appointment.notes || "",
    });

    setEditError("");
};

    const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditingAppointment((prev) => ({
        ...prev,
        [name]: value,
    }));
};
    const handleSaveEdit = async () => {
    try {
        setSavingEdit(true);
        setEditError("");

        const appointmentId = editingAppointment.id;

        const payload = {
            scheduled_at: new Date(
                editingAppointment.scheduled_at
            ).toISOString(),
            doctor: editingAppointment.doctor || null,
            notes: editingAppointment.notes,
        };

        await api.patch(
            `/appointments/${appointmentId}/edit/`,
            payload
        );

        const response = await api.get("/appointments/");
        setAppointments(response.data);

        setEditingAppointment(null);

    } catch (error) {
        console.error("Appointment edit error:", error);

        setEditError(
            error.response?.data?.scheduled_at?.[0] ||
            error.response?.data?.doctor?.[0] ||
            "Failed to save appointment changes."
        );
    } finally {
        setSavingEdit(false);
    }
};



    const handleStatusChange = async (appointmentId, newStatus) => {
    if (newStatus === "cancelled") {
    const confirmed = window.confirm(
        "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) {
        return;
    }
}
    try {
        setStatusError("");
        setUpdatingId(appointmentId);

        await api.patch(
            `/appointments/${appointmentId}/status/`,
            { status: newStatus }
        );

        setAppointments((prevAppointments) =>
            prevAppointments.map((appointment) =>
                appointment.id === appointmentId
                    ? { ...appointment, status: newStatus }
                    : appointment
            )
        );

    } catch (error) {
        console.error("Status update error:", error);
    setStatusError("Failed to update appointment status. Please try again.");
    } finally {
        setUpdatingId(null);
    }
};

    return (
        <div className="dashboard-page">

            <header className="dashboard-page-header">
                <div>
                    <h1>Appointments</h1>
                    <p>Manage clinic appointments</p>
                </div>
            </header>

            <section className="dashboard-table-card">
            {statusError && (
    <p className="dashboard-error">
        {statusError}
    </p>
)}

<div className="appointments-filters">

    <input
        type="text"
        placeholder="Search patient name or phone..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
    />

    <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
    >
        <option value="all">All statuses</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
    </select>

    <select
        value={doctorFilter}
        onChange={(e) => setDoctorFilter(e.target.value)}
    >
        <option value="all">All doctors</option>

        {doctors.map((doctor) => (
            <option key={doctor} value={doctor}>
                {doctor}
            </option>
        ))}
    </select>

    <input
        type="date"
        value={dateFilter}
        onChange={(e) => setDateFilter(e.target.value)}
    />
    <select
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value)}
>
    <option value="asc">Nearest first</option>
    <option value="desc">Latest first</option>
</select>
    <button
    type="button"
    onClick={() => {
        setSearchTerm("");
        setStatusFilter("all");
        setDoctorFilter("all");
        setDateFilter("");
    }}
>
    Reset Filters
</button>

</div>


                <div className="dashboard-chart-header">
                    <h2>All Appointments</h2>
                   <span>
    {filteredAppointments.length} of {appointments.length} appointments
</span>
                </div>
                {editingAppointment && (
    <div className="appointment-edit-form">
        <h3>Edit Appointment</h3>

        {editError && (
            <p className="dashboard-error">{editError}</p>
        )}

        <label>Date and Time</label>
        <input
            type="datetime-local"
            name="scheduled_at"
            value={editingAppointment.scheduled_at}
            onChange={handleEditChange}
        />

        <label>Doctor</label>
        <select
            name="doctor"
            value={editingAppointment.doctor}
            onChange={handleEditChange}
        >
            <option value="">Not assigned</option>

            {doctorsList.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                    {doctor.name} — {doctor.specialty}
                </option>
            ))}
        </select>

        <label>Notes</label>
        <textarea
            name="notes"
            value={editingAppointment.notes}
            onChange={handleEditChange}
        />

        <div>
            <button
                type="button"
                onClick={handleSaveEdit}
                disabled={savingEdit}
            >
                {savingEdit ? "Saving..." : "Save Changes"}
            </button>

            <button
                type="button"
                onClick={() => {
                    setEditingAppointment(null);
                    setEditError("");
                }}
            >
                Cancel
            </button>
        </div>
    </div>
)}

                {loading ? (
                    <p>Loading appointments...</p>
                ) : error ? (
                    <p className="dashboard-error">{error}</p>
                ) : filteredAppointments.length === 0 ? (
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
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {sortedAppointments.map((appointment) => (
                                    <tr key={appointment.id}>
                                        <td>
                                            <strong>
                                                {appointment.patient_name || "Unknown"}
                                            </strong>
                                            <small>
                                                {appointment.patient_phone}
                                            </small>
                                        </td>


                                        <td>
                                            {appointment.doctor_name || "Not assigned"}
                                        </td>

                                        <td>
                                            {new Date(
                                                appointment.scheduled_at
                                            ).toLocaleString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </td>

                                        <td>
                                    <select
                                        className={`appointment-status-select status-${appointment.status}`}
                                        value={appointment.status}
                                        disabled={updatingId === appointment.id}
                                        onChange={(e) =>
                                            handleStatusChange(appointment.id, e.target.value)
                                        }
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>

                                    {updatingId === appointment.id && (
                                        <small>Saving...</small>
                                    )}
                                </td>
                                <td>
    <button
        type="button"
        onClick={() => handleEditClick(appointment)}
    >
        Edit
    </button>
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

export default AdminAppointments;
