
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerAdmin } from "../../service/authService";

const AdminRegistration = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setError("");
        setSuccess("");

        const fullName = formData.fullName.trim();
        const email = formData.email.trim().toLowerCase();

        if (!fullName || !email) {
            setError("Please enter your full name and email.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setLoading(true);

        try {
            const data = await registerAdmin({
                fullName,
                email,
            });

            if (!data?.success) {
                setError(
                    data?.message || "Admin registration failed."
                );
                return;
            }

            localStorage.setItem("adminVerificationEmail", email);
            localStorage.setItem("adminRegistrationName", fullName);

            setSuccess(
                data.message || "Verification code sent successfully."
            );

            setTimeout(() => {
                navigate("/admin/verify", { replace: true });
            }, 1000);

        } catch (err) {
            setError(
                err.message || "Unable to register administrator."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

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

                {error && (
                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

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
                            placeholder="Enter admin full name"
                            autoComplete="name"
                            required
                            disabled={loading}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-slate-700 mb-2"
                        >
                            Admin Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter admin email"
                            autoComplete="email"
                            required
                            disabled={loading}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                        />
                    </div>

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
