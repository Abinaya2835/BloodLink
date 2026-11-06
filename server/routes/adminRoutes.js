const express = require("express");
const {
    getAdminStats,
    getAllUsers,
    getAllDonors,
    getAllBloodBanks,
    getAllRequests,
    deleteUser
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Protect all admin routes with authentication and admin privilege checks
router.use(authMiddleware, adminMiddleware);

// Overview metrics
router.get("/stats", getAdminStats);

// Entity management
router.get("/users", getAllUsers);
router.get("/donors", getAllDonors);
router.get("/blood-banks", getAllBloodBanks);
router.get("/requests", getAllRequests);
router.delete("/users/:id", deleteUser);

module.exports = router;
