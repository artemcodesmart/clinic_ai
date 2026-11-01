
import { useNavigate } from "react-router-dom";
import "./Hero.css";
import heroImage from "../assets/dental-hero.png";

function Hero() {
    const navigate = useNavigate();

    return (
        <section className="hero-section" id="home">

            <div className="hero-container">

                <div className="hero-content">

                    <span className="hero-label">
                        YOUR SMILE, OUR PRIORITY
                    </span>

                    <h1>
                        A Healthy Smile
                        <br />
                        Starts With
                        <span> Us.</span>
                    </h1>

                    <p>
                        Experience modern dental care with our
                        professional team. We combine advanced
                        technology, comfort and personalized
                        treatment for every patient.
                    </p>

                    <div className="hero-buttons">

                        <button
                            className="hero-primary-button"
                            onClick={() => navigate("/register/clinic1")}
                        >
                            Book Appointment
                        </button>

                        <a href="#services" className="hero-secondary-button">
                            Explore Services →
                        </a>

                    </div>

                    <div className="hero-stats">

                        <div>
                            <strong>10+</strong>
                            <span>Years Experience</span>
                        </div>

                        <div>
                            <strong>2k+</strong>
                            <span>Happy Patients</span>
                        </div>

                        <div>
                            <strong>100%</strong>
                            <span>Personal Care</span>
                        </div>

                    </div>

                </div>

                <div className="hero-image">
                    <img
    src={heroImage}
    alt="CLINIC1 Dental Care"
/>
                </div>

            </div>

        </section>
    );
}

export default Hero;

