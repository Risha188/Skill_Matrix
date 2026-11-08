
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../service/authService";

const Registration = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    // Validate form
    const validateForm = () => {
        const fullName = formData.fullName.trim();
        const email = formData.email.trim().toLowerCase();

        if (!fullName) {
            return "Please enter your full name.";
        }

        if (fullName.length < 2) {
            return "Full name must contain at least 2 characters.";
        }

        if (!/^[a-zA-Z\s.'-]+$/.test(fullName)) {
            return "Please enter a valid full name.";
        }

        if (!email) {
            return "Please enter your email address.";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return "Please enter a valid email address.";
        }

        return "";
    };

    // Handle registration
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setError("");
        setSuccess("");

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        const fullName = formData.fullName.trim();
        const email = formData.email.trim().toLowerCase();

        try {
            setLoading(true);

            // Send registration request
            const data = await registerUser({
                fullName,
                email,
            });

            console.log("Registration response:", data);

            // Check backend response
            if (data?.success === true) {
                setSuccess(
                    data.message ||
                    "Registration successful. Please verify your email."
                );

                // Navigate to email verification page
                navigate("/verify-email", {
                    state: { email },
                    replace: true,
                });

                return;
            }

            setError(
                data?.message ||
                data?.error ||
                "Registration failed. Please try again."
            );

        } catch (err) {
            console.error(
                "Registration error:",
                err.response?.data || err.message
            );

            const status = err.response?.status;
            const backendMessage =
                err.response?.data?.message ||
                err.response?.data?.error;

            if (status === 400) {
                setError(
                    backendMessage ||
                    "Invalid registration details."
                );
            } else if (status === 409) {
                setError(
                    backendMessage ||
                    "An account with this email already exists."
                );
            } else if (status === 403) {
                setError(
                    backendMessage ||
                    "Registration request was not authorized."
                );
            } else if (status === 500) {
                setError(
                    backendMessage ||
                    "Server error. Please try again later."
                );
            } else if (
                err.code === "ERR_NETWORK" ||
                !err.response
            ) {
                setError(
                    "Unable to connect to the server. Please check your backend connection."
                );
            } else {
                setError(
                    backendMessage ||
                    "Registration failed. Please try again."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">
                        Create Account
                    </h1>

                    <p className="text-sm text-slate-500 mt-2">
                        Register your SkillMatrix account
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div
                        role="alert"
                        className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"
                    >
                        {error}
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div
                        role="status"
                        className="mb-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600"
                    >
                        {success}
                    </div>
                )}

                {/* Registration Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    noValidate
                >

                    {/* Full Name */}
                    <div>
                        <label
                            htmlFor="fullName"
                            className="block text-sm font-medium text-slate-700 mb-2"
                        >
                            Full Name
                        </label>

                        <input
                            id="fullName"
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            autoComplete="name"
                            required
                            disabled={loading}
                            maxLength={100}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:cursor-not-allowed"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-slate-700 mb-2"
                        >
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            autoComplete="email"
                            required
                            disabled={loading}
                            maxLength={254}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:cursor-not-allowed"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Creating Account...
                            </span>
                        ) : (
                            "Create Account"
                        )}
                    </button>

                </form>

                {/* Login Link */}
                <div className="text-center mt-6">
                    <p className="text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Login
                        </Link>
                    </p>
                </div>

                {/* Admin Login */}
                <div className="text-center mt-4">
                    <Link
                        to="/admin"
                        className="text-sm text-slate-500 hover:text-blue-600"
                    >
                        Admin Login
                    </Link>
                </div>

                {/* Home */}
                <div className="text-center mt-4">
                    <Link
                        to="/"
                        className="text-sm text-slate-500 hover:text-blue-600"
                    >
                        ← Back to Home
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Registration;