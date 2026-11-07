
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    const goToSection = (section) => {
        if (location.pathname !== "/") {
            navigate("/", { state: { scrollTo: section } });
        } else {
            document.getElementById(section)?.scrollIntoView({
                behavior: "smooth"
            });
        }
    };

    return (
        <header className="site-header">
            <div className="header-container">

                <Link to="/" className="clinic-logo">
                    <span className="logo-icon">✦</span>
                    <span>
                        CLINIC<span className="logo-accent">1</span>
                    </span>
                </Link>

                <nav className="header-nav">
                    <a href="#home" onClick={(e) => {
                        e.preventDefault();
                        goToSection("home");
                    }}>Home</a>

                    <a href="#services" onClick={(e) => {
                        e.preventDefault();
                        goToSection("services");
                    }}>Services</a>

                    <a href="#doctors" onClick={(e) => {
                        e.preventDefault();
                        goToSection("doctors");
                    }}>Our Doctors</a>

                    <a href="#about" onClick={(e) => {
                        e.preventDefault();
                        goToSection("about");
                    }}>About Us</a>

                    <Link to="/contacts">Contact</Link>
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
