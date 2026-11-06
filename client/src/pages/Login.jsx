import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await API.post("/auth/login", formData);
            localStorage.setItem("bloodlinkToken", res.data.token);
            localStorage.setItem("bloodlinkUser", JSON.stringify(res.data.user));

            if (res.data.user.role === "admin") {
                navigate("/admin-dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            setMessage(err.response?.data?.message || "Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "12px 14px",
        border: "1px solid #DCD6CD",
        borderRadius: "6px",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box",
        marginTop: "6px",
        background: "#FFFFFF",
        color: "#222222"
    };

    const labelStyle = {
        fontSize: "13px",
        fontWeight: "600",
        color: "#333333"
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAF7F5", padding: "20px", fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
            <div style={{ width: "100%", maxWidth: "420px", background: "#FFFFFF", padding: "40px", borderRadius: "8px", borderTop: "4px solid #D9383A", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                <div style={{ textAlign: "center", marginBottom: "28px" }}>
                    <div style={{ fontSize: "36px", marginBottom: "8px" }}>🩸</div>
                    <h2 style={{ margin: 0, color: "#222222", fontSize: "24px", fontWeight: "700" }}>Welcome Back</h2>
                    <p style={{ margin: "8px 0 0", color: "#666666", fontSize: "14px" }}>Log in to your BloodLink account</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                    <div>
                        <label style={labelStyle}>Email Address</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={inputStyle}
                            placeholder="name@example.com"
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Password</label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            style={inputStyle}
                            placeholder="••••••••"
                        />
                    </div>

                    {message && (
                        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B", padding: "10px 14px", borderRadius: "6px", fontSize: "13px", textAlign: "center", fontWeight: "600" }}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            background: loading ? "#9CA3AF" : "#D9383A",
                            color: "#FFFFFF",
                            padding: "13px",
                            borderRadius: "6px",
                            border: "none",
                            fontSize: "15px",
                            fontWeight: "600",
                            cursor: loading ? "not-allowed" : "pointer",
                            marginTop: "8px",
                            transition: "background 0.2s"
                        }}
                    >
                        {loading ? "Logging in..." : "Log In"}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#666666" }}>
                    Don't have an account? <Link to="/register" style={{ color: "#D9383A", fontWeight: "700", textDecoration: "none" }}>Register</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
