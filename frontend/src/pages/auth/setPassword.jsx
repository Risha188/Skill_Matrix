
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { setPassword } from "../../service/authService";

const SetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get email from navigation state or localStorage
    const email = (
        location.state?.email ||
        localStorage.getItem("verificationEmail") ||
        ""
    ).trim().toLowerCase();

    const [password, setPasswordValue] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Redirect if email is missing
    useEffect(() => {
        if (!email) {
            navigate("/registration", { replace: true });
        }
    }, [email, navigate]);

    // Handle password changes
    const handlePasswordChange = (e) => {
        setPasswordValue(e.target.value);
        setError("");
        setSuccess("");
    };

    // Handle confirm password changes
    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setError("");
        setSuccess("");
    };

    // Validate password
    const validatePassword = () => {
        if (!email) {
            return "Registration email is missing. Please register again.";
        }

        if (!password) {
            return "Please enter a password.";
        }

        if (password.length < 8) {
            return "Password must be at least 8 characters long.";
        }

        if (password.length > 128) {
            return "Password cannot exceed 128 characters.";
        }

        if (!confirmPassword) {
            return "Please confirm your password.";
        }

        if (password !== confirmPassword) {
            return "Passwords do not match.";
        }

        return "";
    };

    // Submit password
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        setError("");
        setSuccess("");

        const validationError = validatePassword();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setIsSubmitting(true);

            const data = await setPassword({
                email,
                password,
                confirmPassword,
            });

            console.log("Set password response:", data);

            if (data?.success === true) {
                setSuccess(
                    data.message ||
                    "Password created successfully!"
                );

                // Remove temporary email after account setup
                localStorage.removeItem("verificationEmail");

                // Clear password fields
                setPasswordValue("");
                setConfirmPassword("");

                // Redirect to login
                navigate("/login", {
                    replace: true,
                    state: {
                        email,
                        message: "Account created successfully. Please log in.",
                    },
                });

                return;
            }

            setError(
                data?.message ||
                data?.error ||
                "Unable to create password. Please try again."
            );

        } catch (err) {
            console.error(
                "Set password error:",
                err.response?.data || err.message
            );

            const status = err.response?.status;

            if (status === 400) {
                setError(
                    err.response?.data?.message ||
                    "Invalid password details."
                );
            } else if (status === 404) {
                setError(
                    err.response?.data?.message ||
                    "Account not found. Please register again."
                );
            } else if (status === 409) {
                setError(
                    err.response?.data?.message ||
                    "Password has already been created."
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
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Unable to create password. Please try again."
                );
            }

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">

                <div className="grid md:grid-cols-2">

                    {/* LEFT SIDE */}
                    <div className="hidden md:flex bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white p-10 flex-col justify-between">

                        <div>

                            {/* Logo */}
                            <div className="flex items-center gap-3 mb-10">

                                <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center overflow-hidden p-2">

                                    <img
                                        src="/pcs_logo.jpg"
                                        alt="PCS Global"
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />

                                </div>

                                <div>
                                    <h1 className="text-2xl font-bold">
                                        Skill Matrix
                                    </h1>

                                    <p className="text-blue-100 text-sm">
                                        Employee Portal
                                    </p>
                                </div>

                            </div>

                            <h2 className="text-4xl font-bold leading-tight mb-5">
                                Create Your Password
                            </h2>

                            <p className="text-blue-100 leading-7">
                                Your email has been verified successfully.
                                Create a secure password to complete your
                                Skill Matrix account.
                            </p>

                        </div>

                        {/* Features */}
                        <div className="space-y-4 text-sm text-blue-100">

                            <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                                    ✓
                                </span>
                                Email verified
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                                    ✓
                                </span>
                                Create a secure password
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                                    ✓
                                </span>
                                Complete your account
                            </div>

                        </div>

                    </div>

                    {/* RIGHT SIDE */}
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
                                Employee Portal
                            </p>

                        </div>

                        {/* Heading */}
                        <div className="mb-7">

                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-4">

                                <span className="w-2 h-2 rounded-full bg-blue-500" />

                                CREATE PASSWORD

                            </div>

                            <h2 className="text-3xl font-bold text-slate-800">
                                Set Password
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Create a secure password to complete your account.
                            </p>

                        </div>

                        {/* Email */}
                        <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">

                            <p className="text-xs text-slate-500 mb-1">
                                Verified email
                            </p>

                            <p className="font-medium text-slate-700 break-all">
                                {email || "Email not available"}
                            </p>

                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                role="alert"
                                className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm"
                            >
                                {error}
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div
                                role="status"
                                className="mb-5 p-3 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm"
                            >
                                {success}
                            </div>
                        )}

                        {/* PASSWORD FORM */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                            noValidate
                        >

                            {/* Password */}
                            <div>

                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-slate-700 mb-1.5"
                                >
                                    New Password
                                </label>

                                <div className="relative">

                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={handlePasswordChange}
                                        placeholder="Enter new password"
                                        autoComplete="new-password"
                                        disabled={isSubmitting || !email}
                                        required
                                        maxLength={128}
                                        className="w-full px-4 py-3 pr-16 rounded-xl border border-slate-200 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100 disabled:cursor-not-allowed"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-700"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>

                                </div>

                                <p className="text-xs text-slate-400 mt-1.5">
                                    Use at least 8 characters.
                                </p>

                            </div>

                            {/* Confirm Password */}
                            <div>

                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-slate-700 mb-1.5"
                                >
                                    Confirm Password
                                </label>

                                <div className="relative">

                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                        placeholder="Confirm your password"
                                        autoComplete="new-password"
                                        disabled={isSubmitting || !email}
                                        required
                                        maxLength={128}
                                        className="w-full px-4 py-3 pr-16 rounded-xl border border-slate-200 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100 disabled:cursor-not-allowed"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-700"
                                    >
                                        {showConfirmPassword ? "Hide" : "Show"}
                                    </button>

                                </div>

                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting || !email}
                                className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed active:scale-[0.99] transition shadow-lg shadow-blue-200"
                            >
                                {isSubmitting
                                    ? "Creating Password..."
                                    : "Create Password"}
                            </button>

                        </form>

                        {/* Login */}
                        <div className="text-center mt-7">

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

                    </div>

                </div>
            </div>
        </div>
    );
};

export default SetPassword;