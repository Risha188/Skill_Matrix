import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// ======================================================
// REGISTER
// ======================================================

export const registerUser = async (userData) => {
    return await axios.post(
        `${API_URL}/register`,
        userData
    );
};

// ======================================================
// VERIFY EMAIL
// ======================================================

export const verifyEmail = async (verificationData) => {
    return await axios.post(
        `${API_URL}/verify-email`,
        verificationData
    );
};

// ======================================================
// SET PASSWORD
// ======================================================

export const setPassword = async (passwordData) => {
    return await axios.post(
        `${API_URL}/set-password`,
        passwordData
    );
};

// ======================================================
// LOGIN
// ======================================================

export const loginUser = async (loginData) => {
    return await axios.post(
        `${API_URL}/login`,
        loginData
    );
};

// ======================================================
// FORGOT PASSWORD
// ======================================================

export const forgotPassword = async (emailData) => {
    return await axios.post(
        `${API_URL}/forgot-password`,
        emailData
    );
};

// ======================================================
// VERIFY RESET CODE
// ======================================================

export const verifyResetCode = async (resetCodeData) => {
    return await axios.post(
        `${API_URL}/verify-reset-code`,
        resetCodeData
    );
};

// ======================================================
// RESET PASSWORD
// ======================================================

export const resetPassword = async (passwordData) => {
    return await axios.post(
        `${API_URL}/reset-password`,
        passwordData
    );
};