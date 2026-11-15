
import { NavLink } from "react-router-dom";
import LogoutButton from "../LogoutButton";

function Sidebar() {
    return (
        <aside className="dashboard-sidebar">

            <div className="dashboard-brand">
                <h2>
                    CLINIC<span>1</span>
                </h2>
                <p>Dental Care Management</p>
            </div>

            <nav className="dashboard-navigation">

                <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    <span>⌂</span>
                    Dashboard
                </NavLink>

                <NavLink
                    to="/admin/appointments"
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    <span>▦</span>
                    Appointments
                </NavLink>

                <NavLink
                    to="/admin/doctors"
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    <span>♙</span>
                    Doctors
                </NavLink>

                <NavLink
                    to="/admin/patients"
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    <span>♧</span>
                    Patients
                </NavLink>

                <NavLink
                    to="/admin/conversations"
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    <span>▤</span>
                    Conversations
                </NavLink>

                <NavLink
                    to="/admin/settings"
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    <span>⚙</span>
                    Settings
                </NavLink>

            </nav>

            <div className="dashboard-sidebar-bottom">
                <LogoutButton />
            </div>

        </aside>
    );
}

export default Sidebar;
