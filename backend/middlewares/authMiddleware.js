const jwt = require("jsonwebtoken");

// ==========================================================
// AUTHENTICATION MIDDLEWARE
// ==========================================================

const protect = (req, res, next) => {
    try {
        console.log("=================================");
        console.log("AUTH MIDDLEWARE");
        console.log("METHOD:", req.method);
        console.log("URL:", req.originalUrl);
        console.log("=================================");

        // --------------------------------------------------
        // CHECK JWT SECRET
        // --------------------------------------------------

        if (!process.env.JWT_SECRET) {
            console.error(
                "❌ JWT_SECRET is missing from backend environment."
            );

            return res.status(500).json({
                success: false,
                message: "JWT_SECRET is not configured on server.",
            });
        }

        // --------------------------------------------------
        // GET AUTHORIZATION HEADER
        // --------------------------------------------------

        const authHeader =
            req.headers.authorization;

        console.log(
            "Authorization header:",
            authHeader
                ? "RECEIVED"
                : "NOT RECEIVED"
        );

        if (!authHeader) {
            console.error(
                "❌ Authorization header missing."
            );

            return res.status(401).json({
                success: false,
                message:
                    "Authentication required. Authorization header missing.",
            });
        }

        // --------------------------------------------------
        // CHECK BEARER FORMAT
        // --------------------------------------------------

        const parts =
            authHeader.trim().split(/\s+/);

        if (
            parts.length !== 2 ||
            parts[0].toLowerCase() !== "bearer"
        ) {
            console.error(
                "❌ Invalid Authorization header format."
            );

            return res.status(401).json({
                success: false,
                message:
                    "Invalid authorization format. Use Bearer <token>.",
            });
        }

        const token = parts[1];

        if (!token) {
            console.error(
                "❌ Token is empty."
            );

            return res.status(401).json({
                success: false,
                message: "Authentication token is missing.",
            });
        }

        console.log(
            "JWT received:",
            `${token.substring(0, 20)}...`
        );

        // --------------------------------------------------
        // VERIFY JWT
        // --------------------------------------------------

        let decoded;

        try {
            decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );
        } catch (jwtError) {
            console.error(
                "================================="
            );

            console.error(
                "❌ JWT VERIFICATION FAILED"
            );

            console.error(
                "JWT error name:",
                jwtError.name
            );

            console.error(
                "JWT error message:",
                jwtError.message
            );

            console.error(
                "================================="
            );

            if (
                jwtError.name ===
                "TokenExpiredError"
            ) {
                return res.status(401).json({
                    success: false,
                    message:
                        "Your session has expired. Please login again.",
                });
            }

            if (
                jwtError.name ===
                "JsonWebTokenError"
            ) {
                return res.status(401).json({
                    success: false,
                    message:
                        "Invalid authentication token. Please login again.",
                });
            }

            return res.status(401).json({
                success: false,
                message:
                    "Authentication token verification failed.",
            });
        }

        // --------------------------------------------------
        // CHECK DECODED USER
        // --------------------------------------------------

        if (!decoded) {
            console.error(
                "❌ JWT decoded data is empty."
            );

            return res.status(401).json({
                success: false,
                message:
                    "Invalid authentication token.",
            });
        }

        console.log(
            "JWT decoded successfully."
        );

        console.log(
            "User ID:",
            decoded.userId ||
                decoded.id ||
                decoded._id
        );

        console.log(
            "Role:",
            decoded.role
        );

        // --------------------------------------------------
        // SAVE USER ON REQUEST
        // --------------------------------------------------

        req.user = decoded;

        console.log(
            "✅ AUTHENTICATION SUCCESS"
        );

        console.log(
            "================================="
        );

        next();

    } catch (error) {
        console.error(
            "================================="
        );

        console.error(
            "❌ AUTHENTICATION MIDDLEWARE ERROR"
        );

        console.error(error);

        console.error(
            "================================="
        );

        return res.status(401).json({
            success: false,
            message:
                "Invalid authentication token.",
        });
    }
};


// ==========================================================
// ADMIN ONLY
// ==========================================================

const adminOnly = (req, res, next) => {
    try {
        console.log(
            "ADMIN ROLE CHECK"
        );

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message:
                    "Authentication required.",
            });
        }

        const role = String(
            req.user.role || ""
        )
            .trim()
            .toLowerCase();

        console.log(
            "Authenticated role:",
            role
        );

        if (role !== "admin") {
            console.error(
                "❌ ADMIN ACCESS DENIED"
            );

            return res.status(403).json({
                success: false,
                message:
                    "Admin access required.",
            });
        }

        console.log(
            "✅ ADMIN ACCESS GRANTED"
        );

        next();

    } catch (error) {
        console.error(
            "Admin middleware error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Admin authorization failed.",
        });
    }
};


// ==========================================================
// EMPLOYEE ONLY
// ==========================================================

const employeeOnly = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message:
                    "Authentication required.",
            });
        }

        const role = String(
            req.user.role || ""
        )
            .trim()
            .toLowerCase();

        if (role !== "employee") {
            return res.status(403).json({
                success: false,
                message:
                    "Employee access required.",
            });
        }

        next();

    } catch (error) {
        console.error(
            "Employee middleware error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Employee authorization failed.",
        });
    }
};


// ==========================================================
// EXPORT
// ==========================================================

module.exports = {
    protect,
    adminOnly,
    employeeOnly,
};