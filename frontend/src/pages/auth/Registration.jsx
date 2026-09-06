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

    /* =====================================================
       HANDLE INPUT CHANGE
    ===================================================== */

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear messages while user is typing
        if (error) {
            setError("");
        }

        if (success) {
            setSuccess("");
        }
    };

    /* =====================================================
       HANDLE REGISTRATION
    ===================================================== */

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setError("");
        setSuccess("");

        const fullName = formData.fullName.trim();
        const email = formData.email.trim().toLowerCase();

        /* =================================================
           VALIDATION
        ================================================= */

        if (!fullName) {
            setError("Please enter your full name.");
            return;
        }

        if (fullName.length < 2) {
            setError("Full name must contain at least 2 characters.");
            return;
        }

        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        // Basic email validation
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        /* =================================================
           API REQUEST
        ================================================= */

        try {
            setLoading(true);

            console.log("=================================");
            console.log("📝 EMPLOYEE REGISTRATION");
            console.log("Full Name:", fullName);
            console.log("Email:", email);
            console.log("=================================");

            const response = await registerUser({
                fullName,
                email,
            });

            const data = response?.data || {};

            console.log("✅ Registration Response:", data);

            /* =================================================
               SUCCESS
            ================================================= */

            if (data.success) {
                const successMessage =
                    data.message ||
                    "Registration successful. Please verify your email.";

                setSuccess(successMessage);

                // Save email temporarily for verification page
                localStorage.setItem(
                    "verificationEmail",
                    email
                );

                console.log(
                    "📧 Verification email saved:",
                    email
                );

                /*
                 * Navigate after successful registration.
                 *
                 * Passing email through router state makes it
                 * immediately available on VerifyEmail.jsx.
                 */
                navigate("/verify-email", {
                    state: {
                        email,
                    },
                    replace: true,
                });

                return;
            }

            /* =================================================
               BACKEND RETURNED FAILURE
            ================================================= */

            setError(
                data.message ||
                data.error ||
                "Registration failed. Please try again."
            );
        } catch (error) {
            console.error("=================================");
            console.error("❌ REGISTRATION ERROR");
            console.error(
                error.response?.data ||
                error.message ||
                error
            );
            console.error("=================================");

            /* =================================================
               ERROR MESSAGE
            ================================================= */

            if (error.response?.status === 400) {
                setError(
                    error.response?.data?.message ||
                    "Invalid registration details."
                );
            } else if (error.response?.status === 409) {
                setError(
                    error.response?.data?.message ||
                    "An account with this email already exists."
                );
            } else if (error.response?.status === 403) {
                setError(
                    error.response?.data?.message ||
                    "Registration request was not authorized."
                );
            } else if (error.code === "ERR_NETWORK") {
                setError(
                    "Unable to connect to the server. Please check your backend URL and CORS configuration."
                );
            } else {
                setError(
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    error.message ||
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

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-slate-800">
                        Create Account
                    </h1>

                    <p className="text-sm text-slate-500 mt-2">
                        Register your SkillMatrix account
                    </p>

                </div>


                {/* =================================================
                    ERROR MESSAGE
                ================================================= */}

                {error && (
                    <div
                        role="alert"
                        className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"
                    >
                        {error}
                    </div>
                )}


                {/* =================================================
                    SUCCESS MESSAGE
                ================================================= */}

                {success && (
                    <div
                        role="status"
                        className="mb-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600"
                    >
                        {success}
                    </div>
                )}


                {/* =================================================
                    REGISTRATION FORM
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* =================================================
                        FULL NAME
                    ================================================= */}

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
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:cursor-not-allowed"
                        />

                    </div>


                    {/* =================================================
                        EMAIL
                    ================================================= */}

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
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:cursor-not-allowed"
                        />

                    </div>


                    {/* =================================================
                        SUBMIT BUTTON
                    ================================================= */}

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


                {/* =================================================
                    LOGIN
                ================================================= */}

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


                {/* =================================================
                    ADMIN LOGIN
                ================================================= */}

                <div className="text-center mt-4">

                    <Link
                        to="/admin"
                        className="text-sm text-slate-500 hover:text-blue-600"
                    >
                        Admin Login
                    </Link>

                </div>


                {/* =================================================
                    HOME
                ================================================= */}

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