require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const donorRoutes = require("./routes/donorRoutes");
const bloodRequestRoutes = require("./routes/bloodRequestRoutes");
const bloodInventoryRoutes = require("./routes/bloodInventoryRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/blood-requests", bloodRequestRoutes);
app.use("/api/blood-inventory", bloodInventoryRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/auth/test", (req, res) => {
    res.send("Auth routes are working!");
});

app.get("/", (req, res) => {
    res.send("BloodLink Backend is Running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`BloodLink server is running on port ${PORT}`);
});
