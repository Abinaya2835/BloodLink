import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function MyBloodRequests() {
    const user = JSON.parse(localStorage.getItem("bloodlinkUser") || "null");
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const fetchRequests = async () => {
        setLoading(true);
        setErrorMsg("");
        try {
            const res = await API.get("/blood-requests/my");
            setRequests(res.data.requests || []);
        } catch (err) {
            console.error("Fetch requests error:", err);
            setErrorMsg(err.response?.data?.message || "Failed to load your blood requests.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchRequests();
        } else {
            setLoading(false);
        }
    }, []);

    // Handler to cancel a pending request
    const handleCancelRequest = async (requestId) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this blood request?");
        if (!confirmCancel) return;

        setCancellingId(requestId);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            await API.put(`/blood-requests/${requestId}/cancel`);
            // Update the state locally so the UI reflects the change immediately
            setRequests((prev) =>
                prev.map((req) =>
                    req._id === requestId ? { ...req, status: "cancelled" } : req
                )
            );
            setSuccessMsg("Blood request cancelled successfully.");
        } catch (err) {
            console.error("Cancel request error:", err);
            setErrorMsg(err.response?.data?.message || "Failed to cancel blood request.");
        } finally {
            setCancellingId(null);
        }
    };

    // Status badge styling helper (strictly avoiding blue shades)
    const getStatusBadgeStyle = (status) => {
        switch (status) {
            case "approved":
                return { background: "#DCFCE7", color: "#166534", border: "1px solid #BBF7D0" };
            case "fulfilled":
                return { background: "#FEF08A", color: "#854D0E", border: "1px solid #FDE047" };
            case "cancelled":
                return { background: "#F3F4F6", color: "#4B5563", border: "1px solid #E5E7EB" };
            case "pending":
            default:
                return { background: "#FFEDD5", color: "#C2410C", border: "1px solid #FED7AA" };
        }
    };

    if (!user) {
        return (
            <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAF7F5", padding: "20px" }}>
                <div style={{ background: "#FFFFFF", padding: "40px", borderRadius: "8px", textAlign: "center", maxWidth: "420px", boxShadow: "0 4px 15px rgba(0,0,0,0.06)", borderTop: "4px solid #D9383A" }}>
                    <h2 style={{ color: "#222222", marginBottom: "12px", fontSize: "22px" }}>Login Required</h2>
                    <p style={{ color: "#666666", fontSize: "14px", marginBottom: "24px" }}>
                        Please log in to view your submitted blood requests.
                    </p>
                    <Link to="/login" style={{ display: "inline-block", background: "#D9383A", color: "#FFFFFF", padding: "12px 28px", borderRadius: "4px", textDecoration: "none", fontWeight: "600", fontSize: "14px" }}>
                        Log In Now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#FAF7F5", padding: "50px 20px", fontFamily: "'Segoe UI', Roboto, sans-serif", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: "900px" }}>
                
                {/* Header with action */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "15px" }}>
                    <div>
                        <h1 style={{ margin: 0, color: "#222222", fontSize: "26px", fontWeight: "700" }}>
                            My Blood Requests
                        </h1>
                        <p style={{ margin: "6px 0 0", color: "#666666", fontSize: "14px" }}>
                            Track the status of all your submitted blood requests
                        </p>
                    </div>

                    <Link to="/blood-request" style={{ background: "#D9383A", color: "#FFFFFF", padding: "10px 20px", borderRadius: "6px", textDecoration: "none", fontSize: "14px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        + New Request
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

                {/* Loading State */}
                {loading ? (
                    <div style={{ background: "#FFFFFF", padding: "50px", textAlign: "center", borderRadius: "8px", color: "#666666" }}>
                        <p style={{ margin: 0, fontSize: "15px" }}>Loading your requests...</p>
                    </div>
                ) : requests.length === 0 ? (
                    /* Empty State */
                    <div style={{ background: "#FFFFFF", padding: "60px 20px", textAlign: "center", borderRadius: "8px", border: "1px dashed #DCD6CD" }}>
                        <div style={{ fontSize: "40px", marginBottom: "12px" }}>🩸</div>
                        <h3 style={{ color: "#222222", fontSize: "18px", margin: "0 0 8px" }}>No Blood Requests Found</h3>
                        <p style={{ color: "#666666", fontSize: "14px", margin: "0 0 20px" }}>You have not submitted any blood requests yet.</p>
                        <Link to="/blood-request" style={{ background: "#D9383A", color: "#FFFFFF", padding: "10px 22px", borderRadius: "4px", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
                            Submit a Request
                        </Link>
                    </div>
                ) : (
                    /* Requests Grid */
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                        {requests.map((r) => {
                            const badgeStyle = getStatusBadgeStyle(r.status);
                            const requestDate = new Date(r.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                            });

                            return (
                                <div
                                    key={r._id}
                                    style={{
                                        background: "#FFFFFF",
                                        borderRadius: "8px",
                                        padding: "22px",
                                        borderLeft: `5px solid ${r.status === "cancelled" ? "#9CA3AF" : "#D9383A"}`,
                                        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between"
                                    }}
                                >
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                                            <span style={{ fontSize: "20px", fontWeight: "800", color: "#D9383A" }}>
                                                {r.bloodGroup}
                                            </span>
                                            <span style={{ ...badgeStyle, padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "700", textTransform: "capitalize" }}>
                                                {r.status}
                                            </span>
                                        </div>

                                        <p style={{ margin: "6px 0", color: "#444444", fontSize: "14px" }}>
                                            <strong>Units Needed:</strong> {r.units} {r.units > 1 ? "units" : "unit"}
                                        </p>
                                        <p style={{ margin: "6px 0", color: "#444444", fontSize: "14px" }}>
                                            <strong>Hospital:</strong> {r.hospitalName}
                                        </p>
                                        <p style={{ margin: "6px 0", color: "#444444", fontSize: "14px" }}>
                                            <strong>City:</strong> {r.city}
                                        </p>
                                        <p style={{ margin: "8px 0 0", color: "#666666", fontSize: "13px", fontStyle: "italic", lineHeight: "1.4" }}>
                                            "{r.reason}"
                                        </p>
                                    </div>

                                    {/* Footer with date and cancel action */}
                                    <div style={{ borderTop: "1px solid #F0ECE8", marginTop: "16px", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontSize: "12px", color: "#888888" }}>
                                            Requested: {requestDate}
                                        </span>

                                        {r.status === "pending" && (
                                            <button
                                                type="button"
                                                onClick={() => handleCancelRequest(r._id)}
                                                disabled={cancellingId === r._id}
                                                style={{
                                                    background: "#FFF1F2",
                                                    color: "#E11D48",
                                                    border: "1px solid #FECDD3",
                                                    padding: "5px 10px",
                                                    borderRadius: "4px",
                                                    fontSize: "12px",
                                                    fontWeight: "600",
                                                    cursor: cancellingId === r._id ? "not-allowed" : "pointer"
                                                }}
                                            >
                                                {cancellingId === r._id ? "Cancelling..." : "Cancel"}
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

export default MyBloodRequests;