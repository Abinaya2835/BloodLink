const mongoose = require("mongoose");

const bloodBankSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        bankName: {
            type: String,
            required: true,
            trim: true
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

        address: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const BloodBank = mongoose.model("BloodBank", bloodBankSchema);

module.exports = BloodBank;