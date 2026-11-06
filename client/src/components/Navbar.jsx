import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("bloodlinkUser") || "null");

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <>
            {/* TOP BAR */}
            <div style={{ background: "#222222", color: "#FFFFFF", padding: "8px 5%", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", flexWrap: "wrap", gap: "10px" }}>
                <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                    <span>📍 BloodLink Network</span>
                    {user && (
                        <span style={{ color: "#E0D7D0" }}>
                            Logged in as: <strong style={{ color: "#FFFFFF" }}>{user.name}</strong> ({user.role})
                        </span>
                    )}
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    {!user ? (
                        <>
                            <Link to="/register" style={{ background: "#FFFFFF", color: "#222222", padding: "6px 14px", fontSize: "12px", fontWeight: "700", borderRadius: "4px", textDecoration: "none" }}>
                                Register
                            </Link>
                            <Link to="/login" style={{ background: "#D9383A", color: "#FFFFFF", padding: "6px 14px", fontSize: "12px", fontWeight: "700", borderRadius: "4px", textDecoration: "none" }}>
                                Login
                            </Link>
                        </>
                    ) : (
                        <button
                            onClick={handleLogout}
                            style={{
                                background: "transparent",
                                color: "#FCA5A5",
                                border: "1px solid #7F1D1D",
                                padding: "4px 12px",
                                fontSize: "12px",
                                fontWeight: "600",
                                borderRadius: "4px",
                                cursor: "pointer"
                            }}
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>

            {/* MAIN NAVBAR */}
            <nav style={{ background: "#FFFFFF", padding: "0 5%", height: "75px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #E5E1DB", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "22px", fontWeight: "800", color: "#222222", textDecoration: "none" }}>
                    <span style={{ color: "#D9383A", fontSize: "28px" }}>🩸</span> BloodLink
                </Link>

                <div style={{ display: "flex", gap: "22px", flexWrap: "wrap", alignItems: "center" }}>
                    <Link to="/" style={{ textDecoration: "none", color: "#333333", fontWeight: "600", fontSize: "14px" }}>
                        Home
                    </Link>
                    <Link to="/search-donors" style={{ textDecoration: "none", color: "#333333", fontWeight: "600", fontSize: "14px" }}>
                        Find Donors
                    </Link>

                    {/* Admin Navigation */}
                    {user?.role === "admin" && (
                        <Link to="/admin-dashboard" style={{ textDecoration: "none", color: "#D9383A", fontWeight: "700", fontSize: "14px" }}>
                            🛡️ Admin Portal
                        </Link>
                    )}

                    {/* Blood Bank Navigation */}
                    {user?.role === "bloodbank" && (
                        <>
                            <Link to="/dashboard" style={{ textDecoration: "none", color: "#333333", fontWeight: "600", fontSize: "14px" }}>
                                Dashboard
                            </Link>
                            <Link to="/blood-bank-requests" style={{ textDecoration: "none", color: "#D9383A", fontWeight: "700", fontSize: "14px" }}>
                                Incoming Requests 📋
                            </Link>
                            <Link to="/blood-inventory" style={{ textDecoration: "none", color: "#333333", fontWeight: "600", fontSize: "14px" }}>
                                Inventory
                            </Link>
                        </>
                    )}

                    {/* Donor Navigation */}
                    {user?.role === "donor" && (
                        <>
                            <Link to="/dashboard" style={{ textDecoration: "none", color: "#333333", fontWeight: "600", fontSize: "14px" }}>
                                Dashboard
                            </Link>
                            <Link to="/blood-request" style={{ textDecoration: "none", color: "#333333", fontWeight: "600", fontSize: "14px" }}>
                                Request Blood
                            </Link>
                            <Link to="/my-blood-requests" style={{ textDecoration: "none", color: "#D9383A", fontWeight: "700", fontSize: "14px" }}>
                                My Requests
                            </Link>
                        </>
                    )}

                    {!user && (
                        <>
                            <Link to="/blood-request" style={{ textDecoration: "none", color: "#333333", fontWeight: "600", fontSize: "14px" }}>
                                Request Blood
                            </Link>
                            <Link to="/login" style={{ textDecoration: "none", color: "#333333", fontWeight: "600", fontSize: "14px" }}>
                                Login
                            </Link>
                            <Link to="/register" style={{ textDecoration: "none", color: "#D9383A", fontWeight: "700", fontSize: "14px" }}>
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </>
    );
}

export default Navbar;
