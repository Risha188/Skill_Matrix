import React, { useState } from "react";

import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    resetPassword,
} from "../../service/authService";

const ResetPassword = () => {

    // =========================================================
    // NAVIGATION
    // =========================================================

    const location = useLocation();
    const navigate = useNavigate();

    // =========================================================
    // GET RESET DETAILS
    // =========================================================

    const email =
        location.state?.email ||
        localStorage.getItem("resetPasswordEmail") ||
        "";

    const resetCode =
        location.state?.resetCode ||
        localStorage.getItem("resetPasswordCode") ||
        "";

    // =========================================================
    // STATES
    // =========================================================

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================================================
    // PASSWORD RESET
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        // -----------------------------------------------------
        // CHECK EMAIL
        // -----------------------------------------------------

        if (!email) {
            setError(
                "Reset email is missing. Please start the password reset process again."
            );
            return;
        }

        // -----------------------------------------------------
        // CHECK RESET CODE
        // -----------------------------------------------------

        if (!resetCode) {
            setError(
                "Reset verification is missing. Please verify the reset code again."
            );
            return;
        }

        // -----------------------------------------------------
        // CHECK PASSWORD
        // -----------------------------------------------------

        if (!newPassword) {
            setError("Please enter a new password.");
            return;
        }

        if (newPassword.length < 8) {
            setError(
                "Password must be at least 8 characters long."
            );
            return;
        }

        // -----------------------------------------------------
        // CHECK CONFIRM PASSWORD
        // -----------------------------------------------------

        if (!confirmPassword) {
            setError("Please confirm your new password.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {

            setLoading(true);

            // -------------------------------------------------
            // SEND REQUEST TO BACKEND
            // -------------------------------------------------

            const response = await resetPassword({
                email: email,
                resetCode: resetCode,
                newPassword: newPassword,
                confirmPassword: confirmPassword,
            });

            // -------------------------------------------------
            // SUCCESS
            // -------------------------------------------------

            if (response?.data?.success) {

                setSuccess(
                    response.data.message ||
                    "Password reset successfully."
                );

                // Clear temporary reset information
                localStorage.removeItem("resetPasswordEmail");
                localStorage.removeItem("resetPasswordCode");

                // Redirect to login
                setTimeout(() => {
                    navigate("/login", {
                        replace: true,
                    });
                }, 1500);

                return;
            }

            // -------------------------------------------------
            // BACKEND ERROR
            // -------------------------------------------------

            setError(
                response?.data?.message ||
                "Unable to reset password. Please try again."
            );

        } catch (err) {

            console.error(
                "Reset Password Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Something went wrong while resetting your password."
            );

        } finally {

            setLoading(false);
        }
    };

    // =========================================================
    // UI
    // =========================================================

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">

            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

                {/* =================================================
                    LEFT SECTION
                ================================================= */}

                <div className="hidden md:flex md:w-1/2 bg-linear-to-br from-blue-600 to-blue-800 text-white p-10 flex-col justify-center">

                    <div className="mb-8">

                        <img
                            src="/pcs_logo.jpg"
                            alt="PCS Global"
                            className="w-24 h-24 object-contain bg-white rounded-full p-2"
                        />

                    </div>

                    <h1 className="text-4xl font-bold mb-5">
                        Reset Password
                    </h1>

                    <p className="text-blue-100 text-lg leading-relaxed">
                        Create a new secure password for your account.
                        Make sure your password is at least 8 characters
                        long.
                    </p>

                    <div className="mt-8 space-y-3 text-blue-100">

                        <p>
                            ✓ Use at least 8 characters
                        </p>

                        <p>
                            ✓ Use a strong password
                        </p>

                        <p>
                            ✓ Do not share your password
                        </p>

                    </div>

                </div>

                {/* =================================================
                    RIGHT SECTION
                ================================================= */}

                <div className="w-full md:w-1/2 p-6 sm:p-10">

                    {/* Mobile Logo */}

                    <div className="md:hidden flex justify-center mb-6">

                        <img
                            src="/pcs_logo.jpg"
                            alt="PCS Global"
                            className="w-32 h-auto object-contain"
                        />

                    </div>

                    {/* Heading */}

                    <div className="mb-8">

                        <h2 className="text-3xl font-bold text-gray-800">
                            Reset Password
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Enter your new password below.
                        </p>

                    </div>

                    {/* Email */}

                    <div className="mb-6">

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>

                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                        />

                    </div>

                    {/* Error */}

                    {error && (

                        <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                            {error}
                        </div>

                    )}

                    {/* Success */}

                    {success && (

                        <div className="mb-5 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                            {success}
                        </div>

                    )}

                    {/* Form */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* New Password */}

                        <div>

                            <label
                                htmlFor="newPassword"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                New Password
                            </label>

                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    setError("");
                                }}
                                placeholder="Enter new password"
                                autoComplete="new-password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />

                        </div>

                        {/* Confirm Password */}

                        <div>

                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Confirm Password
                            </label>

                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setError("");
                                }}
                                placeholder="Confirm new password"
                                autoComplete="new-password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />

                        </div>

                        {/* Reset Button */}

                        <button
                            type="submit"
                            disabled={loading || !!success}
                            className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                                loading || success
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >

                            {loading
                                ? "Resetting Password..."
                                : "Reset Password"
                            }

                        </button>

                    </form>

                    {/* Login */}

                    <div className="mt-6 text-center">

                        <Link
                            to="/login"
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Back to Login
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ResetPassword;