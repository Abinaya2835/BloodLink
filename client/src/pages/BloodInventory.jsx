import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function BloodInventory() {
    const user = JSON.parse(localStorage.getItem("bloodlinkUser") || "null");

    const [inventory, setInventory] = useState([]);
    const [bloodGroup, setBloodGroup] = useState("");
    const [units, setUnits] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const fetchInventory = async () => {
        if (!user) return;
        setLoading(true);
        setErrorMsg("");
        try {
            const res = await API.get(`/blood-inventory/${user.id}`);
            setInventory(res.data.inventory || []);
        } catch (err) {
            console.error("Fetch inventory error:", err);
            setErrorMsg(err.response?.data?.message || "Failed to load blood inventory.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === "bloodbank" || user?.role === "admin") {
            fetchInventory();
        } else {
            setLoading(false);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");
        setErrorMsg("");

        try {
            const res = await API.put(`/blood-inventory/${user.id}`, {
                bloodGroup,
                units: Number(units)
            });

            setInventory((prev) => {
                const exists = prev.find((i) => i.bloodGroup === bloodGroup);
                if (exists) {
                    return prev.map((i) =>
                        i.bloodGroup === bloodGroup ? res.data.inventory : i
                    );
                }
                return [...prev, res.data.inventory];
            });

            setMessage(`Stock for blood group ${bloodGroup} updated to ${units} units successfully.`);
            setBloodGroup("");
            setUnits("");
        } catch (err) {
            console.error("Save stock error:", err);
            setErrorMsg(err.response?.data?.message || "Failed to update stock.");
        } finally {
            setSaving(false);
        }
    };

    if (!user || (user.role !== "bloodbank" && user.role !== "admin")) {
        return (
            <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAF7F5", padding: "20px" }}>
                <div style={{ background: "#FFFFFF", padding: "40px", borderRadius: "8px", textAlign: "center", maxWidth: "420px", boxShadow: "0 4px 15px rgba(0,0,0,0.06)", borderTop: "4px solid #D9383A" }}>
                    <h2 style={{ color: "#222222", marginBottom: "12px", fontSize: "22px" }}>Access Denied</h2>
                    <p style={{ color: "#666666", fontSize: "14px", marginBottom: "24px" }}>
                        Only registered Blood Bank accounts can manage blood inventory.
                    </p>
                    <Link to="/login" style={{ display: "inline-block", background: "#D9383A", color: "#FFFFFF", padding: "12px 28px", borderRadius: "4px", textDecoration: "none", fontWeight: "600", fontSize: "14px" }}>
                        Log In as Blood Bank
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
        background: "#FFFFFF",
        color: "#222222"
    };

    return (
        <div style={{ minHeight: "100vh", background: "#FAF7F5", padding: "50px 20px", fontFamily: "'Segoe UI', Roboto, sans-serif", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: "850px", display: "flex", flexDirection: "column", gap: "25px" }}>
                
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
                    <div>
                        <h1 style={{ margin: 0, color: "#222222", fontSize: "26px", fontWeight: "700" }}>
                            Blood Inventory Management
                        </h1>
                        <p style={{ margin: "6px 0 0", color: "#666666", fontSize: "14px" }}>
                            Maintain real-time unit counts for all eight blood groups
                        </p>
                    </div>

                    <Link to="/blood-bank-requests" style={{ background: "#222222", color: "#FFFFFF", padding: "10px 18px", borderRadius: "6px", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
                        📋 View Incoming Requests
                    </Link>
                </div>

                {/* Alerts */}
                {message && (
                    <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#166534", padding: "12px 16px", borderRadius: "6px", fontSize: "14px" }}>
                        {message}
                    </div>
                )}
                {errorMsg && (
                    <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B", padding: "12px 16px", borderRadius: "6px", fontSize: "14px" }}>
                        {errorMsg}
                    </div>
                )}

                {/* Add / Update Stock Card */}
                <div style={{ background: "#FFFFFF", borderRadius: "8px", padding: "30px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", borderTop: "4px solid #D9383A" }}>
                    <h2 style={{ color: "#222222", marginTop: 0, marginBottom: "20px", fontSize: "18px", fontWeight: "700" }}>
                        Add / Update Stock
                    </h2>
                    
                    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "flex-end" }}>
                        <div style={{ flex: 1, minWidth: "180px" }}>
                            <label style={{ fontSize: "13px", fontWeight: "600", color: "#333333" }}>Blood Group *</label>
                            <select
                                style={inputStyle}
                                value={bloodGroup}
                                onChange={(e) => setBloodGroup(e.target.value)}
                                required
                            >
                                <option value="">Select Group</option>
                                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ flex: 1, minWidth: "180px" }}>
                            <label style={{ fontSize: "13px", fontWeight: "600", color: "#333333" }}>Available Units *</label>
                            <input
                                style={inputStyle}
                                type="number"
                                min="0"
                                placeholder="e.g. 10"
                                value={units}
                                onChange={(e) => setUnits(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                background: saving ? "#9CA3AF" : "#D9383A",
                                color: "#FFFFFF",
                                padding: "12px 28px",
                                borderRadius: "6px",
                                border: "none",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: saving ? "not-allowed" : "pointer",
                                height: "45px"
                            }}
                        >
                            {saving ? "Saving..." : "Save Stock"}
                        </button>
                    </form>
                </div>

                {/* Current Stock Grid */}
                <div style={{ background: "#FFFFFF", borderRadius: "8px", padding: "30px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                    <h2 style={{ color: "#222222", marginTop: 0, marginBottom: "20px", fontSize: "18px", fontWeight: "700" }}>
                        Current Inventory Stock
                    </h2>

                    {loading ? (
                        <p style={{ color: "#666666" }}>Loading inventory...</p>
                    ) : inventory.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px 20px", color: "#666666", border: "1px dashed #DCD6CD", borderRadius: "6px" }}>
                            <div style={{ fontSize: "32px", marginBottom: "8px" }}>📦</div>
                            <p style={{ margin: 0, fontSize: "14px" }}>No inventory records yet. Use the form above to add blood group stock.</p>
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "15px" }}>
                            {inventory.map((item) => {
                                const isLowStock = item.units <= 2;
                                return (
                                    <div
                                        key={item._id}
                                        style={{
                                            background: "#FAF7F5",
                                            borderRadius: "8px",
                                            padding: "20px",
                                            textAlign: "center",
                                            borderTop: `4px solid ${isLowStock ? "#DC2626" : "#16A34A"}`,
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                                        }}
                                    >
                                        <div style={{ color: "#D9383A", fontWeight: "800", fontSize: "24px" }}>
                                            {item.bloodGroup}
                                        </div>
                                        <div style={{ fontSize: "28px", fontWeight: "800", color: "#222222", margin: "6px 0 2px" }}>
                                            {item.units}
                                        </div>
                                        <div style={{ fontSize: "12px", color: "#666666", textTransform: "uppercase", fontWeight: "600" }}>
                                            Units
                                        </div>
                                        {isLowStock && (
                                            <span style={{ display: "inline-block", marginTop: "8px", fontSize: "11px", fontWeight: "700", color: "#991B1B", background: "#FEE2E2", padding: "2px 6px", borderRadius: "4px" }}>
                                                {item.units === 0 ? "Out of Stock" : "Low Stock"}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default BloodInventory;
