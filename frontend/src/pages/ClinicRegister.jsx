
import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "./ClinicRegister.css";

function ClinicRegister() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        clinic_name: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await api.post(
                "/auth/register/",
                formData
            );

            console.log("Registration successful:", response.data);

            navigate("/login");

        } catch (err) {
            console.log(err.response?.data);

            setError(
                err.response?.data?.detail ||
                "Registration failed. Please check your data."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="clinic-register">

            {/* LEFT SIDE */}

            <div className="register-showcase">

                <div className="register-brand">
                    <div className="brand-icon">
                        ✚
                    </div>

                    <div>
                        <h2>
                            CLINIC<span>1</span>
                        </h2>
                        <p>Dental Care Management</p>
                    </div>
                </div>

                <div className="showcase-content">

                    <span className="showcase-label">
                        YOUR CLINIC. YOUR FUTURE.
                    </span>

                    <h1>
                        Manage your clinic.
                        <span> Grow your business.</span>
                    </h1>

                    <p className="showcase-description">
                        Everything you need to manage your dental
                        practice in one powerful platform.
                    </p>

                    <div className="showcase-features">

                        <div className="feature-item">
                            <div className="feature-icon">
                                📅
                            </div>

                            <div>
                                <h3>Online Bookings</h3>
                                <p>
                                    Let patients book appointments anytime.
                                </p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <div className="feature-icon">
                                ✨
                            </div>

                            <div>
                                <h3>AI Receptionist</h3>
                                <p>
                                    Automate communication with your patients.
                                </p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <div className="feature-icon">
                                📈
                            </div>

                            <div>
                                <h3>Grow Your Practice</h3>
                                <p>
                                    More patients. More appointments.
                                </p>
                            </div>
                        </div>

                    </div>

                </div>

                <div className="showcase-footer">
                    <span>© 2026 CLINIC1</span>
                    <span>Built for modern dental clinics</span>
                </div>

                <div className="showcase-decoration decoration-one"></div>
                <div className="showcase-decoration decoration-two"></div>

            </div>


            {/* RIGHT SIDE */}

            <div className="register-form-section">

                <div className="register-card">

                    <div className="register-card-icon">
                        ✚
                    </div>

                    <div className="register-heading">
                        <h2>Register your clinic</h2>
                        <p>
                            Create your account and get started
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="register-field">
                            <label htmlFor="username">
                                Username
                            </label>

                            <input
                                id="username"
                                type="text"
                                name="username"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="register-field">
                            <label htmlFor="email">
                                Email address
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="register-field">
                            <label htmlFor="password">
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="register-field">
                            <label htmlFor="clinic_name">
                                Clinic name
                            </label>

                            <input
                                id="clinic_name"
                                type="text"
                                name="clinic_name"
                                placeholder="Enter your clinic name"
                                value={formData.clinic_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {error && (
                            <div className="register-error">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                "Creating your clinic..."
                            ) : (
                                <>
                                    <span>✦</span>
                                    Create Clinic
                                </>
                            )}
                        </button>

                    </form>

                    <div className="register-login">
                        <span>Already have an account?</span>
                        <Link to="/login">Login</Link>
                    </div>

                    <div className="register-security">
                        <span>🔒</span>
                        Your information is securely protected
                    </div>

                </div>

            </div>

        </div>
    );
}

export default ClinicRegister;
