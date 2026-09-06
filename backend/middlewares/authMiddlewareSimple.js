const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {

        console.log("===== AUTH MIDDLEWARE =====");

        // ==========================================
        // GET AUTHORIZATION HEADER
        // ==========================================

        const authHeader = req.headers.authorization;

        console.log("Authorization Header:", authHeader);


        // ==========================================
        // CHECK HEADER
        // ==========================================

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is required"
            });
        }


        // ==========================================
        // CHECK BEARER FORMAT
        // ==========================================

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format"
            });
        }


        // ==========================================
        // EXTRACT TOKEN
        // ==========================================

        const token = authHeader.split(" ")[1];


        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            });
        }


        // ==========================================
        // VERIFY JWT
        // ==========================================

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        console.log("Decoded JWT:", decoded);


        // ==========================================
        // STORE USER INFORMATION IN REQUEST
        // ==========================================

        req.user = {
            userId: decoded.userId,
            role: decoded.role
        };


        console.log("Authenticated User:", req.user);


        // ==========================================
        // CONTINUE
        // ==========================================

        next();

    } catch (error) {

        console.error(
            "JWT Authentication Error:",
            error.message
        );


        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};


module.exports = authMiddleware;