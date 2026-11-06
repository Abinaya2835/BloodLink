import { useEffect, useState } from "react";
import API from "../services/api";

function SearchDonors() {
    const [bloodGroup, setBloodGroup] = useState("");
    const [city, setCity] = useState("");
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDonors = async () => {
        setLoading(true);
        try {
            const params = {};
            if (bloodGroup) params.bloodGroup = bloodGroup;
            if (city.trim()) params.city = city.trim();

            const res = await API.get("/donors/search", { params });
            setDonors(res.data.donors || []);
        } catch (err) {
            console.error("Search donors error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonors();
    }, [bloodGroup]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchDonors();
    };

    const handleClear = () => {
        setBloodGroup("");
        setCity("");
    };

    const inputStyle = {
        padding: "12px 14px",
        borderRadius: "6px",
        border: "1px solid #DCD6CD",
        fontSize: "14px",
        outline: "none",
        background: "#FFFFFF",
        color: "#222222",
        boxSizing: "border-box"
    };

    return (
        <div style={{ minHeight: "100vh", background: "#FAF7F5", padding: "50px 20px", fontFamily: "'Segoe UI', Roboto, sans-serif", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: "960px" }}>
                
                {/* Search Header Banner */}
                <div style={{ background: "#222222", borderRadius: "8px", padding: "35px 25px", textAlign: "center", marginBottom: "35px", boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}>
                    <h1 style={{ color: "#FFFFFF", marginTop: 0, marginBottom: "10px", fontSize: "28px", fontWeight: "700" }}>
                        Find Available Blood Donors
                    </h1>
                    <p style={{ color: "#D1D5DB", margin: "0 auto 25px", maxWidth: "600px", fontSize: "14px", lineHeight: "1.5" }}>
                        Search for active blood donors in your area and connect with them directly during medical emergencies.
                    </p>

                    {/* Filter Form */}
                    <form onSubmit={handleSearch} style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", maxWidth: "750px", margin: "0 auto" }}>
                        <select
                            style={{ ...inputStyle, minWidth: "170px" }}
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
                        >
                            <option value="">All Blood Groups</option>
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>

                        <input
                            type="text"
                            placeholder="Search by city (e.g. Mumbai, Chennai)"
                            style={{ ...inputStyle, flex: 1, minWidth: "220px" }}
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />

                        <button
                            type="submit"
                            style={{
                                background: "#D9383A",
                                color: "#FFFFFF",
                                padding: "12px 24px",
                                borderRadius: "6px",
                                border: "none",
                                fontWeight: "600",
                                fontSize: "14px",
                                cursor: "pointer",
                                transition: "background 0.2s"
                            }}
                        >
                            Search Donors
                        </button>

                        {(bloodGroup || city) && (
                            <button
                                type="button"
                                onClick={handleClear}
                                style={{
                                    background: "#333333",
                                    color: "#FFFFFF",
                                    padding: "12px 18px",
                                    borderRadius: "6px",
                                    border: "none",
                                    fontSize: "13px",
                                    cursor: "pointer"
                                }}
                            >
                                Clear
                            </button>
                        )}
                    </form>
                </div>

                {/* Donors List Section */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h2 style={{ margin: 0, fontSize: "20px", color: "#222222", fontWeight: "700" }}>
                        Available Donors {donors.length > 0 && <span style={{ color: "#D9383A", fontSize: "16px" }}>({donors.length})</span>}
                    </h2>
                </div>

                {loading ? (
                    <div style={{ background: "#FFFFFF", padding: "50px", textAlign: "center", borderRadius: "8px", color: "#666666" }}>
                        <p style={{ margin: 0, fontSize: "15px" }}>Searching for available donors...</p>
                    </div>
                ) : donors.length === 0 ? (
                    <div style={{ background: "#FFFFFF", padding: "60px 20px", textAlign: "center", borderRadius: "8px", border: "1px dashed #DCD6CD" }}>
                        <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
                        <h3 style={{ color: "#222222", fontSize: "18px", margin: "0 0 8px" }}>No Donors Found</h3>
                        <p style={{ color: "#666666", fontSize: "14px", margin: 0 }}>
                            No active donors match your search criteria. Try choosing "All Blood Groups" or clearing the city filter.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                        {donors.map((d) => (
                            <div
                                key={d._id}
                                style={{
                                    background: "#FFFFFF",
                                    borderRadius: "8px",
                                    padding: "24px",
                                    borderTop: "4px solid #D9383A",
                                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between"
                                }}
                            >
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                                        <div>
                                            <h3 style={{ margin: "0 0 4px", color: "#222222", fontSize: "18px", fontWeight: "700" }}>
                                                {d.user?.name || "Anonymous Donor"}
                                            </h3>
                                            <span style={{ fontSize: "12px", color: "#166534", background: "#DCFCE7", padding: "2px 8px", borderRadius: "10px", fontWeight: "600" }}>
                                                ● Available to Donate
                                            </span>
                                        </div>
                                        <span style={{ background: "#FAF7F5", color: "#D9383A", border: "1px solid #F3ECE7", fontWeight: "800", padding: "6px 14px", borderRadius: "6px", fontSize: "18px" }}>
                                            {d.bloodGroup}
                                        </span>
                                    </div>

                                    <div style={{ borderTop: "1px solid #F0ECE8", paddingTop: "12px", marginTop: "12px" }}>
                                        <p style={{ margin: "6px 0", color: "#555555", fontSize: "14px" }}>
                                            <strong>City:</strong> {d.city || "Not specified"}
                                        </p>
                                        <p style={{ margin: "6px 0", color: "#555555", fontSize: "14px" }}>
                                            <strong>State:</strong> {d.state || "Not specified"}
                                        </p>
                                    </div>
                                </div>

                                <div style={{ marginTop: "18px", paddingTop: "14px", borderTop: "1px solid #F0ECE8" }}>
                                    <a
                                        href={`tel:${d.phone}`}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "8px",
                                            background: "#D9383A",
                                            color: "#FFFFFF",
                                            padding: "10px",
                                            borderRadius: "6px",
                                            textDecoration: "none",
                                            fontWeight: "600",
                                            fontSize: "14px"
                                        }}
                                    >
                                        <span>📞</span> Call: {d.phone}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchDonors;