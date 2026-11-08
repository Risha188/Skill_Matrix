
import axios from "axios";

// Backend API URL
const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

// Axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 15000,
});

// Common API handler
const handleRequest = async (request) => {
    try {
        const response = await request;
        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            (error.code === "ERR_NETWORK"
                ? "Cannot connect to the backend. Check that your server is running."
                : error.message) ||
            "Something went wrong.";

        console.error("API request failed:", {
            status: error.response?.status,
            message,
            code: error.code,
        });

        throw new Error(message);
    }
};

// ======================================
// EMPLOYEE AUTHENTICATION
// ======================================

// Employee registration
export const registerUser = (data) =>
    handleRequest(api.post("/auth/register", data));

// Employee email verification
export const verifyEmail = (data) =>
    handleRequest(api.post("/auth/verify", data));

// Employee password setup
export const setPassword = (data) =>
    handleRequest(api.post("/auth/set-password", data));

// ======================================
// EMPLOYEE + ADMIN LOGIN
// ======================================

export const loginUser = (credentials) =>
    handleRequest(
        api.post("/auth/login", {
            email: String(credentials.email || "")
                .trim()
                .toLowerCase(),
            password: credentials.password,
        })
    );

// ======================================
// ADMIN AUTHENTICATION
// ======================================

// Admin registration
export const registerAdmin = (data) =>
    handleRequest(
        api.post("/admin/register", {
            fullName: String(data.fullName || "").trim(),
            email: String(data.email || "").trim().toLowerCase(),
        })
    );

// Admin email verification
export const verifyAdminEmail = (data) =>
    handleRequest(api.post("/admin/verify", data));

// Admin password setup
export const setAdminPassword = (data) =>
    handleRequest(api.post("/admin/set-password", data));

// ======================================
// FORGOT PASSWORD
// ======================================

// Send password reset OTP
export const forgotPassword = (data) =>
    handleRequest(api.post("/auth/forgot-password", data));

// Verify reset OTP
export const verifyResetOTP = (data) =>
    handleRequest(api.post("/auth/verify-reset-otp", data));

// Reset password
export const resetPassword = (data) =>
    handleRequest(api.post("/auth/reset-password", data));

// Export Axios instance
export default api;
