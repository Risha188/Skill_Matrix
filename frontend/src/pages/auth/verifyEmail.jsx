import React, { useState } from "react";
import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";

import { verifyEmail } from "../../service/authService";

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // ======================================================
    // GET EMAIL
    // ======================================================

    const email =
        location.state?.email ||
        localStorage.getItem("verificationEmail") ||
        "";

    // ======================================================
    // STATES
    // ======================================================

    const [verificationCode, setVerificationCode] =
        useState("");

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    // ======================================================
    // HANDLE CODE INPUT
    // ======================================================

    const handleChange = (e) => {
        // Allow numbers only
        const value = e.target.value
            .replace(/\D/g, "")
            .slice(0, 6);

        setVerificationCode(value);

        // Clear messages when user starts typing
        setError("");
        setSuccess("");
    };

    // ======================================================
    // VERIFY EMAIL
    // ======================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent duplicate submissions
        if (isSubmitting) {
            return;
        }

        // Clear previous messages
        setError("");
        setSuccess("");

        // ==================================================
        // CHECK EMAIL
        // ==================================================

        if (!email) {
            setError(
                "Registration email is missing. Please register again."
            );

            return;
        }

        // ==================================================
        // CHECK VERIFICATION CODE
        // ==================================================

        if (!verificationCode) {
            setError(
                "Please enter the verification code."
            );

            return;
        }

        // ==================================================
        // CHECK CODE LENGTH
        // ==================================================

        if (verificationCode.length !== 6) {
            setError(
                "Verification code must be 6 digits."
            );

            return;
        }

        try {
            // ==================================================
            // START SUBMITTING
            // ==================================================

            setIsSubmitting(true);

            // ==================================================
            // VERIFY EMAIL API
            // ==================================================

            const response = await verifyEmail({
                email,
                verificationCode,
            });

            console.log(
                "Email Verification Response:",
                response?.data
            );

            // ==================================================
            // SUCCESS
            // ==================================================

            if (response?.data?.success) {
                setSuccess(
                    "Email verified successfully!"
                );

                // Save email so it is available on the
                // password creation page if needed.
                localStorage.setItem(
                    "verificationEmail",
                    email
                );

                // ==================================================
                // GO TO SET PASSWORD
                // ==================================================

                setTimeout(() => {
                    navigate("/set-password", {
                        replace: true,
                        state: {
                            email,
                        },
                    });
                }, 700);

                return;
            }

            // ==================================================
            // API RETURNED FAILURE
            // ==================================================

            setError(
                response?.data?.message ||
                "Invalid or expired verification code."
            );
        } catch (err) {
            // ==================================================
            // API ERROR
            // ==================================================

            console.error(
                "Email Verification Error:",
                err
            );

            console.error(
                "Response:",
                err?.response?.data
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Invalid or expired verification code."
            );
        } finally {
            // ==================================================
            // STOP SUBMITTING
            // ==================================================

            setIsSubmitting(false);
        }
    };

    // ======================================================
    // PAGE
    // ======================================================

    return (
        <div
            className="
                min-h-screen
                bg-linear-to-br
                from-slate-50
                via-white
                to-blue-50
                flex
                items-center
                justify-center
                px-4
                py-8
            "
        >
            <div
                className="
                    w-full
                    max-w-5xl
                    bg-white
                    rounded-3xl
                    shadow-2xl
                    overflow-hidden
                    border
                    border-slate-100
                "
            >
                <div className="grid md:grid-cols-2">

                    {/* ==================================================
                        LEFT SIDE
                    ================================================== */}

                    <div
                        className="
                            hidden
                            md:flex
                            bg-linear-to-br
                            from-blue-600
                            via-blue-700
                            to-indigo-900
                            text-white
                            p-10
                            flex-col
                            justify-between
                        "
                    >
                        <div>

                            {/* LOGO */}

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    mb-10
                                "
                            >
                                <div
                                    className="
                                        w-20
                                        h-20
                                        rounded-full
                                        bg-white/10
                                        flex
                                        items-center
                                        justify-center
                                        text-2xl
                                        font-bold
                                        border
                                        border-white/10
                                    "
                                >
                                    <img
                                        src="../../../public/pcs_logo.jpg"
                                        alt="PCS Global"
                                        className="w-full h-full object-contain bg-white rounded-full p-2"
                                    />
                                </div>

                                <div>
                                    <h1
                                        className="
                                            text-2xl
                                            font-bold
                                        "
                                    >
                                        Skill Matrix
                                    </h1>

                                    <p
                                        className="
                                            text-blue-100
                                            text-sm
                                        "
                                    >
                                        Employee Portal
                                    </p>
                                </div>
                            </div>

                            {/* HEADING */}

                            <h2
                                className="
                                    text-4xl
                                    font-bold
                                    leading-tight
                                    mb-5
                                "
                            >
                                Verify Your Email
                            </h2>

                            <p
                                className="
                                    text-blue-100
                                    leading-7
                                "
                            >
                                We sent a verification code to
                                your registered email address.
                                Verify your email to continue
                                creating your account.
                            </p>
                        </div>

                        {/* FEATURES */}

                        <div
                            className="
                                space-y-4
                                text-sm
                                text-blue-100
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >
                                <span
                                    className="
                                        w-7
                                        h-7
                                        rounded-full
                                        bg-white/10
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >
                                    ✓
                                </span>

                                Secure email verification
                            </div>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >
                                <span
                                    className="
                                        w-7
                                        h-7
                                        rounded-full
                                        bg-white/10
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >
                                    ✓
                                </span>

                                Protect your Skill Matrix account
                            </div>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >
                                <span
                                    className="
                                        w-7
                                        h-7
                                        rounded-full
                                        bg-white/10
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >
                                    ✓
                                </span>

                                Continue to create your password
                            </div>
                        </div>
                    </div>

                    {/* ==================================================
                        RIGHT SIDE
                    ================================================== */}

                    <div className="p-6 sm:p-10">

                        {/* MOBILE LOGO */}

                        <div
                            className="
                                md:hidden
                                text-center
                                mb-7
                            "
                        >
                            <div
                                className="
                                    inline-flex
                                    w-12
                                    h-12
                                    rounded-xl
                                    bg-blue-600
                                    text-white
                                    items-center
                                    justify-center
                                    font-bold
                                    text-xl
                                    mb-2
                                "
                            >
                                SM
                            </div>

                            <h1
                                className="
                                    text-2xl
                                    font-bold
                                    text-slate-800
                                "
                            >
                                Skill Matrix
                            </h1>

                            <p
                                className="
                                    text-sm
                                    text-slate-500
                                "
                            >
                                Employee Portal
                            </p>
                        </div>

                        {/* HEADING */}

                        <div className="mb-7">

                            <div
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    px-3
                                    py-1.5
                                    rounded-full
                                    bg-blue-50
                                    text-blue-600
                                    text-xs
                                    font-semibold
                                    mb-4
                                "
                            >
                                <span
                                    className="
                                        w-2
                                        h-2
                                        rounded-full
                                        bg-blue-500
                                    "
                                />

                                EMAIL VERIFICATION
                            </div>

                            <h2
                                className="
                                    text-3xl
                                    font-bold
                                    text-slate-800
                                "
                            >
                                Verify Email
                            </h2>

                            <p
                                className="
                                    text-slate-500
                                    mt-2
                                "
                            >
                                Enter the 6-digit verification
                                code sent to your email.
                            </p>
                        </div>

                        {/* EMAIL */}

                        <div
                            className="
                                mb-6
                                p-4
                                rounded-xl
                                bg-slate-50
                                border
                                border-slate-200
                            "
                        >
                            <p
                                className="
                                    text-xs
                                    text-slate-500
                                    mb-1
                                "
                            >
                                Verification email
                            </p>

                            <p
                                className="
                                    font-medium
                                    text-slate-700
                                    break-all
                                "
                            >
                                {email || "Email not available"}
                            </p>
                        </div>

                        {/* ERROR */}

                        {error && (
                            <div
                                className="
                                    mb-5
                                    p-3
                                    rounded-xl
                                    bg-red-50
                                    border
                                    border-red-200
                                    text-red-600
                                    text-sm
                                "
                            >
                                {error}
                            </div>
                        )}

                        {/* SUCCESS */}

                        {success && (
                            <div
                                className="
                                    mb-5
                                    p-3
                                    rounded-xl
                                    bg-green-50
                                    border
                                    border-green-200
                                    text-green-600
                                    text-sm
                                "
                            >
                                {success}
                            </div>
                        )}

                        {/* ==================================================
                            VERIFICATION FORM
                        ================================================== */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* VERIFICATION CODE */}

                            <div>

                                <label
                                    className="
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        mb-1.5
                                    "
                                >
                                    Verification Code
                                </label>

                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={6}
                                    value={verificationCode}
                                    onChange={handleChange}
                                    placeholder="Enter 6-digit code"
                                    autoComplete="one-time-code"
                                    disabled={isSubmitting}
                                    required
                                    className="
                                        w-full
                                        px-4
                                        py-3
                                        rounded-xl
                                        border
                                        border-slate-200
                                        outline-none
                                        transition
                                        focus:border-blue-500
                                        focus:ring-4
                                        focus:ring-blue-100
                                        text-center
                                        text-xl
                                        tracking-[0.5em]
                                        font-semibold
                                        disabled:bg-slate-100
                                        disabled:cursor-not-allowed
                                    "
                                />

                                <p
                                    className="
                                        text-xs
                                        text-slate-400
                                        mt-1.5
                                    "
                                >
                                    Enter the 6-digit code sent
                                    to your email.
                                </p>
                            </div>

                            {/* VERIFY BUTTON */}

                            <button
                                type="submit"
                                disabled={
                                    isSubmitting ||
                                    verificationCode.length !== 6
                                }
                                className="
                                    w-full
                                    py-3.5
                                    rounded-xl
                                    bg-blue-600
                                    text-white
                                    font-semibold
                                    hover:bg-blue-700
                                    disabled:bg-blue-300
                                    disabled:cursor-not-allowed
                                    active:scale-[0.99]
                                    transition
                                    shadow-lg
                                    shadow-blue-200
                                "
                            >
                                {isSubmitting
                                    ? "Verifying..."
                                    : "Verify Email"}
                            </button>
                        </form>

                        {/* BACK TO REGISTRATION */}

                        <div
                            className="
                                text-center
                                mt-7
                            "
                        >
                            <p
                                className="
                                    text-sm
                                    text-slate-500
                                "
                            >
                                Didn't register with this email?{" "}

                                <Link
                                    to="/registration"
                                    className="
                                        font-semibold
                                        text-blue-600
                                        hover:text-blue-700
                                    "
                                >
                                    Register Again
                                </Link>
                            </p>
                        </div>

                        {/* LOGIN */}

                        <div
                            className="
                                text-center
                                mt-3
                            "
                        >
                            <Link
                                to="/login"
                                className="
                                    text-sm
                                    text-slate-500
                                    hover:text-blue-600
                                    transition
                                "
                            >
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;