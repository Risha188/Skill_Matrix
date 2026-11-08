
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "Server authentication is not configured.",
            });
        }

        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userId = decoded.userId || decoded.id || decoded._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token.",
            });
        }

        const user = await User.findById(userId).select(
            "-password -verificationCode -resetCode"
        );

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: "Account not found or inactive.",
            });
        }

        req.user = user;
        next();

    } catch (error) {
        if (
            error.name === "TokenExpiredError" ||
            error.name === "JsonWebTokenError"
        ) {
            return res.status(401).json({
                success: false,
                message: "Your session is invalid or expired.",
            });
        }

        console.error("Authentication error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Authentication failed.",
        });
    }
};

const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Admin access required.",
        });
    }

    if (
        !req.user.isSuperAdmin &&
        req.user.isApproved !== true
    ) {
        return res.status(403).json({
            success: false,
            message: "Administrator approval is required.",
        });
    }

    next();
};

const superAdminOnly = (req, res, next) => {
    if (
        !req.user ||
        req.user.role !== "admin" ||
        req.user.isSuperAdmin !== true
    ) {
        return res.status(403).json({
            success: false,
            message: "Super Admin access required.",
        });
    }

    next();
};

const employeeOnly = (req, res, next) => {
    if (!req.user || req.user.role !== "employee") {
        return res.status(403).json({
            success: false,
            message: "Employee access required.",
        });
    }

    next();
};

module.exports = {
    protect,
    adminOnly,
    superAdminOnly,
    employeeOnly,
};
