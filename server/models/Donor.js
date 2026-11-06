const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        city: {
            type: String,
            required: true
        },

        state: {
            type: String,
            required: true
        },

        isAvailable: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Donor = mongoose.model("Donor", donorSchema);

module.exports = Donor;