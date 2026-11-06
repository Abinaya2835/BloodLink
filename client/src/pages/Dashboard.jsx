import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("bloodlinkUser") || "null");

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ phone: "", city: "", state: "" });
    const [message, setMessage] = useState("");
    const [toggleLoading, setToggleLoading] = useState(false);

    const fetchProfile = async () => {
        if (user?.role === "donor") {
            try {
                const res = await API.get(`/donors/profile/${user.id}`);
                setProfile(res.data);
                setEditForm({
                    phone: res.data.phone || "",
                    city: res.data.city || "",
                    state: res.data.state || ""
                });
            } catch (err) {
                console.error("Fetch profile error:", err);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === "admin") {
            navigate("/admin-dashboard");
            return;
        }
        fetchProfile();
    }, []);

    // Toggle Donor Availability
    const handleToggleAvailability = async () => {
        if (!profile) return;
        setToggleLoading(true);
        setMessage("");

        const newStatus = !profile.isAvailable;
        try {
            await API.put(`/donors/profile/${user.id}`, {
                isAvailable: newStatus
            });
            setProfile((prev) => ({ ...prev, isAvailable: newStatus }));
            setMessage(`Availability changed to: ${newStatus ? "Available to Donate" : "Unavailable"}`);
        } catch (err) {
            console.error("Toggle availability error:", err);
            setMessage("Failed to update availability status.");
        } finally {
            setToggleLoading(false);
        }
    };

    // Save Profile Edits
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            const res = await API.put(`/donors/profile/${user.id}`, editForm);
            setProfile(res.data.donor);
            setIsEditing(false);
            setMessage("Profile updated successfully!");
        } catch (err) {
            console.error("Save profile error:", err);
            setMessage(err.response?.data?.message || "Failed to update profile.");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    if (!user) return <div style={{ minHeight: "100vh", background: "#FAF7F5" }}></div>;

    const inputStyle = {
        width: "100%",
        padding: "10px 14px",
        borderRadius: "6px",
        border: "1px solid #DCD6CD",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box",
        marginTop: "4px"
    };

    return (
        <div style={{ minHeight: "100vh", background: "#FAF7F5", padding: "50px 20px", fontFamily: "'Segoe UI', Roboto, sans-serif", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: "800px" }}>
                
                {/* Header Card */}
                <div style={{ background: "#222222", borderRadius: "8px", padding: "26px", display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}>
                    <div style={{ width: "65px", height: "65px", background: "#D9383A", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px" }}>🩸</div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#FFFFFF" }}>
                            {user.role === "donor" ? "Donor Dashboard" : "Blood Bank Dashboard"}
                        </h1>
                        <p style={{ margin: "5px 0 0", color: "#D1D5DB", fontSize: "14px" }}>
                            Welcome back, <strong style={{ color: "#FFFFFF" }}>{user.name}</strong> ({user.role === "donor" ? "Blood Donor" : "Blood Bank"})
                        </p>
                    </div>
                </div>

                {/* Status Alert */}
                {message && (
                    <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#166534", padding: "12px 16px", borderRadius: "6px", fontSize: "14px", marginBottom: "20px" }}>
                        {message}
                    </div>
                )}

                {/* Dashboard Main Content */}
                <div style={{ background: "#FFFFFF", borderRadius: "8px", padding: "30px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                    {user.role === "donor" ? (
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #D9383A", paddingBottom: "10px", marginBottom: "20px" }}>
                                <h2 style={{ color: "#222222", margin: 0, fontSize: "20px" }}>
                                    Your Donor Profile
                                </h2>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    style={{
                                        background: "transparent",
                                        border: "1px solid #D9383A",
                                        color: "#D9383A",
                                        padding: "6px 14px",
                                        borderRadius: "4px",
                                        fontSize: "13px",
                                        fontWeight: "600",
                                        cursor: "pointer"
                                    }}
                                >
                                    {isEditing ? "Cancel" : "✏️ Edit Profile"}
                                </button>
                            </div>

                            {loading ? (
                                <p style={{ color: "#666666" }}>Loading profile details...</p>
                            ) : isEditing ? (
                                /* Edit Profile Form */
                                <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                    <div>
                                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#333" }}>Phone Number</label>
                                        <input
                                            type="tel"
                                            value={editForm.phone}
                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                            style={inputStyle}
                                            required
                                        />
                                    </div>
                                    <div style={{ display: "flex", gap: "15px" }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: "13px", fontWeight: "600", color: "#333" }}>City</label>
                                            <input
                                                type="text"
                                                value={editForm.city}
                                                onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                                                style={inputStyle}
                                                required
                                            />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: "13px", fontWeight: "600", color: "#333" }}>State</label>
                                            <input
                                                type="text"
                                                value={editForm.state}
                                                onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                                                style={inputStyle}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        style={{
                                            background: "#D9383A",
                                            color: "#FFFFFF",
                                            padding: "12px",
                                            borderRadius: "6px",
                                            border: "none",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            cursor: "pointer",
                                            marginTop: "10px"
                                        }}
                                    >
                                        Save Changes
                                    </button>
                                </form>
                            ) : profile ? (
                                /* View Profile Grid */
                                <div>
                                    <div style={{ display: "grid", gap: "15px", gridTemplateColumns: "1fr 1fr" }}>
                                        <div style={{ background: "#FAF7F5", padding: "16px", borderRadius: "6px" }}>
                                            <div style={{ fontSize: "12px", color: "#666666", textTransform: "uppercase", fontWeight: "600" }}>Blood Group</div>
                                            <div style={{ fontSize: "22px", fontWeight: "800", color: "#D9383A", marginTop: "4px" }}>{profile.bloodGroup}</div>
                                        </div>

                                        <div style={{ background: "#FAF7F5", padding: "16px", borderRadius: "6px" }}>
                                            <div style={{ fontSize: "12px", color: "#666666", textTransform: "uppercase", fontWeight: "600" }}>Phone</div>
                                            <div style={{ fontSize: "16px", fontWeight: "700", color: "#222222", marginTop: "4px" }}>{profile.phone}</div>
                                        </div>

                                        <div style={{ background: "#FAF7F5", padding: "16px", borderRadius: "6px" }}>
                                            <div style={{ fontSize: "12px", color: "#666666", textTransform: "uppercase", fontWeight: "600" }}>Location</div>
                                            <div style={{ fontSize: "16px", fontWeight: "700", color: "#222222", marginTop: "4px" }}>{profile.city}, {profile.state}</div>
                                        </div>

                                        <div style={{ background: "#FAF7F5", padding: "16px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <div>
                                                <div style={{ fontSize: "12px", color: "#666666", textTransform: "uppercase", fontWeight: "600" }}>Donation Status</div>
                                                <div style={{ fontSize: "16px", fontWeight: "700", color: profile.isAvailable ? "#16A34A" : "#DC2626", marginTop: "4px" }}>
                                                    {profile.isAvailable ? "● Available" : "○ Unavailable"}
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleToggleAvailability}
                                                disabled={toggleLoading}
                                                style={{
                                                    background: profile.isAvailable ? "#FEE2E2" : "#DCFCE7",
                                                    color: profile.isAvailable ? "#DC2626" : "#166534",
                                                    border: `1px solid ${profile.isAvailable ? "#FECACA" : "#BBF7D0"}`,
                                                    padding: "6px 12px",
                                                    borderRadius: "4px",
                                                    fontSize: "12px",
                                                    fontWeight: "600",
                                                    cursor: toggleLoading ? "not-allowed" : "pointer"
                                                }}
                                            >
                                                {toggleLoading ? "Updating..." : profile.isAvailable ? "Set Unavailable" : "Set Available"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Donor Quick Actions */}
                                    <div style={{ display: "flex", gap: "12px", marginTop: "25px", flexWrap: "wrap" }}>
                                        <button onClick={() => navigate("/blood-request")} style={{ flex: 1, minWidth: "150px", background: "#D9383A", color: "#FFFFFF", padding: "12px", borderRadius: "6px", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                                            Request Blood
                                        </button>
                                        <button onClick={() => navigate("/my-blood-requests")} style={{ flex: 1, minWidth: "150px", background: "#FFFFFF", color: "#222222", border: "1px solid #DCD6CD", padding: "12px", borderRadius: "6px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                                            My Requests History
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p style={{ color: "#666666" }}>No donor profile found.</p>
                            )}
                        </div>
                    ) : (
                        <div>
                            <h2 style={{ color: "#222222", marginTop: 0, fontSize: "20px", borderBottom: "2px solid #D9383A", paddingBottom: "10px", display: "inline-block" }}>
                                Blood Bank Actions
                            </h2>
                            <p style={{ color: "#666666", marginBottom: "20px", marginTop: "15px", fontSize: "14px" }}>
                                Manage your blood inventory and respond to urgent hospital and patient blood requests.
                            </p>
                            
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                <button
                                    onClick={() => navigate("/blood-bank-requests")}
                                    style={{
                                        background: "#D9383A",
                                        color: "#FFFFFF",
                                        padding: "16px 20px",
                                        borderRadius: "6px",
                                        border: "none",
                                        fontSize: "15px",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "6px"
                                    }}
                                >
                                    <span style={{ fontSize: "24px" }}>📋</span>
                                    <span>Incoming Blood Requests</span>
                                </button>

                                <button
                                    onClick={() => navigate("/blood-inventory")}
                                    style={{
                                        background: "#222222",
                                        color: "#FFFFFF",
                                        padding: "16px 20px",
                                        borderRadius: "6px",
                                        border: "none",
                                        fontSize: "15px",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "6px"
                                    }}
                                >
                                    <span style={{ fontSize: "24px" }}>📦</span>
                                    <span>Manage Blood Inventory</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
                    <button onClick={() => navigate("/search-donors")} style={{ flex: 1, background: "#FFFFFF", color: "#222222", padding: "14px", borderRadius: "6px", border: "1px solid #DCD6CD", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                        🔍 Find Donors
                    </button>
                    <button onClick={handleLogout} style={{ flex: 1, background: "#FEE2E2", color: "#DC2626", padding: "14px", borderRadius: "6px", border: "1px solid #FECACA", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                        Log Out
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;