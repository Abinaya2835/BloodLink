
const Donor = require("../models/Donor");

const updateDonorProfile = async (req, res) => {
    try {
        const { bloodGroup, phone, city, state, isAvailable } = req.body;

        const donor = await Donor.findOne({
            user: req.params.userId
        });

        if (!donor) {
            return res.status(404).json({
                message: "Donor profile not found"
            });
        }

        if (bloodGroup !== undefined) donor.bloodGroup = bloodGroup;
        if (phone !== undefined) donor.phone = phone;
        if (city !== undefined) donor.city = city;
        if (state !== undefined) donor.state = state;
        if (isAvailable !== undefined) donor.isAvailable = isAvailable;

        await donor.save();

        res.json({
            message: "Donor profile updated successfully",
            donor
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update donor profile",
            error: error.message
        });
    }
};

module.exports = { updateDonorProfile };
