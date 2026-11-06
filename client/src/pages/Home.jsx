
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const [selectedGroup, setSelectedGroup] = useState("");
    const [city, setCity] = useState("");

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();

        if (selectedGroup) params.append("bloodGroup", selectedGroup);
        if (city.trim()) params.append("city", city.trim());

        navigate(`/search-donors?${params.toString()}`);
    };

    const handleGroupClick = (group) => {
        navigate(`/search-donors?bloodGroup=${encodeURIComponent(group)}`);
    };

    return (
        <div
            className="bloodlink-home"
            style={{
                fontFamily: "'Segoe UI', Roboto, sans-serif",
                backgroundColor: "#FAF7F5",
                color: "#222222",
                minHeight: "100vh",
                width: "100%",
                maxWidth: "100%",
                overflowX: "clip"
            }}
        >
            <style>{`
                .bloodlink-home,
                .bloodlink-home * {
                    box-sizing: border-box;
                }

                .bloodlink-home section,
                .bloodlink-home footer {
                    max-width: 100%;
                }

                .bloodlink-home img {
                    max-width: 100%;
                    height: auto;
                }

                /* HERO SECTION */

                .bloodlink-home .home-hero {
                    width: 100%;
                    padding: 60px 20px;
                }

                .bloodlink-home .home-hero h1 {
                    width: 100%;
                    overflow-wrap: break-word;
                }

                /* SEARCH FORM */

                .bloodlink-home .home-search {
                    width: 100%;
                    max-width: 800px;
                }

                .bloodlink-home .home-search select,
                .bloodlink-home .home-search input {
                    min-width: 0;
                    max-width: 100%;
                }

                /* CTA CARDS */

                .bloodlink-home .home-cta {
                    width: 100%;
                    max-width: 1000px;
                }

                .bloodlink-home .home-cta a {
                    min-width: 0;
                    overflow-wrap: break-word;
                }

                /* BLOOD GROUPS */

                .bloodlink-home .blood-groups {
                    width: 100%;
                    max-width: 1000px;
                }

                /* FEATURES */

                .bloodlink-home .feature-grid {
                    width: 100%;
                    grid-template-columns: repeat(
                        auto-fit,
                        minmax(min(100%, 260px), 1fr)
                    );
                }

                /* MOBILE RESPONSIVENESS */

                @media (max-width: 600px) {

                    .bloodlink-home .home-hero {
                        min-height: auto !important;
                        padding: 45px 15px !important;
                    }

                    .bloodlink-home .home-hero h1 {
                        font-size: 27px !important;
                        line-height: 1.3 !important;
                        margin-bottom: 15px !important;
                    }

                    .bloodlink-home .home-hero p {
                        font-size: 14px !important;
                    }

                    .bloodlink-home .home-hero > div:first-child {
                        font-size: 11px !important;
                        padding: 6px 12px !important;
                    }

                    .bloodlink-home .home-search {
                        padding: 12px !important;
                        gap: 10px !important;
                    }

                    .bloodlink-home .home-search select,
                    .bloodlink-home .home-search input,
                    .bloodlink-home .home-search button {
                        width: 100%;
                        min-width: 0;
                        flex: 1 1 100%;
                        font-size: 14px;
                    }

                    .bloodlink-home .home-cta {
                        margin: -20px auto 35px !important;
                        padding: 0 15px !important;
                        flex-direction: column;
                        gap: 15px !important;
                    }

                    .bloodlink-home .home-cta a {
                        width: 100%;
                        flex: 1 1 100%;
                        padding: 22px !important;
                    }

                    .bloodlink-home .home-cta h2 {
                        font-size: 18px !important;
                    }

                    .bloodlink-home .blood-groups {
                        padding: 0 15px !important;
                        margin-bottom: 45px !important;
                    }

                    .bloodlink-home .blood-groups h2,
                    .bloodlink-home .features-section h2 {
                        font-size: 22px !important;
                    }

                    .bloodlink-home .blood-groups > div:last-child {
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                        gap: 12px !important;
                    }

                    .bloodlink-home .features-section {
                        padding: 40px 15px !important;
                    }

                    .bloodlink-home .feature-grid {
                        grid-template-columns: minmax(0, 1fr) !important;
                        gap: 15px !important;
                    }

                    .bloodlink-home footer {
                        padding: 25px 15px !important;
                    }

                    .bloodlink-home footer > div {
                        flex-direction: column;
                        text-align: center;
                        justify-content: center;
                    }
                }

                /* VERY SMALL MOBILE SCREENS */

                @media (max-width: 360px) {
                    .bloodlink-home .home-hero h1 {
                        font-size: 24px !important;
                    }

                    .bloodlink-home .home-cta a {
                        padding: 18px !important;
                    }
                }
            `}</style>

            {/* HERO SECTION */}

            <section
                className="home-hero"
                style={{
                    position: "relative",
                    width: "100%",
                    minHeight: "480px",
                    background: "linear-gradient(rgba(26, 26, 26, 0.82), rgba(26, 26, 26, 0.82)), url('https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1600&q=80')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    padding: "60px 20px"
                }}
            >
                <div
                    style={{
                        background: "rgba(217, 56, 58, 0.15)",
                        border: "1px solid rgba(217, 56, 58, 0.4)",
                        color: "#FCA5A5",
                        padding: "6px 16px",
                        borderRadius: "20px",
                        fontSize: "13px",
                        fontWeight: "600",
                        marginBottom: "18px"
                    }}
                >
                    🩸 BloodLink Emergency Donor Network
                </div>

                <h1
                    style={{
                        fontSize: "38px",
                        fontWeight: "800",
                        color: "#FFFFFF",
                        lineHeight: "1.3",
                        marginBottom: "20px",
                        maxWidth: "850px"
                    }}
                >
                    Connecting Blood Donors & Blood Banks to Save Lives Faster
                </h1>

                <p
                    style={{
                        color: "#E5E7EB",
                        fontSize: "16px",
                        maxWidth: "650px",
                        margin: "0 auto 35px",
                        lineHeight: "1.5"
                    }}
                >
                    Find compatible donors in your city, submit emergency hospital requests, and manage blood inventories in real-time.
                </p>

                {/* SEARCH BAR */}

                <form
                    className="home-search"
                    onSubmit={handleSearchSubmit}
                    style={{
                        background: "#FFFFFF",
                        padding: "16px",
                        borderRadius: "8px",
                        width: "100%",
                        maxWidth: "800px",
                        display: "flex",
                        gap: "12px",
                        flexWrap: "wrap",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.15)"
                    }}
                >
                    <select
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        style={{
                            flex: "1 1 180px",
                            padding: "12px 14px",
                            border: "1px solid #DCD6CD",
                            borderRadius: "6px",
                            fontSize: "14px",
                            outline: "none",
                            background: "#FFFFFF",
                            color: "#222222"
                        }}
                    >
                        <option value="">All Blood Groups</option>

                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                            <option key={g} value={g}>
                                {g}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Search by city (e.g. Mumbai, Chennai)"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        style={{
                            flex: "1 1 240px",
                            padding: "12px 14px",
                            border: "1px solid #DCD6CD",
                            borderRadius: "6px",
                            fontSize: "14px",
                            outline: "none",
                            background: "#FFFFFF",
                            color: "#222222"
                        }}
                    />

                    <button
                        type="submit"
                        style={{
                            background: "#D9383A",
                            color: "#FFFFFF",
                            border: "none",
                            padding: "12px 28px",
                            borderRadius: "6px",
                            fontWeight: "700",
                            fontSize: "14px",
                            cursor: "pointer",
                            transition: "background 0.2s"
                        }}
                    >
                        Find Donors
                    </button>
                </form>
            </section>

            {/* SPLIT CTA CARDS */}

            <div
                className="home-cta"
                style={{
                    maxWidth: "1000px",
                    margin: "-40px auto 50px",
                    position: "relative",
                    zIndex: 10,
                    display: "flex",
                    gap: "20px",
                    padding: "0 20px",
                    flexWrap: "wrap"
                }}
            >
                {/* REGISTER AS DONOR */}

                <Link
                    to="/register"
                    style={{
                        flex: "1 1 420px",
                        background: "#D9383A",
                        padding: "30px",
                        borderRadius: "8px",
                        color: "#FFFFFF",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        textDecoration: "none",
                        boxShadow: "0 6px 20px rgba(217, 56, 58, 0.25)"
                    }}
                >
                    <div>
                        <div style={{ fontSize: "28px", marginBottom: "8px" }}>
                            🩸
                        </div>

                        <h2 style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            margin: "0 0 6px",
                            color: "#FFFFFF"
                        }}>
                            Register as a Donor
                        </h2>

                        <p style={{
                            fontSize: "14px",
                            opacity: "0.92",
                            margin: "0 0 15px",
                            color: "#FFFFFF",
                            lineHeight: "1.4"
                        }}>
                            Join our verified network of heroes. Your blood group could be the lifeline someone is desperately waiting for.
                        </p>

                        <span style={{
                            color: "#FFFFFF",
                            fontWeight: "700",
                            fontSize: "13px",
                            textDecoration: "underline"
                        }}>
                            Create Donor Account →
                        </span>
                    </div>
                </Link>

                {/* REQUEST BLOOD */}

                <Link
                    to="/blood-request"
                    style={{
                        flex: "1 1 420px",
                        background: "#222222",
                        padding: "30px",
                        borderRadius: "8px",
                        color: "#FFFFFF",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        textDecoration: "none",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.12)"
                    }}
                >
                    <div>
                        <div style={{ fontSize: "28px", marginBottom: "8px" }}>
                            🏥
                        </div>

                        <h2 style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            margin: "0 0 6px",
                            color: "#FFFFFF"
                        }}>
                            Request Blood Emergency
                        </h2>

                        <p style={{
                            fontSize: "14px",
                            opacity: "0.9",
                            margin: "0 0 15px",
                            color: "#FFFFFF",
                            lineHeight: "1.4"
                        }}>
                            Need blood units urgently for a patient or surgery? Submit a verified request to local blood banks and donors.
                        </p>

                        <span style={{
                            color: "#FCA5A5",
                            fontWeight: "700",
                            fontSize: "13px",
                            textDecoration: "underline"
                        }}>
                            Submit Urgent Request →
                        </span>
                    </div>
                </Link>
            </div>

            {/* BLOOD GROUPS DIRECTORY */}

            <section
                className="blood-groups"
                style={{
                    maxWidth: "1000px",
                    margin: "0 auto 70px",
                    padding: "0 20px",
                    textAlign: "center"
                }}
            >
                <h2 style={{
                    fontSize: "26px",
                    fontWeight: "700",
                    color: "#222222",
                    marginBottom: "10px"
                }}>
                    Explore Donors by Blood Group
                </h2>

                <p style={{
                    color: "#666666",
                    fontSize: "15px",
                    maxWidth: "600px",
                    margin: "0 auto 30px"
                }}>
                    Click any blood group below to instantly locate available donors in your area:
                </p>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
                        gap: "15px"
                    }}
                >
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                        <div
                            key={group}
                            onClick={() => handleGroupClick(group)}
                            style={{
                                background: "#FFFFFF",
                                borderRadius: "8px",
                                padding: "20px 10px",
                                borderTop: "4px solid #D9383A",
                                boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                                cursor: "pointer",
                                transition: "transform 0.2s, box-shadow 0.2s"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-4px)";
                                e.currentTarget.style.boxShadow = "0 6px 15px rgba(217, 56, 58, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.04)";
                            }}
                        >
                            <div style={{
                                fontSize: "26px",
                                fontWeight: "800",
                                color: "#D9383A",
                                marginBottom: "4px"
                            }}>
                                {group}
                            </div>

                            <div style={{
                                fontSize: "12px",
                                color: "#666666",
                                fontWeight: "600"
                            }}>
                                Search →
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* PLATFORM FEATURES */}

            <section
                className="features-section"
                style={{
                    background: "#FFFFFF",
                    padding: "60px 20px",
                    borderTop: "1px solid #EFEAE5",
                    borderBottom: "1px solid #EFEAE5"
                }}
            >
                <div style={{
                    maxWidth: "1000px",
                    margin: "0 auto",
                    textAlign: "center"
                }}>
                    <h2 style={{
                        fontSize: "26px",
                        fontWeight: "700",
                        color: "#222222",
                        marginBottom: "35px"
                    }}>
                        Why BloodLink?
                    </h2>

                    <div
                        className="feature-grid"
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                            gap: "25px",
                            textAlign: "left"
                        }}
                    >
                        <div style={{
                            background: "#FAF7F5",
                            padding: "25px",
                            borderRadius: "8px",
                            borderLeft: "4px solid #D9383A"
                        }}>
                            <div style={{ fontSize: "28px", marginBottom: "10px" }}>
                                ⚡
                            </div>

                            <h3 style={{
                                fontSize: "18px",
                                margin: "0 0 8px",
                                color: "#222222"
                            }}>
                                Rapid Emergency Matching
                            </h3>

                            <p style={{
                                fontSize: "14px",
                                color: "#666666",
                                margin: 0,
                                lineHeight: "1.5"
                            }}>
                                Direct telephone contact links allow patients to contact nearby available donors without unnecessary delays.
                            </p>
                        </div>

                        <div style={{
                            background: "#FAF7F5",
                            padding: "25px",
                            borderRadius: "8px",
                            borderLeft: "4px solid #EA580C"
                        }}>
                            <div style={{ fontSize: "28px", marginBottom: "10px" }}>
                                🏥
                            </div>

                            <h3 style={{
                                fontSize: "18px",
                                margin: "0 0 8px",
                                color: "#222222"
                            }}>
                                Blood Bank Stock Sync
                            </h3>

                            <p style={{
                                fontSize: "14px",
                                color: "#666666",
                                margin: 0,
                                lineHeight: "1.5"
                            }}>
                                Certified blood banks can update their inventory units in real-time, preventing wasted visits and expired units.
                            </p>
                        </div>

                        <div style={{
                            background: "#FAF7F5",
                            padding: "25px",
                            borderRadius: "8px",
                            borderLeft: "4px solid #16A34A"
                        }}>
                            <div style={{ fontSize: "28px", marginBottom: "10px" }}>
                                🛡️
                            </div>

                            <h3 style={{
                                fontSize: "18px",
                                margin: "0 0 8px",
                                color: "#222222"
                            }}>
                                Verified Status Tracking
                            </h3>

                            <p style={{
                                fontSize: "14px",
                                color: "#666666",
                                margin: 0,
                                lineHeight: "1.5"
                            }}>
                                Every blood request can be tracked across its lifecycle: Pending, Approved, Fulfilled, or Cancelled.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}

            <footer style={{
                background: "#222222",
                color: "#FFFFFF",
                padding: "35px 20px",
                textAlign: "center",
                fontSize: "14px"
            }}>
                <div style={{
                    maxWidth: "1000px",
                    margin: "0 auto",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "15px"
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontWeight: "700",
                        fontSize: "18px"
                    }}>
                        <span style={{ color: "#D9383A", fontSize: "22px" }}>
                            🩸
                        </span>
                        BloodLink
                    </div>

                    <div style={{ color: "#9CA3AF", fontSize: "13px" }}>
                        Connecting donors, blood banks, and patients across India.
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;
