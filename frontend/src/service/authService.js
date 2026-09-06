
import axios from "axios";

// =====================================================
// API BASE URL
// =====================================================

// Vercel / local .env should contain:
// VITE_API_URL=https://skillmatrix-backend-omega.vercel.app

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    console.error(
        "❌ VITE_API_URL is not defined. Check your .env file."
    );
}

// =====================================================
// AXIOS INSTANCE
// =====================================================

const api = axios.create({
    baseURL: `${API_URL}/api/auth`,

    headers: {
        "Content-Type": "application/json",
    },

    // Keep this true if your backend uses cookies
    // for refresh tokens or authentication.
    withCredentials: true,
});

// =====================================================
// REGISTER
// =====================================================

export const registerUser = async (userData) => {
    try {
        const response = await api.post(
            "/register",
            userData
        );

        console.log(
            "✅ Register Response:",
            response.data
        );

        return response;
    } catch (error) {
        console.error(
            "❌ Register Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

// =====================================================
// VERIFY EMAIL
// =====================================================

export const verifyEmail = async (verificationData) => {
    try {
        const response = await api.post(
            "/verify-email",
            verificationData
        );

        console.log(
            "✅ Verify Email Response:",
            response.data
        );

        return response;
    } catch (error) {
        console.error(
            "❌ Verify Email Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

// =====================================================
// SET PASSWORD
// =====================================================

export const setPassword = async (passwordData) => {
    try {
        const response = await api.post(
            "/set-password",
            passwordData
        );

        console.log(
            "✅ Set Password Response:",
            response.data
        );

        return response;
    } catch (error) {
        console.error(
            "❌ Set Password Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

// =====================================================
// LOGIN
// =====================================================

export const loginUser = async (loginData) => {
    try {
        const response = await api.post(
            "/login",
            loginData
        );

        console.log(
            "✅ Login Response:",
            response.data
        );

        return response;
    } catch (error) {
        console.error(
            "❌ Login Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

// =====================================================
// FORGOT PASSWORD
// =====================================================

export const forgotPassword = async (emailData) => {
    try {
        const response = await api.post(
            "/forgot-password",
            emailData
        );

        console.log(
            "✅ Forgot Password Response:",
            response.data
        );

        return response;
    } catch (error) {
        console.error(
            "❌ Forgot Password Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

// =====================================================
// VERIFY RESET CODE
// =====================================================

export const verifyResetCode = async (resetCodeData) => {
    try {
        const response = await api.post(
            "/verify-reset-code",
            resetCodeData
        );

        console.log(
            "✅ Verify Reset Code Response:",
            response.data
        );

        return response;
    } catch (error) {
        console.error(
            "❌ Verify Reset Code Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

// =====================================================
// RESET PASSWORD
// =====================================================

export const resetPassword = async (passwordData) => {
    try {
        const response = await api.post(
            "/reset-password",
            passwordData
        );

        console.log(
            "✅ Reset Password Response:",
            response.data
        );

        return response;
    } catch (error) {
        console.error(
            "❌ Reset Password Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default api;