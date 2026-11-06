import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function BloodRequest() {
    const user = JSON.parse(localStorage.getItem("bloodlinkUser") || "null");

    const [form, setForm] = useState({
        bloodGroup: "",
        units: 1,
        city: "",
        hospitalName: "",
        reason: ""
    });

    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
        // Clear alerts when the user types
        if (errorMsg) setErrorMsg("");
        if (successMsg) setSuccessMsg("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.bloodGroup) {
            setErrorMsg("Please select a blood group.");
            return;
        }

        const requestedUnits = Number(form.units);
        if (!requestedUnits || requestedUnits < 1) {
            setErrorMsg("Please enter at least 1 unit.");
            return;
        }

        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const response = await API.post("/blood-requests", {
                bloodGroup: form.bloodGroup,
                units: requestedUnits,
                city: form.city.trim(),
                hospitalName: form.hospitalName.trim(),
                reason: form.reason.trim()
            });

            setSuccessMsg(response.data.message || "Blood request submitted successfully!");
            // Reset the form
            setForm({
                bloodGroup: "",
                units: 1,
                city: "",
                hospitalName: "",
                reason: ""
            });
        } catch (err) {
            const message = err.response?.data?.message || "Failed to submit blood request. Please try again.";
            setErrorMsg(message);
        } finally {
            setLoading(false);
        }
    };

    // If user is not logged in, prompt them to login
    if (!user) {
        return (
            <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAF7F5", padding: "20px" }}>
                <div style={{ background: "#FFFFFF", padding: "40px", borderRadius: "8px", textAlign: "center", maxWidth: "420px", boxShadow: "0 4px 15px rgba(0,0,0,0.06)", borderTop: "4px solid #D9383A" }}>
                    <h2 style={{ color: "#222222", marginBottom: "12px", fontSize: "22px" }}>Login Required</h2>
                    <p style={{ color: "#666666", fontSize: "14px", marginBottom: "24px", lineHeight: "1.5" }}>
                        You must be logged in to submit a blood request so you can track its status.
                    </p>
                    <Link to="/login" style={{ display: "inline-block", background: "#D9383A", color: "#FFFFFF", padding: "12px 28px", borderRadius: "4px", textDecoration: "none", fontWeight: "600", fontSize: "14px" }}>
                        Log In Now
                    </Link>
                </div>
            </div>
        );
    }

    const inputStyle = {
        width: "100%",
        padding: "12px 14px",
        border: "1px solid #DCD6CD",
        borderRadius: "6px",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box",
        marginTop: "6px",
        backgroundColor: "#FFFFFF",
        color: "#222222"
    };

    const labelStyle = {
        fontSize: "13px",
        fontWeight: "600",
        color: "#333333",
        display: "block"
    };

    return (
        <div style={{ minHeight: "100vh", background: "#FAF7F5", padding: "50px 20px", fontFamily: "'Segoe UI', Roboto, sans-serif", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: "560px" }}>
                
                {/* Header navigation link */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h1 style={{ margin: 0, color: "#222222", fontSize: "24px", fontWeight: "700" }}>
                        Request Blood
                    </h1>
                    <Link to="/my-blood-requests" style={{ color: "#D9383A", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
                        View My Requests →
                    </Link>
                </div>

                <div style={{ background: "#FFFFFF", padding: "35px", borderRadius: "8px", borderTop: "4px solid #D9383A", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                    <p style={{ color: "#666666", fontSize: "14px", marginTop: 0, marginBottom: "25px", lineHeight: "1.5" }}>
                        Please enter accurate emergency details. Blood banks and matching donors in your city will be alerted.
                    </p>

                    {/* Success Alert */}
                    {successMsg && (
                        <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#166534", padding: "12px 16px", borderRadius: "6px", fontSize: "14px", marginBottom: "20px" }}>
                            {successMsg}
                        </div>
                    )}

                    {/* Error Alert */}
                    {errorMsg && (
                        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B", padding: "12px 16px", borderRadius: "6px", fontSize: "14px", marginBottom: "20px" }}>
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                        
                        {/* Blood Group & Units Row */}
                        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                            <div style={{ flex: 1, minWidth: "160px" }}>
                                <label style={labelStyle}>Blood Group *</label>
                                <select
                                    name="bloodGroup"
                                    style={inputStyle}
                                    value={form.bloodGroup}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Group</option>
                                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                                        <option key={g} value={g}>{g}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ flex: 1, minWidth: "140px" }}>
                                <label style={labelStyle}>Units Required *</label>
                                <input
                                    type="number"
                                    name="units"
                                    min="1"
                                    style={inputStyle}
                                    value={form.units}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* City */}
                        <div>
                            <label style={labelStyle}>City *</label>
                            <input
                                type="text"
                                name="city"
                                placeholder="e.g. Mumbai"
                                style={inputStyle}
                                value={form.city}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Hospital Name */}
                        <div>
                            <label style={labelStyle}>Hospital / Clinic Name *</label>
                            <input
                                type="text"
                                name="hospitalName"
                                placeholder="e.g. City General Hospital"
                                style={inputStyle}
                                value={form.hospitalName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Reason / Notes */}
                        <div>
                            <label style={labelStyle}>Reason / Medical Note *</label>
                            <textarea
                                name="reason"
                                rows="3"
                                placeholder="e.g. Scheduled surgery, trauma emergency, dengue treatment"
                                style={{ ...inputStyle, resize: "vertical" }}
                                value={form.reason}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Submit Button */}
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
                                marginTop: "10px",
                                transition: "background 0.2s ease"
                            }}
                        >
                            {loading ? "Submitting Request..." : "Submit Blood Request"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default BloodRequest;