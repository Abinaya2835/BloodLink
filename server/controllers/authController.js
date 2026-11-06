
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Donor = require("../models/Donor");
const BloodBank = require("../models/BloodBank");

const registerUser = async (req, res) => {
    let createdUser = null;

    try {
        const {
            name,
            email,
            password,
            role,
            bloodGroup,
            phone,
            city,
            state,
            bankName,
            address
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const userRole = role || "donor";

        if (!["donor", "bloodbank"].includes(userRole)) {
            return res.status(400).json({
                message: "Invalid user role"
            });
        }

        if (userRole === "donor" &&
            (!bloodGroup || !phone || !city || !state)) {
            return res.status(400).json({
                message: "Please provide all donor details"
            });
        }

        if (userRole === "bloodbank" &&
            (!bankName || !phone || !city || !state || !address)) {
            return res.status(400).json({
                message: "Please provide all blood bank details"
            });
        }

        const existingUser = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        createdUser = await User.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            role: userRole
        });

        if (userRole === "donor") {
            await Donor.create({
                user: createdUser._id,
                bloodGroup,
                phone,
                city,
                state
            });
        }

        if (userRole === "bloodbank") {
            await BloodBank.create({
                user: createdUser._id,
                bankName,
                phone,
                city,
                state,
                address
            });
        }

        return res.status(201).json({
            message: "User registered successfully",
            userId: createdUser._id
        });
    } catch (error) {
        console.error("Registration error:", error);

        // Avoid leaving an account without its required profile.
        if (createdUser) {
            try {
                await User.findByIdAndDelete(createdUser._id);
            } catch (cleanupError) {
                console.error("Registration cleanup error:", cleanupError);
            }
        }

        return res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            email: email?.trim().toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};
