
const BloodInventory = require("../models/BloodInventory");
const BloodBank = require("../models/BloodBank");

// Get inventory for one blood bank
const getInventory = async (req, res) => {
    try {
        const { userId } = req.params;

        const bloodBank = await BloodBank.findOne({
            user: userId
        });

        if (!bloodBank) {
            return res.status(404).json({
                message: "Blood bank profile not found"
            });
        }

        const inventory = await BloodInventory.find({
            bloodBank: bloodBank._id
        }).sort({ bloodGroup: 1 });

        return res.status(200).json({
            count: inventory.length,
            inventory
        });
    } catch (error) {
        console.error("Get inventory error:", error);

        return res.status(500).json({
            message: "Failed to fetch blood inventory"
        });
    }
};

// Add or update stock for one blood group
const addOrUpdateInventory = async (req, res) => {
    try {
        const { userId } = req.params;
        const { bloodGroup, units } = req.body;

        if (
            !bloodGroup ||
            units === undefined ||
            units === null
        ) {
            return res.status(400).json({
                message: "Blood group and units are required"
            });
        }

        const validGroups = [
            "A+", "A-", "B+", "B-",
            "AB+", "AB-", "O+", "O-"
        ];

        if (!validGroups.includes(bloodGroup)) {
            return res.status(400).json({
                message: "Invalid blood group"
            });
        }

        const parsedUnits = Number(units);

        if (
            !Number.isInteger(parsedUnits) ||
            parsedUnits < 0
        ) {
            return res.status(400).json({
                message:
                    "Units must be a non-negative whole number"
            });
        }

        const bloodBank = await BloodBank.findOne({
            user: userId
        });

        if (!bloodBank) {
            return res.status(404).json({
                message: "Blood bank profile not found"
            });
        }

        const inventory = await BloodInventory.findOneAndUpdate(
            {
                bloodBank: bloodBank._id,
                bloodGroup
            },
            {
                $set: { units: parsedUnits }
            },
            {
                returnDocument: "after",
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );

        return res.status(200).json({
            message: "Blood inventory saved successfully",
            inventory
        });
    } catch (error) {
        console.error("Save inventory error:", error);

        return res.status(500).json({
            message: "Failed to save blood inventory"
        });
    }
};

// Search blood banks by blood group and city
const searchBloodBanks = async (req, res) => {
    try {
        const { bloodGroup, city } = req.query;

        const validGroups = [
            "A+", "A-", "B+", "B-",
            "AB+", "AB-", "O+", "O-"
        ];

        // Validate a selected blood group
        if (
            bloodGroup &&
            !validGroups.includes(bloodGroup)
        ) {
            return res.status(400).json({
                message: "Invalid blood group"
            });
        }

        // Filter BloodBank documents by city only.
        // Blood group information belongs to BloodInventory.
        const bankFilters = {};

        if (city && city.trim()) {
            bankFilters.city = {
                $regex: city.trim(),
                $options: "i"
            };
        }

        const banks = await BloodBank.find(bankFilters).lean();

        // Check each bank's inventory separately
        const results = await Promise.all(
            banks.map(async (bank) => {
                const inventoryFilters = {
                    bloodBank: bank._id,
                    units: { $gt: 0 }
                };

                // If a blood group was selected,
                // return only that group's available stock.
                if (bloodGroup) {
                    inventoryFilters.bloodGroup = bloodGroup;
                }

                const inventory = await BloodInventory.find(
                    inventoryFilters
                )
                    .sort({ bloodGroup: 1 })
                    .lean();

                // Do not show banks without matching stock
                if (inventory.length === 0) {
                    return null;
                }

                return {
                    bankName: bank.bankName,
                    phone: bank.phone,
                    city: bank.city,
                    state: bank.state,
                    address: bank.address,
                    inventory
                };
            })
        );

        const availableBanks = results.filter(Boolean);

        return res.status(200).json({
            count: availableBanks.length,
            bloodBanks: availableBanks
        });
    } catch (error) {
        console.error("Search blood banks error:", error);

        return res.status(500).json({
            message: "Unable to search blood banks"
        });
    }
};

module.exports = {
    getInventory,
    addOrUpdateInventory,
    searchBloodBanks
};
