import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { setPassword } from "../../service/authService";

const SetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Email comes from VerifyEmail page
    const email = location.state?.email || "";

    const [password, setPasswordValue] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ==========================================
    // CHECK EMAIL
    // ==========================================

    useEffect(() => {
        // If user directly opens Set Password page
        // without verified email, send them to login.
        if (!email) {
            navigate("/login", { replace: true });
        }
    }, [email, navigate]);

    // ==========================================
    // PASSWORD CHANGE
    // ==========================================

    const handlePasswordChange = (e) => {
        setPasswordValue(e.target.value);
        setError("");
        setSuccess("");
    };

    // ==========================================
    // CONFIRM PASSWORD CHANGE
    // ==========================================

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setError("");
        setSuccess("");
    };

    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // ==========================================
        // VALIDATE EMAIL
        // ==========================================

        if (!email) {
            setError(
                "Registration email is missing. Please register again."
            );
            return;
        }

        // ==========================================
        // VALIDATE PASSWORD
        // ==========================================

        if (!password) {
            setError("Please enter a password.");
            return;
        }

        // ==========================================
        // PASSWORD LENGTH
        // ==========================================

        if (password.length < 6) {
            setError(
                "Password must be at least 6 characters long."
            );
            return;
        }

        // ==========================================
        // VALIDATE CONFIRM PASSWORD
        // ==========================================

        if (!confirmPassword) {
            setError("Please confirm your password.");
            return;
        }

        // ==========================================
        // MATCH PASSWORDS
        // ==========================================

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // ==========================================
        // SEND TO BACKEND
        // ==========================================

        try {
            setIsSubmitting(true);

            const response = await setPassword({
                email: email,
                password: password,
                confirmPassword: confirmPassword
            });

            console.log(
                "Set Password Response:",
                response.data
            );

            // ==========================================
            // SUCCESS
            // ==========================================

            if (response.data.success) {
                setSuccess(
                    "Password created successfully!"
                );

                /*
                 * IMPORTANT:
                 *
                 * replace: true removes the Set Password
                 * page from browser history.
                 *
                 * So after successful password creation:
                 *
                 * Set Password
                 *       ↓
                 *     Login
                 *
                 * Pressing Back will NOT return to
                 * the Set Password page.
                 */

                setTimeout(() => {
                    navigate("/login", {
                        replace: true
                    });
                }, 1000);
            }

        } catch (error) {
            console.error(
                "Set Password Error:",
                error
            );

            console.error(
                "Response:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Unable to create password. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // ==========================================
    // PAGE UI
    // ==========================================

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">

                <div className="grid md:grid-cols-2">

                    {/* ========================================= */}
                    {/* LEFT SIDE */}
                    {/* ========================================= */}

                    <div className="hidden md:flex bg-linear-to-br from-blue-600 via-blue-700 to-indigo-900 text-white p-10 flex-col justify-between">

                        <div>

                            {/* Logo */}

                            <div className="flex items-center gap-3 mb-10">

                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl font-bold border border-white/10">
                                    SM
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


                    {/* ========================================= */}
                    {/* RIGHT SIDE */}
                    {/* ========================================= */}

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

                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>

                                CREATE PASSWORD

                            </div>

                            <h2 className="text-3xl font-bold text-slate-800">
                                Set Password
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Create a password to complete your account.
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
                            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                                {error}
                            </div>
                        )}


                        {/* Success */}

                        {success && (
                            <div className="mb-5 p-3 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm">
                                {success}
                            </div>
                        )}


                        {/* ========================================= */}
                        {/* PASSWORD FORM */}
                        {/* ========================================= */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* Password */}

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter new password"
                                    autoComplete="new-password"
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100 disabled:cursor-not-allowed"
                                />

                                <p className="text-xs text-slate-400 mt-1.5">
                                    Password must be at least 6 characters.
                                </p>

                            </div>


                            {/* Confirm Password */}

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    placeholder="Confirm your password"
                                    autoComplete="new-password"
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100 disabled:cursor-not-allowed"
                                />

                            </div>


                            {/* Submit */}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-300 active:scale-[0.99] transition shadow-lg shadow-blue-200"
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
                                    replace
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