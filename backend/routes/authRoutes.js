const express = require("express");

const {
    registerUser,
    verifyEmail,
    setPassword,
    loginUser,
    forgotPassword,
    verifyResetCode,
    resetPassword
} = require("../controllers/authController");

const router = express.Router();

console.log("===== AUTH ROUTES =====");

console.log("registerUser:", typeof registerUser);
console.log("verifyEmail:", typeof verifyEmail);
console.log("setPassword:", typeof setPassword);
console.log("loginUser:", typeof loginUser);
console.log("forgotPassword:", typeof forgotPassword);
console.log("verifyResetCode:", typeof verifyResetCode);
console.log("resetPassword:", typeof resetPassword);


// ==========================================
// REGISTER EMPLOYEE
// ==========================================

router.post(
    "/register",
    registerUser
);


// ==========================================
// VERIFY EMPLOYEE EMAIL
// ==========================================

router.post(
    "/verify-email",
    verifyEmail
);


// ==========================================
// SET PASSWORD AFTER REGISTRATION
// ==========================================

router.post(
    "/set-password",
    setPassword
);


// ==========================================
// LOGIN
// ==========================================

router.post(
    "/login",
    loginUser
);


// ==========================================
// FORGOT PASSWORD - SEND CODE
// ==========================================

router.post(
    "/forgot-password",
    forgotPassword
);


// ==========================================
// VERIFY RESET CODE
// ==========================================

router.post(
    "/verify-reset-code",
    verifyResetCode
);


// ==========================================
// RESET PASSWORD
// ==========================================

router.post(
    "/reset-password",
    resetPassword
);


module.exports = router;