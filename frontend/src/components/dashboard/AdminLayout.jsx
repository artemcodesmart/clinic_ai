
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./AdminLayout.css";

function AdminLayout() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className={`admin-layout ${menuOpen ? "menu-open" : ""}`}>

            <button
                className="mobile-menu-button"
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                ☰
            </button>

            {menuOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setMenuOpen(false)}
                />
            )}

            <Sidebar
                menuOpen={menuOpen}
                onNavigate={() => setMenuOpen(false)}
            />

            <main className="admin-layout-content">
                <Outlet />
            </main>

        </div>
    );
}

export default AdminLayout;
