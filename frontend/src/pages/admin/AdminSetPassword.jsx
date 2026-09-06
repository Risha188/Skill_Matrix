import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminSetPassword = () => {

    const navigate = useNavigate();

    const email = localStorage.getItem(
        "adminVerifiedEmail"
    );

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (!email) {
            setError(
                "Verified email not found. Please start again."
            );
            return;
        }

        if (!password || !confirmPassword) {
            setError(
                "Please enter both password fields."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError(
                "Passwords do not match."
            );
            return;
        }

        if (password.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );
            return;
        }

        try {

            setLoading(true);

            const response = await axios.post(
                "http://localhost:5000/api/admin/set-password",
                {
                    email,
                    password,
                    confirmPassword
                }
            );

            if (response.data.success) {

                localStorage.removeItem(
                    "adminVerificationEmail"
                );

                localStorage.removeItem(
                    "adminVerifiedEmail"
                );

                alert(
                    "Admin account created successfully!"
                );

                navigate("/admin");
            }

        } catch (error) {

            console.error(
                "Set Password Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to create admin account."
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                <div className="text-center mb-8">

                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-800 text-xl font-bold text-white">
                        SM
                    </div>

                    <h1 className="text-3xl font-bold text-slate-800">
                        Set Admin Password
                    </h1>

                    <p className="text-sm text-slate-500 mt-2">
                        Create a secure password for your
                        administrator account.
                    </p>

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

                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            New Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter password"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>

                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Confirm password"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-slate-800 py-3 font-semibold text-white hover:bg-slate-900 disabled:opacity-60"
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Admin Account"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default AdminSetPassword;