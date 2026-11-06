const mongoose = require("mongoose");

const bloodInventorySchema = new mongoose.Schema(
    {
        bloodBank: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BloodBank",
            required: true
        },

        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            required: true
        },

        units: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

const BloodInventory = mongoose.model(
    "BloodInventory",
    bloodInventorySchema
);

module.exports = BloodInventory;