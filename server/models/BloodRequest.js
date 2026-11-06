const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema(
    {
        requester: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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
            min: 1
        },

        city: {
            type: String,
            required: true
        },

        hospitalName: {
            type: String,
            required: true
        },

        reason: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "fulfilled", "cancelled"],
            default: "pending"
        },

        bloodBank: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BloodBank",
            default: null
        }
    },
    {
        timestamps: true
    }
);

const BloodRequest = mongoose.model(
    "BloodRequest",
    bloodRequestSchema
);

module.exports = BloodRequest;