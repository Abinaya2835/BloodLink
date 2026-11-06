const express = require("express");

const {
    createBloodRequest,
    getMyBloodRequests,
    cancelBloodRequest,
    getAllBloodRequests,
    updateBloodRequestStatus
} = require("../controllers/bloodRequestController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Submit a new blood request
router.post("/", authMiddleware, createBloodRequest);

// Get all incoming blood requests (with filters for blood banks)
router.get("/", authMiddleware, getAllBloodRequests);

// Get requests submitted by the logged-in user
router.get("/my", authMiddleware, getMyBloodRequests);

// Cancel a pending blood request (by requester)
router.put("/:id/cancel", authMiddleware, cancelBloodRequest);

// Update request status by blood bank (approve, reject, fulfill)
router.put("/:id/status", authMiddleware, updateBloodRequestStatus);

module.exports = router;
