
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { setAdminPassword } from "../../service/authService";

const AdminSetPassword = () => {
    const navigate = useNavigate();

    const email = (
        localStorage.getItem("adminVerifiedEmail") || ""
    ).trim().toLowerCase();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setError("");

        if (!email) {
            setError(
                "Verified email not found. Please complete email verification again."
            );
            return;
        }

        if (!password || !confirmPassword) {
            setError("Please enter both password fields.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const data = await setAdminPassword({
                email,
                password,
                confirmPassword,
            });

            if (!data?.success) {
                setError(
                    data?.message || "Unable to create admin account."
                );
                return;
            }

            localStorage.removeItem("adminVerificationEmail");
            localStorage.removeItem("adminVerifiedEmail");
            localStorage.removeItem("adminRegistrationName");

            alert("Admin account created successfully!");

            navigate("/admin", { replace: true });

        } catch (err) {
            console.error("Admin password setup failed:", err.message);

            setError(
                err.message || "Unable to create admin account."
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
                        Set Admin Password
                    </h1>

                    <p className="text-sm text-slate-500 mt-2">
                        Create a secure password for your administrator account.
                    </p>

                    {email && (
                        <p className="mt-3 text-sm font-medium text-blue-600 break-all">
                            {email}
                        </p>
                    )}

                </div>

                {error && (
                    <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* NEW PASSWORD */}
                    <div>

                        <label
                            htmlFor="admin-password"
                            className="block text-sm font-medium text-slate-700 mb-2"
                        >
                            New Password
                        </label>

                        <div className="relative">

                            <input
                                id="admin-password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError("");
                                }}
                                placeholder="Enter password"
                                autoComplete="new-password"
                                minLength={6}
                                required
                                disabled={loading}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword((prev) => !prev)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600"
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword
                                    ? <EyeOff size={20} />
                                    : <Eye size={20} />
                                }
                            </button>

                        </div>

                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div>

                        <label
                            htmlFor="admin-confirm-password"
                            className="block text-sm font-medium text-slate-700 mb-2"
                        >
                            Confirm Password
                        </label>

                        <div className="relative">

                            <input
                                id="admin-confirm-password"
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setError("");
                                }}
                                placeholder="Confirm password"
                                autoComplete="new-password"
                                required
                                disabled={loading}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword((prev) => !prev)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600"
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide confirm password"
                                        : "Show confirm password"
                                }
                            >
                                {showConfirmPassword
                                    ? <EyeOff size={20} />
                                    : <Eye size={20} />
                                }
                            </button>

                        </div>

                    </div>

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        disabled={loading || !email}
                        className="w-full rounded-lg bg-slate-800 py-3 font-semibold text-white hover:bg-slate-900 disabled:opacity-60 disabled:cursor-not-allowed transition"
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Admin Account"}
                    </button>

                </form>

                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={() => navigate("/admin")}
                        className="text-sm text-slate-500 hover:text-blue-600"
                    >
                        Back to Admin Login
                    </button>
                </div>

            </div>

        </div>
    );
};

export default AdminSetPassword;
