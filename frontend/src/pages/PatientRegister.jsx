import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./PatientRegister.css";

function PatientRegister() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        name: "",
        phone: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {

        console.log("SLUG:", slug);
        console.log("REGISTER URL:", `/auth/patient-register/${slug}/`);

            await api.post(

                `/auth/patient-register/${slug}/`,
                form
            );

            navigate("/login");
        } catch (error) {
            console.error(error);

            if (error.response?.data) {
                setError(
                    JSON.stringify(error.response.data)
                );
            } else {
                setError("Registration failed");
            }
        } finally {
            setLoading(false);
        }
    };


return (
    <div className="patient-register-page">

        <div className="patient-register-brand">
            <a href="/" className="patient-register-logo">
                ✦ CLINIC<span>1</span>
            </a>

            <div className="patient-register-welcome">
                <span className="patient-register-label">
                    CLINIC1 DENTAL CARE
                </span>

                <h2>
                    Start Your Journey.
                    <span>Smile With Confidence.</span>
                </h2>

                <p>
                    Create your account and stay connected
                    with your dental care. Your healthier,
                    brighter smile starts here.
                </p>

                <div className="patient-register-benefits">
                    <div className="patient-register-benefit">
                        <span className="patient-register-check">✓</span>
                        Personalized dental care
                    </div>

                    <div className="patient-register-benefit">
                        <span className="patient-register-check">✓</span>
                        Easy appointment access
                    </div>

                    <div className="patient-register-benefit">
                        <span className="patient-register-check">✓</span>
                        A friendly professional team
                    </div>
                </div>
            </div>

            <div className="patient-register-brand-footer">
                Professional care. Comfortable experience.
            </div>
        </div>

        <div className="patient-register-form-side">
            <div className="patient-register-card">

                <div className="patient-register-heading">
                    <span>CREATE YOUR ACCOUNT</span>
                    <h1>Patient Registration</h1>
                    <p>
                        Fill in your details to create your patient account.
                    </p>
                </div>

                <form
                    className="patient-register-form"
                    onSubmit={handleSubmit}
                >
                    <label htmlFor="register-name">Full Name</label>
                    <input
                        id="register-name"
                        name="name"
                        placeholder="Enter your full name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="register-phone">Phone Number</label>
                    <input
                        id="register-phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={form.phone}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="register-email">Email Address</label>
                    <input
                        id="register-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={handleChange}
                    />

                    <label htmlFor="register-username">Username</label>
                    <input
                        id="register-username"
                        name="username"
                        placeholder="Choose a username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="register-password">Password</label>
                    <input
                        id="register-password"
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    {error && (
                        <div className="patient-register-error">
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <div className="register-login-link">
                    Already have an account?
                    <span onClick={() => navigate("/login")}>
                        Sign In
                    </span>
                </div>

                <a href="/" className="register-back-home">
                    ← Back to Home
                </a>

            </div>
        </div>

    </div>
);

}

export default PatientRegister;