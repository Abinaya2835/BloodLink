import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function BloodBankRequests() {
    const user = JSON.parse(localStorage.getItem("bloodlinkUser") || "null");

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Filter states
    const [selectedGroup, setSelectedGroup] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [searchCity, setSearchCity] = useState("");

    const fetchRequests = async () => {
        setLoading(true);
        setErrorMsg("");
        try {
            const params = {};
            if (selectedGroup) params.bloodGroup = selectedGroup;
            if (selectedStatus) params.status = selectedStatus;
            if (searchCity.trim()) params.city = searchCity.trim();

            const res = await API.get("/blood-requests", { params });
            setRequests(res.data.requests || []);
        } catch (err) {
            console.error("Fetch requests error:", err);
            setErrorMsg(err.response?.data?.message || "Failed to load blood requests.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === "bloodbank" || user?.role === "admin") {
            fetchRequests();
        } else {
            setLoading(false);
        }
    }, [selectedGroup, selectedStatus]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchRequests();
    };

    const handleStatusUpdate = async (requestId, newStatus) => {
        const confirmAction = window.confirm(`Are you sure you want to mark this request as ${newStatus}?`);
        if (!confirmAction) return;

        setActionLoadingId(requestId);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const res = await API.put(`/blood-requests/${requestId}/status`, {
                status: newStatus
            });

            // Update in local state
            setRequests((prev) =>
                prev.map((req) =>
                    req._id === requestId ? res.data.bloodRequest : req
                )
            );
            setSuccessMsg(`Request successfully marked as ${newStatus}.`);
        } catch (err) {
            console.error("Update status error:", err);
            setErrorMsg(err.response?.data?.message || `Failed to update status to ${newStatus}.`);
        } finally {
            setActionLoadingId(null);
        }
    };

    // Status badge style helper (avoiding all blue colors)
    const getStatusBadgeStyle = (status) => {
        switch (status) {
            case "approved":
                return { background: "#DCFCE7", color: "#166534", border: "1px solid #BBF7D0" };
            case "fulfilled":
                return { background: "#FEF08A", color: "#854D0E", border: "1px solid #FDE047" };
            case "rejected":
                return { background: "#FEE2E2", color: "#991B1B", border: "1px solid #FECACA" };
            case "cancelled":
                return { background: "#F3F4F6", color: "#4B5563", border: "1px solid #E5E7EB" };
            case "pending":
            default:
                return { background: "#FFEDD5", color: "#C2410C", border: "1px solid #FED7AA" };
        }
    };

    // Guard: Only blood banks and admins are allowed
    if (!user || (user.role !== "bloodbank" && user.role !== "admin")) {
        return (
            <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAF7F5", padding: "20px" }}>
                <div style={{ background: "#FFFFFF", padding: "40px", borderRadius: "8px", textAlign: "center", maxWidth: "420px", boxShadow: "0 4px 15px rgba(0,0,0,0.06)", borderTop: "4px solid #D9383A" }}>
                    <h2 style={{ color: "#222222", marginBottom: "12px", fontSize: "22px" }}>Access Denied</h2>
                    <p style={{ color: "#666666", fontSize: "14px", marginBottom: "24px" }}>
                        Only registered Blood Bank accounts can view and manage incoming blood requests.
                    </p>
                    <Link to="/login" style={{ display: "inline-block", background: "#D9383A", color: "#FFFFFF", padding: "12px 28px", borderRadius: "4px", textDecoration: "none", fontWeight: "600", fontSize: "14px" }}>
                        Log In as Blood Bank
                    </Link>
                </div>
            </div>
        );
    }

    const selectStyle = {
        padding: "10px 14px",
        borderRadius: "6px",
        border: "1px solid #DCD6CD",
        fontSize: "14px",
        outline: "none",
        background: "#FFFFFF",
        color: "#222222",
        cursor: "pointer"
    };

    return (
        <div style={{ minHeight: "100vh", background: "#FAF7F5", padding: "50px 20px", fontFamily: "'Segoe UI', Roboto, sans-serif", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: "1000px" }}>
                
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "15px" }}>
                    <div>
                        <h1 style={{ margin: 0, color: "#222222", fontSize: "26px", fontWeight: "700" }}>
                            Incoming Blood Requests
                        </h1>
                        <p style={{ margin: "6px 0 0", color: "#666666", fontSize: "14px" }}>
                            Review requests from hospitals and patients in need of blood
                        </p>
                    </div>

                    <Link to="/blood-inventory" style={{ background: "#FFFFFF", color: "#D9383A", border: "1px solid #D9383A", padding: "10px 18px", borderRadius: "6px", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
                        📦 Check Blood Stock
                    </Link>
                </div>

                {/* Alerts */}
                {successMsg && (
                    <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#166534", padding: "12px 16px", borderRadius: "6px", fontSize: "14px", marginBottom: "20px" }}>
                        {successMsg}
                    </div>
                )}
                {errorMsg && (
                    <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B", padding: "12px 16px", borderRadius: "6px", fontSize: "14px", marginBottom: "20px" }}>
                        {errorMsg}
                    </div>
                )}

                {/* Filter & Search Bar */}
                <div style={{ background: "#FFFFFF", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", marginBottom: "25px", display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center" }}>
                    
                    {/* Filter by Blood Group */}
                    <div>
                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#666666", display: "block", marginBottom: "4px" }}>Blood Group</label>
                        <select style={selectStyle} value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                            <option value="">All Groups</option>
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filter by Status */}
                    <div>
                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#666666", display: "block", marginBottom: "4px" }}>Status</label>
                        <select style={selectStyle} value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="fulfilled">Fulfilled</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* Search by City */}
                    <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "10px", alignItems: "flex-end", flex: 1, minWidth: "220px" }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: "12px", fontWeight: "600", color: "#666666", display: "block", marginBottom: "4px" }}>Filter by City</label>
                            <input
                                type="text"
                                placeholder="e.g. Mumbai, Chennai..."
                                value={searchCity}
                                onChange={(e) => setSearchCity(e.target.value)}
                                style={{ ...selectStyle, width: "100%", boxSizing: "border-box" }}
                            />
                        </div>
                        <button
                            type="submit"
                            style={{
                                background: "#D9383A",
                                color: "#FFFFFF",
                                padding: "10px 18px",
                                borderRadius: "6px",
                                border: "none",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: "pointer",
                                height: "42px"
                            }}
                        >
                            Filter
                        </button>
                    </form>
                </div>

                {/* Content Area */}
                {loading ? (
                    <div style={{ background: "#FFFFFF", padding: "50px", textAlign: "center", borderRadius: "8px", color: "#666666" }}>
                        <p style={{ margin: 0, fontSize: "15px" }}>Loading incoming blood requests...</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div style={{ background: "#FFFFFF", padding: "60px 20px", textAlign: "center", borderRadius: "8px", border: "1px dashed #DCD6CD" }}>
                        <div style={{ fontSize: "40px", marginBottom: "12px" }}>📋</div>
                        <h3 style={{ color: "#222222", fontSize: "18px", margin: "0 0 8px" }}>No Blood Requests Found</h3>
                        <p style={{ color: "#666666", fontSize: "14px", margin: 0 }}>
                            There are currently no requests matching your selected filters.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                        {requests.map((r) => {
                            const badgeStyle = getStatusBadgeStyle(r.status);
                            const requestDate = new Date(r.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                            });
                            const isBusy = actionLoadingId === r._id;

                            return (
                                <div
                                    key={r._id}
                                    style={{
                                        background: "#FFFFFF",
                                        borderRadius: "8px",
                                        padding: "22px",
                                        borderLeft: `5px solid ${r.status === "approved" ? "#16A34A" : r.status === "rejected" ? "#DC2626" : r.status === "cancelled" ? "#9CA3AF" : "#D9383A"}`,
                                        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between"
                                    }}
                                >
                                    <div>
                                        {/* Blood Group and Status Header */}
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                                            <span style={{ fontSize: "22px", fontWeight: "800", color: "#D9383A" }}>
                                                {r.bloodGroup} Blood
                                            </span>
                                            <span style={{ ...badgeStyle, padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "700", textTransform: "capitalize" }}>
                                                {r.status}
                                            </span>
                                        </div>

                                        {/* Details */}
                                        <p style={{ margin: "5px 0", color: "#444444", fontSize: "14px" }}>
                                            <strong>Required Units:</strong> {r.units} {r.units > 1 ? "units" : "unit"}
                                        </p>
                                        <p style={{ margin: "5px 0", color: "#444444", fontSize: "14px" }}>
                                            <strong>Hospital:</strong> {r.hospitalName}
                                        </p>
                                        <p style={{ margin: "5px 0", color: "#444444", fontSize: "14px" }}>
                                            <strong>City:</strong> {r.city}
                                        </p>
                                        {r.requester?.name && (
                                            <p style={{ margin: "5px 0", color: "#666666", fontSize: "13px" }}>
                                                <strong>Requester:</strong> {r.requester.name} ({r.requester.email})
                                            </p>
                                        )}
                                        <p style={{ margin: "10px 0 0", color: "#555555", fontSize: "13px", fontStyle: "italic", lineHeight: "1.4", background: "#FAF7F5", padding: "8px 10px", borderRadius: "4px" }}>
                                            "{r.reason}"
                                        </p>

                                        {/* Associated Blood Bank Info if approved */}
                                        {r.bloodBank && (
                                            <div style={{ marginTop: "10px", padding: "8px 10px", background: "#F0FDF4", borderRadius: "4px", fontSize: "12px", color: "#166534" }}>
                                                ✓ Assigned to: <strong>{r.bloodBank.bankName || "Your Blood Bank"}</strong>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons & Footer */}
                                    <div style={{ borderTop: "1px solid #F0ECE8", marginTop: "16px", paddingTop: "14px" }}>
                                        <div style={{ fontSize: "12px", color: "#888888", marginBottom: "12px" }}>
                                            Date: {requestDate}
                                        </div>

                                        {/* Actions for Pending Requests */}
                                        {r.status === "pending" && (
                                            <div style={{ display: "flex", gap: "10px" }}>
                                                <button
                                                    type="button"
                                                    disabled={isBusy}
                                                    onClick={() => handleStatusUpdate(r._id, "approved")}
                                                    style={{
                                                        flex: 1,
                                                        background: "#16A34A",
                                                        color: "#FFFFFF",
                                                        padding: "9px 0",
                                                        borderRadius: "5px",
                                                        border: "none",
                                                        fontSize: "13px",
                                                        fontWeight: "600",
                                                        cursor: isBusy ? "not-allowed" : "pointer"
                                                    }}
                                                >
                                                    {isBusy ? "Updating..." : "✓ Approve"}
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={isBusy}
                                                    onClick={() => handleStatusUpdate(r._id, "rejected")}
                                                    style={{
                                                        flex: 1,
                                                        background: "#FFF1F2",
                                                        color: "#DC2626",
                                                        border: "1px solid #FECACA",
                                                        padding: "9px 0",
                                                        borderRadius: "5px",
                                                        fontSize: "13px",
                                                        fontWeight: "600",
                                                        cursor: isBusy ? "not-allowed" : "pointer"
                                                    }}
                                                >
                                                    ✕ Reject
                                                </button>
                                            </div>
                                        )}

                                        {/* Action if already Approved: can mark Fulfilled */}
                                        {r.status === "approved" && (
                                            <button
                                                type="button"
                                                disabled={isBusy}
                                                onClick={() => handleStatusUpdate(r._id, "fulfilled")}
                                                style={{
                                                    width: "100%",
                                                    background: "#EAB308",
                                                    color: "#FFFFFF",
                                                    padding: "9px 0",
                                                    borderRadius: "5px",
                                                    border: "none",
                                                    fontSize: "13px",
                                                    fontWeight: "600",
                                                    cursor: isBusy ? "not-allowed" : "pointer"
                                                }}
                                            >
                                                {isBusy ? "Updating..." : "Mark as Fulfilled 📦"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BloodBankRequests;
