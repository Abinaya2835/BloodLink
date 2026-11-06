import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "donor",
        bloodGroup: "",
        phone: "",
        city: "",
        state: "",
        bankName: "",
        address: ""
    });

    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setIsError(false);

        try {
            const res = await API.post("/auth/register", formData);
            setMessage(res.data.message || "Registration successful! Please log in.");
            setIsError(false);
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err) {
            setIsError(true);
            setMessage(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "11px 14px",
        border: "1px solid #DCD6CD",
        borderRadius: "6px",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box",
        marginTop: "5px",
        background: "#FFFFFF",
        color: "#222222"
    };

    const labelStyle = {
        fontSize: "13px",
        fontWeight: "600",
        color: "#333333"
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAF7F5", padding: "40px 20px", fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
            <div style={{ width: "100%", maxWidth: "520px", background: "#FFFFFF", padding: "40px", borderRadius: "8px", borderTop: "4px solid #D9383A", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                <div style={{ textAlign: "center", marginBottom: "25px" }}>
                    <div style={{ fontSize: "36px", marginBottom: "6px" }}>🩸</div>
                    <h2 style={{ margin: 0, color: "#222222", fontSize: "24px", fontWeight: "700" }}>Create an Account</h2>
                    <p style={{ margin: "6px 0 0", color: "#666666", fontSize: "14px" }}>Join the BloodLink community to save lives</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    
                    <div>
                        <label style={labelStyle}>Full Name *</label>
                        <input
                            style={inputStyle}
                            type="text"
                            required
                            placeholder="e.g. John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: "200px" }}>
                            <label style={labelStyle}>Email Address *</label>
                            <input
                                style={inputStyle}
                                type="email"
                                required
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div style={{ flex: 1, minWidth: "160px" }}>
                            <label style={labelStyle}>Password *</label>
                            <input
                                style={inputStyle}
                                type="password"
                                required
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Register As *</label>
                        <select
                            style={inputStyle}
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="donor">Blood Donor</option>
                            <option value="bloodbank">Blood Bank</option>
                        </select>
                    </div>

                    {/* Donor-specific field */}
                    {formData.role === "donor" ? (
                        <div>
                            <label style={labelStyle}>Blood Group *</label>
                            <select
                                style={inputStyle}
                                required
                                value={formData.bloodGroup}
                                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                            >
                                <option value="">Select Blood Group</option>
                                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        /* Blood Bank-specific field */
                        <div>
                            <label style={labelStyle}>Blood Bank Name *</label>
                            <input
                                style={inputStyle}
                                type="text"
                                required
                                placeholder="e.g. Red Cross Blood Center"
                                value={formData.bankName}
                                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                            />
                        </div>
                    )}

                    <div>
                        <label style={labelStyle}>Phone Number *</label>
                        <input
                            style={inputStyle}
                            type="tel"
                            required
                            placeholder="e.g. 9876543210"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div style={{ display: "flex", gap: "12px" }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>City *</label>
                            <input
                                style={inputStyle}
                                type="text"
                                required
                                placeholder="e.g. Mumbai"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>State *</label>
                            <input
                                style={inputStyle}
                                type="text"
                                required
                                placeholder="e.g. Maharashtra"
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            />
                        </div>
                    </div>

                    {formData.role === "bloodbank" && (
                        <div>
                            <label style={labelStyle}>Street Address *</label>
                            <input
                                style={inputStyle}
                                type="text"
                                required
                                placeholder="e.g. 124 Hospital Road"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                    )}

                    {message && (
                        <div style={{
                            background: isError ? "#FEF2F2" : "#F0FDF4",
                            border: `1px solid ${isError ? "#FECACA" : "#BBF7D0"}`,
                            color: isError ? "#991B1B" : "#166534",
                            padding: "10px 14px",
                            borderRadius: "6px",
                            fontSize: "13px",
                            textAlign: "center",
                            fontWeight: "600"
                        }}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            background: loading ? "#9CA3AF" : "#D9383A",
                            color: "#FFFFFF",
                            padding: "14px",
                            borderRadius: "6px",
                            border: "none",
                            fontSize: "15px",
                            fontWeight: "600",
                            cursor: loading ? "not-allowed" : "pointer",
                            marginTop: "8px",
                            transition: "background 0.2s"
                        }}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: "22px", fontSize: "14px", color: "#666666" }}>
                    Already have an account? <Link to="/login" style={{ color: "#D9383A", fontWeight: "700", textDecoration: "none" }}>Log In</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
