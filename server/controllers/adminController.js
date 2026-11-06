const User = require("../models/User");
const Donor = require("../models/Donor");
const BloodBank = require("../models/BloodBank");
const BloodRequest = require("../models/BloodRequest");
const BloodInventory = require("../models/BloodInventory");

// 1. Get platform-wide overview stats
const getAdminStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalDonors,
            totalBloodBanks,
            totalRequests,
            pendingRequests,
            approvedRequests,
            fulfilledRequests,
            cancelledRequests,
            rejectedRequests
        ] = await Promise.all([
            User.countDocuments(),
            Donor.countDocuments(),
            BloodBank.countDocuments(),
            BloodRequest.countDocuments(),
            BloodRequest.countDocuments({ status: "pending" }),
            BloodRequest.countDocuments({ status: "approved" }),
            BloodRequest.countDocuments({ status: "fulfilled" }),
            BloodRequest.countDocuments({ status: "cancelled" }),
            BloodRequest.countDocuments({ status: "rejected" })
        ]);

        return res.status(200).json({
            stats: {
                totalUsers,
                totalDonors,
                totalBloodBanks,
                totalRequests,
                pendingRequests,
                approvedRequests,
                fulfilledRequests,
                cancelledRequests,
                rejectedRequests
            }
        });
    } catch (error) {
        console.error("Admin stats error:", error);
        return res.status(500).json({
            message: "Failed to fetch platform statistics",
            error: error.message
        });
    }
};

// 2. Get all registered users (with search and role filter)
const getAllUsers = async (req, res) => {
    try {
        const { search, role } = req.query;
        const filter = {};

        if (role) {
            filter.role = role;
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search.trim(), $options: "i" } },
                { email: { $regex: search.trim(), $options: "i" } }
            ];
        }

        const users = await User.find(filter)
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: users.length,
            users
        });
    } catch (error) {
        console.error("Admin get users error:", error);
        return res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });
    }
};

// 3. Get all donors with profile details
const getAllDonors = async (req, res) => {
    try {
        const { bloodGroup, city } = req.query;
        const filter = {};

        if (bloodGroup) filter.bloodGroup = bloodGroup;
        if (city) filter.city = { $regex: city.trim(), $options: "i" };

        const donors = await Donor.find(filter)
            .populate("user", "name email role")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: donors.length,
            donors
        });
    } catch (error) {
        console.error("Admin get donors error:", error);
        return res.status(500).json({
            message: "Failed to fetch donors",
            error: error.message
        });
    }
};

// 4. Get all blood banks with profile details
const getAllBloodBanks = async (req, res) => {
    try {
        const { city } = req.query;
        const filter = {};

        if (city) filter.city = { $regex: city.trim(), $options: "i" };

        const bloodBanks = await BloodBank.find(filter)
            .populate("user", "name email role")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: bloodBanks.length,
            bloodBanks
        });
    } catch (error) {
        console.error("Admin get blood banks error:", error);
        return res.status(500).json({
            message: "Failed to fetch blood banks",
            error: error.message
        });
    }
};

// 5. Get all blood requests
const getAllRequests = async (req, res) => {
    try {
        const { status, bloodGroup } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (bloodGroup) filter.bloodGroup = bloodGroup;

        const requests = await BloodRequest.find(filter)
            .populate("requester", "name email")
            .populate("bloodBank", "bankName phone city")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: requests.length,
            requests
        });
    } catch (error) {
        console.error("Admin get requests error:", error);
        return res.status(500).json({
            message: "Failed to fetch requests",
            error: error.message
        });
    }
};

// 6. Delete a user (and clean up their related records)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent admin from deleting themselves
        if (req.user.userId === id) {
            return res.status(400).json({
                message: "You cannot delete your own admin account"
            });
        }

        const userToDelete = await User.findById(id);
        if (!userToDelete) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Clean up linked profile
        if (userToDelete.role === "donor") {
            await Donor.deleteMany({ user: id });
        } else if (userToDelete.role === "bloodbank") {
            const bank = await BloodBank.findOne({ user: id });
            if (bank) {
                await BloodInventory.deleteMany({ bloodBank: bank._id });
                await BloodBank.findByIdAndDelete(bank._id);
            }
        }

        await User.findByIdAndDelete(id);

        return res.status(200).json({
            message: `User ${userToDelete.name} and related records deleted successfully`
        });
    } catch (error) {
        console.error("Admin delete user error:", error);
        return res.status(500).json({
            message: "Failed to delete user",
            error: error.message
        });
    }
};

module.exports = {
    getAdminStats,
    getAllUsers,
    getAllDonors,
    getAllBloodBanks,
    getAllRequests,
    deleteUser
};
