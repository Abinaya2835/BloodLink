
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem("bloodlinkUser") || "null");

    const handleLogout = () => {
        localStorage.clear();
        setMenuOpen(false);
        navigate("/login");
    };

    const linkStyle = {
        textDecoration: "none",
        color: "#333333",
        fontWeight: "600",
        fontSize: "14px",
        padding: "10px 0"
    };

    const redLinkStyle = {
        ...linkStyle,
        color: "#D9383A",
        fontWeight: "700"
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <>
            <style>{`
                .bl-topbar {
                    background: #222222;
                    color: white;
                    padding: 8px 5%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 10px;
                    font-size: 13px;
                }

                .bl-top-info, .bl-top-actions {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    flex-wrap: wrap;
                }

                .bl-main-nav {
                    background: white;
                    min-height: 75px;
                    padding: 0 5%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #E5E1DB;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
                    position: relative;
                    z-index: 1000;
                }

                .bl-logo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 22px;
                    font-weight: 800;
                    color: #222222;
                    text-decoration: none;
                    white-space: nowrap;
                }

                .bl-menu {
                    display: flex;
                    align-items: center;
                    gap: 22px;
                }

                .bl-menu-toggle {
                    display: none;
                    background: none;
                    border: none;
                    color: #D9383A;
                    font-size: 28px;
                    cursor: pointer;
                }

                .bl-highlight {
                    color: #D9383A !important;
                    font-weight: 700 !important;
                }

                @media (max-width: 900px) {
                    .bl-main-nav {
                        min-height: 68px;
                        flex-wrap: wrap;
                    }

                    .bl-menu-toggle {
                        display: block;
                    }

                    .bl-menu {
                        display: none;
                        width: 100%;
                        flex-direction: column;
                        align-items: stretch;
                        gap: 0;
                        padding: 8px 0 15px;
                    }

                    .bl-menu.bl-menu-open {
                        display: flex;
                    }

                    .bl-menu a {
                        padding: 13px 8px !important;
                        border-top: 1px solid #F1E5E2;
                    }
                }

                @media (max-width: 480px) {
                    .bl-topbar {
                        padding: 9px 4%;
                        align-items: flex-start;
                        flex-direction: column;
                    }

                    .bl-top-info {
                        gap: 7px;
                    }

                    .bl-main-nav {
                        padding: 0 4%;
                    }

                    .bl-logo {
                        font-size: 20px;
                    }
                }
            `}</style>

            {/* TOP BAR */}
            <div className="bl-topbar">
                <div className="bl-top-info">
                    <span>📍 BloodLink Network</span>
                    {user && (
                        <span style={{ color: "#E0D7D0" }}>
                            Logged in as: <strong style={{ color: "white" }}>{user.name}</strong> ({user.role})
                        </span>
                    )}
                </div>

                <div className="bl-top-actions">
                    {!user ? (
                        <>
                            <Link to="/register" style={{
                                background: "white", color: "#222",
                                padding: "6px 14px", fontSize: "12px",
                                fontWeight: "700", borderRadius: "4px",
                                textDecoration: "none"
                            }}>
                                Register
                            </Link>
                            <Link to="/login" style={{
                                background: "#D9383A", color: "white",
                                padding: "6px 14px", fontSize: "12px",
                                fontWeight: "700", borderRadius: "4px",
                                textDecoration: "none"
                            }}>
                                Login
                            </Link>
                        </>
                    ) : (
                        <button onClick={handleLogout} style={{
                            background: "transparent",
                            color: "#FCA5A5",
                            border: "1px solid #7F1D1D",
                            padding: "4px 12px",
                            fontSize: "12px",
                            fontWeight: "600",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}>
                            Logout
                        </button>
                    )}
                </div>
            </div>

            {/* MAIN NAVBAR */}
            <nav className="bl-main-nav">
                <Link to="/" className="bl-logo" onClick={closeMenu}>
                    <span style={{ color: "#D9383A", fontSize: "28px" }}>🩸</span>
                    BloodLink
                </Link>

                <button
                    className="bl-menu-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation"
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? "✕" : "☰"}
                </button>

                <div className={`bl-menu ${menuOpen ? "bl-menu-open" : ""}`}>
                    <Link to="/" style={linkStyle} onClick={closeMenu}>Home</Link>

                    <Link to="/search-donors" style={linkStyle} onClick={closeMenu}>
                        Find Donors
                    </Link>

                    {user?.role === "admin" && (
                        <Link to="/admin-dashboard" className="bl-highlight" style={redLinkStyle} onClick={closeMenu}>
                            🛡️ Admin Portal
                        </Link>
                    )}

                    {user?.role === "bloodbank" && (
                        <>
                            <Link to="/dashboard" style={linkStyle} onClick={closeMenu}>Dashboard</Link>
                            <Link to="/blood-bank-requests" className="bl-highlight" style={redLinkStyle} onClick={closeMenu}>
                                Incoming Requests 📋
                            </Link>
                            <Link to="/blood-inventory" style={linkStyle} onClick={closeMenu}>Inventory</Link>
                        </>
                    )}

                    {user?.role === "donor" && (
                        <>
                            <Link to="/dashboard" style={linkStyle} onClick={closeMenu}>Dashboard</Link>
                            <Link to="/blood-request" style={linkStyle} onClick={closeMenu}>Request Blood</Link>
                            <Link to="/my-blood-requests" className="bl-highlight" style={redLinkStyle} onClick={closeMenu}>
                                My Requests
                            </Link>
                        </>
                    )}

                    {!user && (
                        <>
                            <Link to="/blood-request" style={linkStyle} onClick={closeMenu}>Request Blood</Link>
                            <Link to="/login" style={linkStyle} onClick={closeMenu}>Login</Link>
                            <Link to="/register" className="bl-highlight" style={redLinkStyle} onClick={closeMenu}>Register</Link>
                        </>
                    )}
                </div>
            </nav>
        </>
    );
}

export default Navbar;
