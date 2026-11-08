import express from "express";

import {
    registerUser,
    verifyEmail,
    setPassword,
    loginUser,
    forgotPassword,
    verifyResetOTP,
    resetPassword
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify", verifyEmail);
router.post("/set-password", setPassword);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetOTP);
router.post("/reset-password", resetPassword);

export default router;