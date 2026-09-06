import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminRegistration = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ==========================================
    // HANDLE INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // ==========================================
    // HANDLE REGISTRATION
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // ==========================================
        // VALIDATION
        // ==========================================

        const fullName = formData.fullName.trim();
        const email = formData.email.trim().toLowerCase();

        if (!fullName) {
            setError("Please enter your full name.");
            return;
        }

        if (!email) {
            setError("Please enter your email.");
            return;
        }

        // Simple email validation
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        try {
            setLoading(true);

            // ==========================================
            // CALL BACKEND
            // ==========================================

            const response = await axios.post(
                "http://localhost:5000/api/admin/register",
                {
                    fullName: fullName,
                    email: email
                }
            );

            console.log(
                "Admin Registration Response:",
                response.data
            );

            // ==========================================
            // SUCCESS
            // ==========================================

            if (response.data.success) {

                setSuccess(
                    response.data.message ||
                    "Verification code sent successfully."
                );

                // Save email for verification page
                localStorage.setItem(
                    "adminVerificationEmail",
                    email
                );

                // Also save name if needed later
                localStorage.setItem(
                    "adminRegistrationName",
                    fullName
                );

                // ==========================================
                // GO TO VERIFY PAGE
                // ==========================================

                setTimeout(() => {
                    navigate("/admin/verify");
                }, 1000);

            } else {

                setError(
                    response.data.message ||
                    "Admin registration failed."
                );
            }

        } catch (error) {

            console.error(
                "Admin Registration Error:",
                error
            );

            // ==========================================
            // BACKEND ERROR
            // ==========================================

            if (error.response) {

                setError(
                    error.response.data?.message ||
                    `Registration failed (${error.response.status}).`
                );

            } else if (error.request) {

                setError(
                    "Cannot connect to server. Make sure your backend is running on port 5000."
                );

            } else {

                setError(
                    "Admin registration failed. Please try again."
                );
            }

        } finally {

            setLoading(false);

        }
    };

    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                {/* ==========================================
                    HEADER
                ========================================== */}

                <div className="text-center mb-8">

                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-800 text-xl font-bold text-white">
                        SM
                    </div>

                    <h1 className="text-3xl font-bold text-slate-800">
                        Create Admin Account
                    </h1>

                    <p className="text-sm text-slate-500 mt-2">
                        Register your SkillMatrix administrator account
                    </p>

                </div>

                {/* ==========================================
                    ERROR MESSAGE
                ========================================== */}

                {error && (
                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* ==========================================
                    SUCCESS MESSAGE
                ========================================== */}

                {success && (
                    <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                        {success}
                    </div>
                )}

                {/* ==========================================
                    FORM
                ========================================== */}

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
                            placeholder="Enter admin full name"
                            disabled={loading}
                            autoComplete="name"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:cursor-not-allowed"
                        />

                    </div>

                    {/* Email */}

                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Admin Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter admin email"
                            disabled={loading}
                            autoComplete="email"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:cursor-not-allowed"
                        />

                    </div>

                    {/* Submit */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-slate-800 py-3 font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        {loading
                            ? "Sending Verification Code..."
                            : "Create Admin Account"}

                    </button>

                </form>

                {/* ==========================================
                    ADMIN LOGIN
                ========================================== */}

                <div className="text-center mt-6">

                    <p className="text-sm text-slate-500">

                        Already have an admin account?{" "}

                        <Link
                            to="/admin"
                            className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Admin Login
                        </Link>

                    </p>

                </div>

                {/* ==========================================
                    EMPLOYEE REGISTRATION
                ========================================== */}

                <div className="text-center mt-4">

                    <Link
                        to="/registration"
                        className="text-sm text-slate-500 hover:text-blue-600"
                    >
                        Employee Registration
                    </Link>

                </div>

            </div>

        </div>
    );
};

export default AdminRegistration;