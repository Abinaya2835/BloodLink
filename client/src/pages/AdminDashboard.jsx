import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function AdminDashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("bloodlinkUser") || "null");

    const [activeTab, setActiveTab] = useState("overview");
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [donors, setDonors] = useState([]);
    const [bloodBanks, setBloodBanks] = useState([]);
    const [requests, setRequests] = useState([]);

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Search and filter states for Users tab
    const [userSearch, setUserSearch] = useState("");
    const [userRoleFilter, setUserRoleFilter] = useState("");

    // Fetch platform stats
    const fetchStats = async () => {
        try {
            const res = await API.get("/admin/stats");
            setStats(res.data.stats);
        } catch (err) {
            console.error("Fetch stats error:", err);
            setErrorMsg("Failed to load platform statistics.");
        }
    };

    // Fetch users
    const fetchUsers = async () => {
        try {
            const params = {};
            if (userSearch.trim()) params.search = userSearch.trim();
            if (userRoleFilter) params.role = userRoleFilter;

            const res = await API.get("/admin/users", { params });
            setUsers(res.data.users || []);
        } catch (err) {
            console.error("Fetch users error:", err);
        }
    };

    // Fetch donors
    const fetchDonors = async () => {
        try {
            const res = await API.get("/admin/donors");
            setDonors(res.data.donors || []);
        } catch (err) {
            console.error("Fetch donors error:", err);
        }
    };

    // Fetch blood banks
    const fetchBloodBanks = async () => {
        try {
            const res = await API.get("/admin/blood-banks");
            setBloodBanks(res.data.bloodBanks || []);
        } catch (err) {
            console.error("Fetch blood banks error:", err);
        }
    };

    // Fetch requests
    const fetchRequests = async () => {
        try {
            const res = await API.get("/admin/requests");
            setRequests(res.data.requests || []);
        } catch (err) {
            console.error("Fetch requests error:", err);
        }
    };

    // Initial load
    useEffect(() => {
        if (user?.role === "admin") {
            setLoading(true);
            Promise.all([fetchStats(), fetchUsers(), fetchDonors(), fetchBloodBanks(), fetchRequests()]).finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    // Refresh users when filter changes
    useEffect(() => {
        if (activeTab === "users") {
            fetchUsers();
        }
    }, [userRoleFilter]);

    const handleUserSearchSubmit = (e) => {
        e.preventDefault();
        fetchUsers();
    };

    // Delete user handler
    const handleDeleteUser = async (userId, userName) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete user "${userName}"? This will also remove their linked profile records.`);
        if (!confirmDelete) return;

        setActionLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const res = await API.delete(`/admin/users/${userId}`);
            setSuccessMsg(res.data.message || "User deleted successfully.");
            // Refresh lists
            fetchUsers();
            fetchDonors();
            fetchBloodBanks();
            fetchStats();
        } catch (err) {
            console.error("Delete user error:", err);
            setErrorMsg(err.response?.data?.message || "Failed to delete user.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    // Guard: Only admins allowed
    if (!user || user.role !== "admin") {
        return (
            <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAF7F5", padding: "20px" }}>
                <div style={{ background: "#FFFFFF", padding: "40px", borderRadius: "8px", textAlign: "center", maxWidth: "440px", boxShadow: "0 4px 15px rgba(0,0,0,0.06)", borderTop: "4px solid #D9383A" }}>
                    <div style={{ fontSize: "40px", marginBottom: "10px" }}>🛡️</div>
                    <h2 style={{ color: "#222222", marginBottom: "12px", fontSize: "22px" }}>Admin Access Required</h2>
                    <p style={{ color: "#666666", fontSize: "14px", marginBottom: "24px", lineHeight: "1.5" }}>
                        You must be logged in as an administrator (e.g. <code>admin@bloodlink.com</code>) to access the Admin Control Center.
                    </p>
                    <Link
                        to="/login"
                        onClick={() => localStorage.clear()}
                        style={{ display: "inline-block", background: "#D9383A", color: "#FFFFFF", padding: "12px 28px", borderRadius: "4px", textDecoration: "none", fontWeight: "600", fontSize: "14px" }}
                    >
                        Log In as Admin
                    </Link>
                </div>
            </div>
        );
    }

    // Status badge style helper
    const getStatusBadge = (status) => {
        switch (status) {
            case "approved":
                return { bg: "#DCFCE7", text: "#166534" };
            case "fulfilled":
                return { bg: "#FEF08A", text: "#854D0E" };
            case "rejected":
                return { bg: "#FEE2E2", text: "#991B1B" };
            case "cancelled":
                return { bg: "#F3F4F6", text: "#4B5563" };
            case "pending":
            default:
                return { bg: "#FFEDD5", text: "#C2410C" };
        }
    };

    const tabButtonStyle = (tabName) => ({
        padding: "12px 22px",
        background: activeTab === tabName ? "#D9383A" : "#FFFFFF",
        color: activeTab === tabName ? "#FFFFFF" : "#444444",
        border: "none",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s"
    });

    return (
        <div style={{ minHeight: "100vh", background: "#FAF7F5", padding: "40px 20px", fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
            <div style={{ maxWidth: "1150px", margin: "0 auto" }}>
                
                {/* Admin Header */}
                <div style={{ background: "#222222", borderRadius: "8px", padding: "26px 30px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{ width: "55px", height: "55px", background: "#D9383A", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>
                            🛡️
                        </div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#FFFFFF" }}>
                                BloodLink Admin Portal
                            </h1>
                            <p style={{ margin: "4px 0 0", color: "#D1D5DB", fontSize: "14px" }}>
                                Administrator: <strong style={{ color: "#FFFFFF" }}>{user.name}</strong> ({user.email})
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        style={{
                            background: "#333333",
                            color: "#FCA5A5",
                            border: "1px solid #7F1D1D",
                            padding: "10px 18px",
                            borderRadius: "6px",
                            fontSize: "13px",
                            fontWeight: "600",
                            cursor: "pointer"
                        }}
                    >
                        Sign Out
                    </button>
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

                {/* Metric Summary Cards */}
                {stats && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "15px", marginBottom: "30px" }}>
                        
                        <div style={{ background: "#FFFFFF", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", borderLeft: "4px solid #D9383A" }}>
                            <div style={{ fontSize: "12px", color: "#666666", fontWeight: "600", textTransform: "uppercase" }}>Total Users</div>
                            <div style={{ fontSize: "28px", fontWeight: "800", color: "#222222", marginTop: "4px" }}>{stats.totalUsers}</div>
                        </div>

                        <div style={{ background: "#FFFFFF", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", borderLeft: "4px solid #E11D48" }}>
                            <div style={{ fontSize: "12px", color: "#666666", fontWeight: "600", textTransform: "uppercase" }}>Donors</div>
                            <div style={{ fontSize: "28px", fontWeight: "800", color: "#E11D48", marginTop: "4px" }}>{stats.totalDonors}</div>
                        </div>

                        <div style={{ background: "#FFFFFF", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", borderLeft: "4px solid #EA580C" }}>
                            <div style={{ fontSize: "12px", color: "#666666", fontWeight: "600", textTransform: "uppercase" }}>Blood Banks</div>
                            <div style={{ fontSize: "28px", fontWeight: "800", color: "#EA580C", marginTop: "4px" }}>{stats.totalBloodBanks}</div>
                        </div>

                        <div style={{ background: "#FFFFFF", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", borderLeft: "4px solid #4F46E5" }}>
                            <div style={{ fontSize: "12px", color: "#666666", fontWeight: "600", textTransform: "uppercase" }}>Total Requests</div>
                            <div style={{ fontSize: "28px", fontWeight: "800", color: "#222222", marginTop: "4px" }}>{stats.totalRequests}</div>
                        </div>

                        <div style={{ background: "#FFFFFF", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", borderLeft: "4px solid #F59E0B" }}>
                            <div style={{ fontSize: "12px", color: "#666666", fontWeight: "600", textTransform: "uppercase" }}>Pending</div>
                            <div style={{ fontSize: "28px", fontWeight: "800", color: "#D97706", marginTop: "4px" }}>{stats.pendingRequests}</div>
                        </div>

                        <div style={{ background: "#FFFFFF", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", borderLeft: "4px solid #16A34A" }}>
                            <div style={{ fontSize: "12px", color: "#666666", fontWeight: "600", textTransform: "uppercase" }}>Fulfilled / Approved</div>
                            <div style={{ fontSize: "28px", fontWeight: "800", color: "#16A34A", marginTop: "4px" }}>
                                {stats.approvedRequests + stats.fulfilledRequests}
                            </div>
                        </div>

                    </div>
                )}

                {/* Tabs Bar */}
                <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap", background: "#FFFFFF", padding: "8px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                    <button onClick={() => setActiveTab("overview")} style={tabButtonStyle("overview")}>📊 Overview</button>
                    <button onClick={() => setActiveTab("users")} style={tabButtonStyle("users")}>👥 Users ({users.length})</button>
                    <button onClick={() => setActiveTab("donors")} style={tabButtonStyle("donors")}>🩸 Donors ({donors.length})</button>
                    <button onClick={() => setActiveTab("blood-banks")} style={tabButtonStyle("blood-banks")}>🏥 Blood Banks ({bloodBanks.length})</button>
                    <button onClick={() => setActiveTab("requests")} style={tabButtonStyle("requests")}>📋 Blood Requests ({requests.length})</button>
                </div>

                {/* TAB 1: OVERVIEW */}
                {activeTab === "overview" && (
                    <div style={{ background: "#FFFFFF", padding: "30px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                        <h2 style={{ margin: "0 0 20px", color: "#222222", fontSize: "20px" }}>System Health & Activity</h2>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
                            
                            <div style={{ background: "#FAF7F5", padding: "20px", borderRadius: "8px" }}>
                                <h3 style={{ margin: "0 0 15px", fontSize: "16px", color: "#222222" }}>Request Status Distribution</h3>
                                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
                                    <li style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span>⏳ Pending Requests:</span>
                                        <strong style={{ color: "#D97706" }}>{stats?.pendingRequests || 0}</strong>
                                    </li>
                                    <li style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span>✓ Approved by Blood Bank:</span>
                                        <strong style={{ color: "#16A34A" }}>{stats?.approvedRequests || 0}</strong>
                                    </li>
                                    <li style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span>📦 Fulfilled:</span>
                                        <strong style={{ color: "#854D0E" }}>{stats?.fulfilledRequests || 0}</strong>
                                    </li>
                                    <li style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span>✕ Rejected by Blood Bank:</span>
                                        <strong style={{ color: "#DC2626" }}>{stats?.rejectedRequests || 0}</strong>
                                    </li>
                                    <li style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span>🚫 Cancelled by Requester:</span>
                                        <strong style={{ color: "#6B7280" }}>{stats?.cancelledRequests || 0}</strong>
                                    </li>
                                </ul>
                            </div>

                            <div style={{ background: "#FAF7F5", padding: "20px", borderRadius: "8px" }}>
                                <h3 style={{ margin: "0 0 15px", fontSize: "16px", color: "#222222" }}>Quick Admin Actions</h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    <button onClick={() => setActiveTab("users")} style={{ background: "#FFFFFF", border: "1px solid #DCD6CD", padding: "10px 14px", borderRadius: "6px", textAlign: "left", fontSize: "14px", fontWeight: "600", cursor: "pointer", color: "#222222" }}>
                                        👥 Review & Manage User Accounts →
                                    </button>
                                    <button onClick={() => setActiveTab("requests")} style={{ background: "#FFFFFF", border: "1px solid #DCD6CD", padding: "10px 14px", borderRadius: "6px", textAlign: "left", fontSize: "14px", fontWeight: "600", cursor: "pointer", color: "#222222" }}>
                                        📋 Inspect All Blood Requests →
                                    </button>
                                    <button onClick={() => setActiveTab("donors")} style={{ background: "#FFFFFF", border: "1px solid #DCD6CD", padding: "10px 14px", borderRadius: "6px", textAlign: "left", fontSize: "14px", fontWeight: "600", cursor: "pointer", color: "#222222" }}>
                                        🩸 Check Registered Donors →
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* TAB 2: USERS MANAGEMENT */}
                {activeTab === "users" && (
                    <div style={{ background: "#FFFFFF", padding: "25px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                        
                        {/* Search & Filter Bar */}
                        <form onSubmit={handleUserSearchSubmit} style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
                            <input
                                type="text"
                                placeholder="Search user by name or email..."
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                                style={{ flex: 1, minWidth: "220px", padding: "10px 14px", borderRadius: "6px", border: "1px solid #DCD6CD", fontSize: "14px", outline: "none" }}
                            />

                            <select
                                value={userRoleFilter}
                                onChange={(e) => setUserRoleFilter(e.target.value)}
                                style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid #DCD6CD", fontSize: "14px", outline: "none" }}
                            >
                                <option value="">All Roles</option>
                                <option value="donor">Donor</option>
                                <option value="bloodbank">Blood Bank</option>
                                <option value="admin">Admin</option>
                            </select>

                            <button type="submit" style={{ background: "#D9383A", color: "#FFFFFF", border: "none", padding: "10px 18px", borderRadius: "6px", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
                                Search
                            </button>
                        </form>

                        {/* Users Table */}
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" }}>
                                <thead>
                                    <tr style={{ background: "#FAF7F5", borderBottom: "2px solid #E5E1DB", color: "#555555" }}>
                                        <th style={{ padding: "12px" }}>Name</th>
                                        <th style={{ padding: "12px" }}>Email</th>
                                        <th style={{ padding: "12px" }}>Role</th>
                                        <th style={{ padding: "12px" }}>Joined</th>
                                        <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u._id} style={{ borderBottom: "1px solid #F0ECE8" }}>
                                            <td style={{ padding: "12px", fontWeight: "600", color: "#222222" }}>{u.name}</td>
                                            <td style={{ padding: "12px", color: "#555555" }}>{u.email}</td>
                                            <td style={{ padding: "12px" }}>
                                                <span style={{
                                                    padding: "4px 10px",
                                                    borderRadius: "12px",
                                                    fontSize: "12px",
                                                    fontWeight: "700",
                                                    textTransform: "capitalize",
                                                    background: u.role === "admin" ? "#EDE9FE" : u.role === "bloodbank" ? "#FFEDD5" : "#DCFCE7",
                                                    color: u.role === "admin" ? "#5B21B6" : u.role === "bloodbank" ? "#C2410C" : "#166534"
                                                }}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td style={{ padding: "12px", color: "#888888", fontSize: "13px" }}>
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: "12px", textAlign: "right" }}>
                                                {u.role !== "admin" && (
                                                    <button
                                                        onClick={() => handleDeleteUser(u._id, u.name)}
                                                        disabled={actionLoading}
                                                        style={{
                                                            background: "#FFF1F2",
                                                            color: "#DC2626",
                                                            border: "1px solid #FECACA",
                                                            padding: "5px 12px",
                                                            borderRadius: "4px",
                                                            fontSize: "12px",
                                                            fontWeight: "600",
                                                            cursor: actionLoading ? "not-allowed" : "pointer"
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 3: DONORS */}
                {activeTab === "donors" && (
                    <div style={{ background: "#FFFFFF", padding: "25px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                        <h2 style={{ margin: "0 0 20px", color: "#222222", fontSize: "18px" }}>Registered Donors ({donors.length})</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
                            {donors.map((d) => (
                                <div key={d._id} style={{ background: "#FAF7F5", padding: "16px", borderRadius: "8px", borderLeft: "4px solid #D9383A" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <strong style={{ fontSize: "16px", color: "#222222" }}>{d.user?.name || "Donor"}</strong>
                                        <span style={{ fontSize: "16px", fontWeight: "800", color: "#D9383A" }}>{d.bloodGroup}</span>
                                    </div>
                                    <p style={{ margin: "6px 0", color: "#666666", fontSize: "13px" }}>📞 {d.phone}</p>
                                    <p style={{ margin: "4px 0", color: "#666666", fontSize: "13px" }}>📍 {d.city}, {d.state}</p>
                                    <span style={{ display: "inline-block", marginTop: "6px", fontSize: "11px", fontWeight: "700", color: d.isAvailable ? "#166534" : "#DC2626" }}>
                                        {d.isAvailable ? "● Available" : "○ Unavailable"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB 4: BLOOD BANKS */}
                {activeTab === "blood-banks" && (
                    <div style={{ background: "#FFFFFF", padding: "25px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                        <h2 style={{ margin: "0 0 20px", color: "#222222", fontSize: "18px" }}>Registered Blood Banks ({bloodBanks.length})</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
                            {bloodBanks.map((b) => (
                                <div key={b._id} style={{ background: "#FAF7F5", padding: "18px", borderRadius: "8px", borderLeft: "4px solid #EA580C" }}>
                                    <h3 style={{ margin: "0 0 6px", fontSize: "16px", color: "#222222" }}>{b.bankName}</h3>
                                    <p style={{ margin: "4px 0", color: "#666666", fontSize: "13px" }}>📞 {b.phone}</p>
                                    <p style={{ margin: "4px 0", color: "#666666", fontSize: "13px" }}>📍 {b.city}, {b.state}</p>
                                    <p style={{ margin: "4px 0", color: "#888888", fontSize: "12px" }}>{b.address}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB 5: BLOOD REQUESTS */}
                {activeTab === "requests" && (
                    <div style={{ background: "#FFFFFF", padding: "25px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                        <h2 style={{ margin: "0 0 20px", color: "#222222", fontSize: "18px" }}>All Patient & Hospital Blood Requests ({requests.length})</h2>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" }}>
                                <thead>
                                    <tr style={{ background: "#FAF7F5", borderBottom: "2px solid #E5E1DB", color: "#555555" }}>
                                        <th style={{ padding: "12px" }}>Blood Group</th>
                                        <th style={{ padding: "12px" }}>Units</th>
                                        <th style={{ padding: "12px" }}>Hospital & City</th>
                                        <th style={{ padding: "12px" }}>Requester</th>
                                        <th style={{ padding: "12px" }}>Status</th>
                                        <th style={{ padding: "12px" }}>Assigned Blood Bank</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((r) => {
                                        const badge = getStatusBadge(r.status);
                                        return (
                                            <tr key={r._id} style={{ borderBottom: "1px solid #F0ECE8" }}>
                                                <td style={{ padding: "12px", fontWeight: "800", color: "#D9383A", fontSize: "16px" }}>
                                                    {r.bloodGroup}
                                                </td>
                                                <td style={{ padding: "12px", color: "#333333" }}>{r.units} units</td>
                                                <td style={{ padding: "12px", color: "#333333" }}>
                                                    <strong>{r.hospitalName}</strong>, {r.city}
                                                </td>
                                                <td style={{ padding: "12px", color: "#666666", fontSize: "13px" }}>
                                                    {r.requester?.name || "User"}
                                                </td>
                                                <td style={{ padding: "12px" }}>
                                                    <span style={{
                                                        padding: "4px 10px",
                                                        borderRadius: "12px",
                                                        fontSize: "12px",
                                                        fontWeight: "700",
                                                        textTransform: "capitalize",
                                                        background: badge.bg,
                                                        color: badge.text
                                                    }}>
                                                        {r.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "12px", color: "#166534", fontSize: "13px" }}>
                                                    {r.bloodBank ? `✓ ${r.bloodBank.bankName}` : "—"}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default AdminDashboard;
