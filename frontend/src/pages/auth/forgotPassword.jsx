import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../../service/authService";

const ForgotPassword = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await forgotPassword({
                email: email.trim()
            });

            console.log("Forgot Password Response:", response.data);

            if (response.data.success) {

                // Move to OTP verification page
                navigate("/verify-reset-code", {
                    state: {
                        email: email.trim()
                    }
                });

            } else {

                setError(
                    response.data.message ||
                    "Unable to send reset code"
                );
            }

        } catch (error) {

            console.error(
                "Forgot Password Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">

                <div className="grid md:grid-cols-2">

                    {/* ========================= */}
                    {/* LEFT SIDE */}
                    {/* ========================= */}

                    <div className="hidden md:flex bg-linear-to-br from-blue-700 via-blue-600 to-indigo-700 text-white p-10 flex-col justify-between">

                        <div>

                            {/* Logo */}

                            <div className="flex items-center gap-3 mb-10">

                                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                                    <img
                                        src="/pcs_logo.jpg"
                                        alt="PCS Global"
                                        className="w-full h-full object-contain bg-white rounded-full p-2"
                                    />
                                </div>

                                <div>

                                    <h1 className="text-2xl font-bold">
                                        Skill Matrix
                                    </h1>

                                    <p className="text-blue-100 text-sm">
                                        Employee Management System
                                    </p>

                                </div>

                            </div>


                            <h2 className="text-4xl font-bold leading-tight mb-5">
                                Reset your password.
                            </h2>

                        </div>


                        {/* Features */}

                        <div className="space-y-4 text-sm text-blue-100">

                            <div className="flex items-center gap-3">

                                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                                    ✓
                                </span>

                                Secure password recovery

                            </div>


                            <div className="flex items-center gap-3">

                                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                                    ✓
                                </span>

                                Protected account access

                            </div>


                            <div className="flex items-center gap-3">

                                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                                    ✓
                                </span>

                                Easy account recovery

                            </div>

                        </div>

                    </div>


                    {/* ========================= */}
                    {/* RIGHT SIDE */}
                    {/* ========================= */}

                    <div className="p-6 sm:p-10">

                        {/* Mobile Logo */}

                        <div className="md:hidden text-center mb-7">

                            <div className="inline-flex w-12 h-12 rounded-xl bg-blue-600 text-white items-center justify-center font-bold text-xl mb-2">
                                SM
                            </div>

                            <h1 className="text-2xl font-bold text-slate-800">
                                Skill Matrix
                            </h1>

                            <p className="text-sm text-slate-500">
                                Employee Management System
                            </p>

                        </div>


                        {/* Icon */}

                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mb-6">
                            🔐
                        </div>


                        {/* Heading */}

                        <div className="mb-7">

                            <h2 className="text-3xl font-bold text-slate-800">
                                Forgot Password?
                            </h2>

                            <p className="text-slate-500 mt-2 leading-6">
                                Enter your registered employee email
                                address and we'll send you a
                                verification code.
                            </p>

                        </div>


                        {/* ========================= */}
                        {/* ERROR MESSAGE */}
                        {/* ========================= */}

                        {error && (

                            <div className="mb-5 rounded-xl bg-red-50 border border-red-200 p-4">

                                <div className="flex items-start gap-3">

                                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                                        !
                                    </div>

                                    <div>

                                        <h3 className="font-semibold text-red-800">
                                            Unable to send code
                                        </h3>

                                        <p className="text-sm text-red-700 mt-1">
                                            {error}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        )}


                        {/* ========================= */}
                        {/* EMAIL FORM */}
                        {/* ========================= */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* Email */}

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="Enter your registered email"
                                    required
                                    disabled={loading}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100 disabled:cursor-not-allowed"
                                />

                            </div>


                            {/* Submit */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 active:scale-[0.99] transition shadow-lg shadow-blue-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
                            >

                                {loading
                                    ? "Sending Code..."
                                    : "Send Reset Code"
                                }

                            </button>

                        </form>


                        {/* ========================= */}
                        {/* BACK TO LOGIN */}
                        {/* ========================= */}

                        <div className="text-center mt-7">

                            <Link
                                to="/login"
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                                ← Back to Login
                            </Link>

                        </div>


                        {/* ========================= */}
                        {/* REGISTRATION */}
                        {/* ========================= */}

                        <div className="text-center mt-4">

                            <p className="text-sm text-slate-500">

                                Don't have an account?{" "}

                                <Link
                                    to="/registration"
                                    className="font-semibold text-blue-600 hover:text-blue-700"
                                >
                                    Create Account
                                </Link>

                            </p>

                        </div>


                        {/* ========================= */}
                        {/* HOME */}
                        {/* ========================= */}

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

            </div>

        </div>
    );
};

export default ForgotPassword;