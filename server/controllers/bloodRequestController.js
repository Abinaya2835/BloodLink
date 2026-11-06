const BloodRequest = require("../models/BloodRequest");
const BloodBank = require("../models/BloodBank");
const User = require("../models/User");
const BloodInventory = require("../models/BloodInventory");

// Create a blood request
const createBloodRequest = async (req, res) => {
    try {
        const {
            bloodGroup,
            units,
            city,
            hospitalName,
            reason
        } = req.body;

        // Validate required fields
        if (
            !bloodGroup ||
            units === undefined ||
            !city ||
            !hospitalName ||
            !reason
        ) {
            return res.status(400).json({
                message: "Please fill in all required fields"
            });
        }

        // Validate blood group
        const validGroups = [
            "A+", "A-", "B+", "B-",
            "AB+", "AB-", "O+", "O-"
        ];

        if (!validGroups.includes(bloodGroup)) {
            return res.status(400).json({
                message: "Invalid blood group"
            });
        }

        // Validate units
        const requestedUnits = Number(units);

        if (
            !Number.isInteger(requestedUnits) ||
            requestedUnits < 1
        ) {
            return res.status(400).json({
                message: "Units must be a positive whole number"
            });
        }

        // Create request using the authenticated user's ID
        const bloodRequest = await BloodRequest.create({
            requester: req.user.userId,
            bloodGroup,
            units: requestedUnits,
            city,
            hospitalName,
            reason
        });

        return res.status(201).json({
            message: "Blood request created successfully",
            bloodRequest
        });

    } catch (error) {
        console.error("Create blood request error:", error);

        return res.status(500).json({
            message: "Failed to create blood request",
            error: error.message
        });
    }
};

// Get requests submitted by the logged-in user
const getMyBloodRequests = async (req, res) => {
    try {
        const requests = await BloodRequest.find({
            requester: req.user.userId
        })
            .populate("bloodBank", "bankName phone city")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: requests.length,
            requests
        });

    } catch (error) {
        console.error("Get my blood requests error:", error);

        return res.status(500).json({
            message: "Failed to fetch blood requests",
            error: error.message
        });
    }
};

// Cancel a pending blood request (only allowed by the requester)
const cancelBloodRequest = async (req, res) => {
    try {
        const { id } = req.params;

        // Find request and ensure it belongs to the logged-in user
        const bloodRequest = await BloodRequest.findOne({
            _id: id,
            requester: req.user.userId
        });

        if (!bloodRequest) {
            return res.status(404).json({
                message: "Blood request not found or unauthorized"
            });
        }

        // Only pending requests can be cancelled
        if (bloodRequest.status !== "pending") {
            return res.status(400).json({
                message: `Cannot cancel a request that is already ${bloodRequest.status}`
            });
        }

        bloodRequest.status = "cancelled";
        await bloodRequest.save();

        return res.status(200).json({
            message: "Blood request cancelled successfully",
            bloodRequest
        });

    } catch (error) {
        console.error("Cancel blood request error:", error);

        return res.status(500).json({
            message: "Failed to cancel blood request",
            error: error.message
        });
    }
};

// Get all incoming blood requests (for Blood Banks and Admins)
const getAllBloodRequests = async (req, res) => {
    try {
        const { city, bloodGroup, status } = req.query;

        const filter = {};
        if (city) {
            filter.city = { $regex: city.trim(), $options: "i" };
        }
        if (bloodGroup) {
            filter.bloodGroup = bloodGroup;
        }
        if (status) {
            filter.status = status;
        }

        const requests = await BloodRequest.find(filter)
            .populate("requester", "name email")
            .populate("bloodBank", "bankName phone city")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: requests.length,
            requests
        });
    } catch (error) {
        console.error("Get all blood requests error:", error);

        return res.status(500).json({
            message: "Failed to fetch blood requests",
            error: error.message
        });
    }
};

// Update blood request status by a Blood Bank (with smart inventory deduction)
const updateBloodRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Only blood banks can update request status
        if (req.user.role !== "bloodbank") {
            return res.status(403).json({
                message: "Access denied. Only registered blood banks can update request status."
            });
        }

        const allowedStatuses = ["approved", "rejected", "fulfilled"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status. Allowed values: approved, rejected, fulfilled"
            });
        }

        // Find the blood bank profile associated with this user
        let bloodBank = await BloodBank.findOne({ user: req.user.userId });
        if (!bloodBank) {
            const user = await User.findById(req.user.userId);
            bloodBank = await BloodBank.create({
                user: req.user.userId,
                bankName: (user?.name || "Blood Bank") + " Center",
                phone: "9876543210",
                city: "Local",
                state: "State",
                address: "Center Road"
            });
        }

        const bloodRequest = await BloodRequest.findById(id);
        if (!bloodRequest) {
            return res.status(404).json({
                message: "Blood request not found"
            });
        }

        // Prevent modification if request was cancelled by user
        if (bloodRequest.status === "cancelled") {
            return res.status(400).json({
                message: "Cannot update a request that has been cancelled by the user"
            });
        }

        // Prevent double fulfillment
        if (bloodRequest.status === "fulfilled" && status === "fulfilled") {
            return res.status(400).json({
                message: "This blood request has already been fulfilled and units were deducted."
            });
        }

        // SMART INVENTORY CHECK & DEDUCTION WHEN FULFILLING
        let remainingStock = null;
        if (status === "fulfilled") {
            const inventory = await BloodInventory.findOne({
                bloodBank: bloodBank._id,
                bloodGroup: bloodRequest.bloodGroup
            });

            const currentStock = inventory ? inventory.units : 0;

            // Check if sufficient stock exists
            if (currentStock < bloodRequest.units) {
                return res.status(400).json({
                    message: `Insufficient inventory! You currently have ${currentStock} unit(s) of ${bloodRequest.bloodGroup}, but this emergency request requires ${bloodRequest.units} unit(s). Please add inventory stock before fulfilling.`
                });
            }

            // Deduct the requested units from blood bank inventory
            inventory.units = currentStock - bloodRequest.units;
            await inventory.save();
            remainingStock = inventory.units;
        }

        // Update request status and assign blood bank
        bloodRequest.status = status;
        bloodRequest.bloodBank = bloodBank._id;
        await bloodRequest.save();

        await bloodRequest.populate("requester", "name email");
        await bloodRequest.populate("bloodBank", "bankName phone city");

        const responseMsg = status === "fulfilled"
            ? `Request fulfilled! ${bloodRequest.units} units of ${bloodRequest.bloodGroup} deducted from inventory. Remaining stock: ${remainingStock} units.`
            : `Blood request status updated to ${status}.`;

        return res.status(200).json({
            message: responseMsg,
            bloodRequest,
            remainingStock
        });

    } catch (error) {
        console.error("Update blood request status error:", error);

        return res.status(500).json({
            message: "Failed to update blood request status",
            error: error.message
        });
    }
};

module.exports = {
    createBloodRequest,
    getMyBloodRequests,
    cancelBloodRequest,
    getAllBloodRequests,
    updateBloodRequestStatus
};