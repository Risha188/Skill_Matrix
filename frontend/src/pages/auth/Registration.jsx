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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.fullName.trim()) {
            setError("Please enter your full name.");
            return;
        }

        if (!formData.email.trim()) {
            setError("Please enter your email.");
            return;
        }

        try {
            setLoading(true);

            const response = await registerUser(formData);

            console.log("Registration Response:", response.data);

            if (response.data.success) {
                setSuccess(
                    response.data.message ||
                    "Registration successful. Please verify your email."
                );

                // Save email temporarily for verification page
                localStorage.setItem(
                    "verificationEmail",
                    formData.email
                );

                // Go to email verification page
              setTimeout(() => {
    navigate("/verify-email", {
        state: {
            email: formData.email
        }
    });
}, 1000);
            }
        } catch (error) {
            console.error("Registration Error:", error);

            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

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

                {/* Error */}
                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600">
                        {success}
                    </div>
                )}

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>

                {/* Login */}
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

                {/* Admin */}
                <div className="text-center mt-4">
                    <Link
                        to="/admin"
                        className="text-sm text-slate-500 hover:text-blue-600"
                    >
                        Admin Login
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Registration;