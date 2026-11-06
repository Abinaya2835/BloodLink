const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        // Get token from request headers
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Access denied. Please login first."
            });
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        // Verify token using JWT secret
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store decoded user information
        req.user = decoded;

        // Continue to the requested route
        next();

    } catch (error) {
        console.error("Authentication error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token. Please login again."
        });
    }
};

module.exports = authMiddleware;