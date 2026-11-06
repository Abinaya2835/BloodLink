
const express = require("express");
const router = express.Router();

const Donor = require("../models/Donor");
// Search donors by blood group and city
router.get("/search", async (req, res) => {
    try {
        const { bloodGroup, city } = req.query;

        const filter = {
            isAvailable: true
        };

        if (bloodGroup) {
            filter.bloodGroup = bloodGroup;
        }

        if (city) {
            filter.city = {
                $regex: city,
                $options: "i"
            };
        }

        const donors = await Donor.find(filter)
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.json({
            count: donors.length,
            donors
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to search donors",
            error: error.message
        });
    }
});
const {
    updateDonorProfile
} = require("../controllers/donorController");

// Get donor profile
router.get("/profile/:userId", async (req, res) => {
    try {
        const donor = await Donor.findOne({
            user: req.params.userId
        });

        if (!donor) {
            return res.status(404).json({
                message: "Donor profile not found"
            });
        }

        res.json(donor);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch donor profile",
            error: error.message
        });
    }
});

// Update donor profile
router.put("/profile/:userId", updateDonorProfile);

module.exports = router;
