
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
    const navigate = useNavigate();

    return (
        <header className="site-header">
            <div className="header-container">

                <div
                    className="clinic-logo"
                    onClick={() => navigate("/")}
                >
                    <span className="logo-icon">✦</span>
                    <span>CLINIC<span className="logo-accent">1</span></span>
                </div>

                <nav className="header-nav">
                    <a href="#home">Home</a>
                    <a href="#services">Services</a>
                    <a href="#doctors">Our Doctors</a>
                    <a href="#about">About Us</a>
                    <a href="#contact">Contact</a>
                </nav>

                <button
                    className="header-booking"
                    onClick={() => navigate("/register/clinic1")}
                >
                    Book Appointment
                </button>

            </div>
        </header>
    );
}

export default Header;

