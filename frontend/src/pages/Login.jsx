
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login/", {
                username,
                password,
            });

            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);

            const me = await api.get("/auth/me/");

            localStorage.setItem("user_role", me.data.role);

            if (me.data.role === "admin") {
                window.location.href = "/admin/conversations";
            } else {
                window.location.href = "/conversations";
            }

        } catch (error) {
            console.error("LOGIN ERROR:", error.response?.data);

            if (error.response?.status === 401) {
                setError("Incorrect username or password.");
            } else if (error.response?.data) {
                setError("Unable to sign in. Please check your details.");
            } else {
                setError("Connection error. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-brand">
                <Link to="/" className="login-logo">
                    <span>✦</span> CLINIC<span className="login-logo-accent">1</span>
                </Link>

                <div className="login-welcome">
                    <span className="login-label">CLINIC1 DENTAL CARE</span>

                    <h1>
                        Welcome Back.
                        <span>Your Smile Matters.</span>
                    </h1>

                    <p>
                        Sign in to access your account and stay connected
                        with your dental care.
                    </p>
                </div>

                <div className="login-brand-footer">
                    Professional care. Comfortable experience.
                </div>
            </div>

            <div className="login-form-side">
                <div className="login-card">

                    <div className="login-card-heading">
                        <span>WELCOME BACK</span>
                        <h2>Sign In</h2>
                        <p>Enter your account details to continue.</p>
                    </div>

                    <form onSubmit={handleLogin} className="login-form">

                        <label htmlFor="login-username">Username</label>
                        <input
                            id="login-username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />

                        <label htmlFor="login-password">Password</label>
                        <input
                            id="login-password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {error && (
                            <div className="login-error">
                                {error}
                            </div>
                        )}

                        <button type="submit" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </button>

                    </form>

                    <div className="login-register-link">
                        Don't have an account?
                        <Link to="/register/clinic1">Register</Link>
                    </div>

                    <Link to="/" className="login-back-home">
                        ← Back to Home
                    </Link>

                </div>
            </div>

        </div>
    );
}

export default Login;
