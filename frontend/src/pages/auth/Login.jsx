
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "../../service/authService";

const Login = () => {
    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =====================================================
    // SOCIAL LOGIN
    // =====================================================

    const handleSocialLogin = (provider) => {
        console.log(`${provider} login selected`);

        alert(
            `${provider} login is not connected yet.`
        );
    };

    // =====================================================
    // HANDLE LOGIN
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent multiple requests
        if (loading) {
            return;
        }

        // =================================================
        // NORMALIZE INPUT
        // =================================================

        const email = formData.email
            .trim()
            .toLowerCase();

        const password = formData.password;

        // =================================================
        // VALIDATION
        // =================================================

        if (!email || !password) {
            alert(
                "Email and password are required."
            );

            return;
        }

        setLoading(true);

        try {
            console.log(
                "================================="
            );

            console.log(
                "🔐 EMPLOYEE LOGIN REQUEST"
            );

            console.log(
                "Email:",
                email
            );

            console.log(
                "================================="
            );

            // =================================================
            // API REQUEST
            // =================================================

            const response = await loginUser({
                email,
                password,
            });

            const data = response?.data || {};

            console.log(
                "✅ LOGIN RESPONSE:",
                data
            );

            // =================================================
            // CHECK SUCCESS
            // =================================================

            if (!data.success) {
                alert(
                    data.message ||
                        "Login failed. Please check your email and password."
                );

                return;
            }

            // =================================================
            // GET TOKEN
            // =================================================

            const token =
                data.token ||
                data.accessToken ||
                data.access_token ||
                "";

            // =================================================
            // GET USER
            // =================================================

            const user =
                data.user ||
                data.userData ||
                data.employee?.user ||
                {};

            // =================================================
            // TOKEN VALIDATION
            // =================================================

            if (!token) {
                console.error(
                    "❌ No authentication token returned by backend."
                );

                alert(
                    "Login succeeded, but the server did not return an authentication token."
                );

                return;
            }

            // =================================================
            // NORMALIZE ROLE
            // =================================================

            const userRole = String(
                user.role ||
                    data.role ||
                    data.userRole ||
                    ""
            )
                .trim()
                .toLowerCase();

            console.log(
                "👤 LOGIN ROLE:",
                userRole
            );

            // =================================================
            // ADMIN ACCOUNT USED ON EMPLOYEE LOGIN
            // =================================================

            if (userRole === "admin") {
                console.warn(
                    "⚠️ Admin account used on Employee Login page."
                );

                // Remove ONLY employee session
                sessionStorage.removeItem(
                    "employeeToken"
                );

                sessionStorage.removeItem(
                    "employeeUser"
                );

                sessionStorage.removeItem(
                    "employeeUserId"
                );

                sessionStorage.removeItem(
                    "employeeUserEmail"
                );

                sessionStorage.removeItem(
                    "employeeUserRole"
                );

                sessionStorage.removeItem(
                    "employeeAuthenticated"
                );

                sessionStorage.removeItem(
                    "employeeId"
                );

                alert(
                    "This is the Employee Login page. Please use the Admin Login page for administrator access."
                );

                return;
            }

            // =================================================
            // EMPLOYEE ROLE VALIDATION
            // =================================================

            if (userRole !== "employee") {
                console.error(
                    "❌ Invalid or unknown user role:",
                    userRole
                );

                alert(
                    "This account does not have employee access."
                );

                return;
            }

            // =================================================
            // EMPLOYEE OBJECT
            // =================================================

            const employeeObject =
                data.employee ||
                data.employeeData ||
                user.employee ||
                {};

            // =================================================
            // EMPLOYEE ID
            // =================================================

            const employeeId =
                employeeObject.employeeId ||
                employeeObject.empId ||
                employeeObject.employeeID ||
                data.employeeId ||
                data.empId ||
                data.employeeID ||
                user.employeeId ||
                user.empId ||
                user.employeeID ||
                "";

            // =================================================
            // USER ID
            // =================================================

            const userId =
                user.id ||
                user._id ||
                data.userId ||
                data.user_id ||
                data.id ||
                "";

            // =================================================
            // USER EMAIL
            // =================================================

            const userEmail =
                user.email ||
                data.email ||
                email;

            console.log(
                "👨‍💻 Employee ID:",
                employeeId || "Not returned"
            );

            console.log(
                "👤 User ID:",
                userId || "Not returned"
            );

            console.log(
                "📧 User Email:",
                userEmail
            );

            // =================================================
            // CLEAR OLD EMPLOYEE SESSION
            // =================================================

            sessionStorage.removeItem(
                "employeeToken"
            );

            sessionStorage.removeItem(
                "employeeUser"
            );

            sessionStorage.removeItem(
                "employeeUserId"
            );

            sessionStorage.removeItem(
                "employeeUserEmail"
            );

            sessionStorage.removeItem(
                "employeeUserRole"
            );

            sessionStorage.removeItem(
                "employeeAuthenticated"
            );

            sessionStorage.removeItem(
                "employeeId"
            );

            // =================================================
            // SAVE EMPLOYEE SESSION
            // =================================================

            sessionStorage.setItem(
                "employeeToken",
                token
            );

            sessionStorage.setItem(
                "employeeUser",
                JSON.stringify(user)
            );

            sessionStorage.setItem(
                "employeeUserId",
                String(userId)
            );

            sessionStorage.setItem(
                "employeeUserEmail",
                userEmail
            );

            sessionStorage.setItem(
                "employeeUserRole",
                "employee"
            );

            sessionStorage.setItem(
                "employeeAuthenticated",
                "true"
            );

            // =================================================
            // SAVE EMPLOYEE ID
            // =================================================

            if (
                employeeId &&
                employeeId !== "undefined" &&
                employeeId !== "null"
            ) {
                sessionStorage.setItem(
                    "employeeId",
                    String(employeeId)
                );
            } else {
                console.warn(
                    "⚠️ Backend did not return employeeId."
                );

                sessionStorage.removeItem(
                    "employeeId"
                );
            }

            // =================================================
            // REMOVE OLD GENERIC AUTH STORAGE
            // =================================================
            //
            // IMPORTANT:
            // Do NOT remove adminToken/adminUser.
            //
            // =================================================

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "authToken"
            );

            localStorage.removeItem(
                "accessToken"
            );

            localStorage.removeItem(
                "user"
            );

            localStorage.removeItem(
                "userId"
            );

            localStorage.removeItem(
                "userEmail"
            );

            localStorage.removeItem(
                "userRole"
            );

            localStorage.removeItem(
                "employeeId"
            );

            localStorage.removeItem(
                "isAuthenticated"
            );

            // =================================================
            // SUCCESS LOG
            // =================================================

            console.log(
                "================================="
            );

            console.log(
                "✅ EMPLOYEE LOGIN SUCCESS"
            );

            console.log(
                "Employee ID:",
                employeeId || "Not returned"
            );

            console.log(
                "User ID:",
                userId || "Not returned"
            );

            console.log(
                "Email:",
                userEmail
            );

            console.log(
                "Role:",
                userRole
            );

            console.log(
                "🔐 Employee token saved in sessionStorage"
            );

            console.log(
                "🛡️ Admin session was NOT changed"
            );

            console.log(
                "================================="
            );

            // =================================================
            // REDIRECT TO EMPLOYEE DASHBOARD
            // =================================================

            navigate(
                "/employee/dashboard",
                {
                    replace: true,
                }
            );
        } catch (error) {
            console.error(
                "================================="
            );

            console.error(
                "❌ EMPLOYEE LOGIN ERROR"
            );

            console.error(
                error.response?.data ||
                    error.message ||
                    error
            );

            console.error(
                "================================="
            );

            // =================================================
            // ERROR MESSAGE
            // =================================================

            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                (error.response?.status === 401
                    ? "Invalid email or password."
                    : error.response?.status === 403
                    ? "You are not authorized to access this account."
                    : error.code ===
                      "ERR_NETWORK"
                    ? "Unable to connect to the server. Please check the backend URL and CORS configuration."
                    : error.message ||
                      "Unable to login. Please try again.");

            alert(message);
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">

                <div className="grid md:grid-cols-2">

                    {/* ================================================= */}
                    {/* LEFT SIDE */}
                    {/* ================================================= */}

                    <div className="hidden md:flex bg-linear-to-br from-sky-700 to-indigo-900 text-white p-10 flex-col justify-between">

                        <div>

                            {/* Logo */}

                            <div className="flex items-center gap-3 mb-10">

                                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center overflow-hidden shadow">

                                    <img
                                        src="/pcs_logo.jpg"
                                        alt="PCS Global logo"
                                        className="h-full w-full object-contain"
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

                            {/* Welcome */}

                            <h2 className="text-4xl font-bold leading-tight mb-5">
                                Welcome back!
                            </h2>

                            <p className="text-blue-100 leading-7">
                                Sign in to access your Skill Matrix
                                profile and manage your professional
                                information, skills and experience.
                            </p>

                        </div>

                        {/* Features */}

                        <div className="space-y-4 text-sm text-blue-100">

                            <div className="flex items-center gap-3">

                                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                                    ✓
                                </span>

                                Secure employee profile

                            </div>

                            <div className="flex items-center gap-3">

                                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                                    ✓
                                </span>

                                Manage skills and experience

                            </div>

                            <div className="flex items-center gap-3">

                                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                                    ✓
                                </span>

                                Professional skill tracking

                            </div>

                        </div>

                    </div>

                    {/* ================================================= */}
                    {/* RIGHT SIDE */}
                    {/* ================================================= */}

                    <div className="p-6 sm:p-10">

                        {/* ================================================= */}
                        {/* MOBILE LOGO */}
                        {/* ================================================= */}

                        <div className="md:hidden text-center mb-7">

                            <div className="inline-flex w-16 h-16 rounded-xl bg-white items-center justify-center overflow-hidden shadow mb-3">

                                <img
                                    src="/pcs_logo.jpg"
                                    alt="PCS Global logo"
                                    className="h-full w-full object-contain"
                                />

                            </div>

                            <h1 className="text-2xl font-bold text-slate-800">
                                Skill Matrix
                            </h1>

                            <p className="text-sm text-slate-500">
                                Employee Management System
                            </p>

                        </div>

                        {/* ================================================= */}
                        {/* HEADING */}
                        {/* ================================================= */}

                        <div className="mb-7">

                            <h2 className="text-3xl font-bold text-slate-800">
                                Welcome Back
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Sign in to continue to your account.
                            </p>

                        </div>

                        {/* ================================================= */}
                        {/* LOGIN FORM */}
                        {/* ================================================= */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* ================================================= */}
                            {/* EMAIL */}
                            {/* ================================================= */}

                            <div>

                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-slate-700 mb-1.5"
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
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50 disabled:cursor-not-allowed"
                                />

                            </div>

                            {/* ================================================= */}
                            {/* PASSWORD */}
                            {/* ================================================= */}

                            <div>

                                <div className="flex items-center justify-between mb-1.5">

                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-slate-700"
                                    >
                                        Password
                                    </label>

                                    <Link
                                        to="/forgot-password"
                                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                    >
                                        Forgot Password?
                                    </Link>

                                </div>

                                <div className="relative">

                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        required
                                        disabled={loading}
                                        className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50 disabled:cursor-not-allowed"
                                    />

                                    <button
                                        type="button"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        onClick={() =>
                                            setShowPassword(
                                                (prev) =>
                                                    !prev
                                            )
                                        }
                                        disabled={loading}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 disabled:opacity-50"
                                    >
                                        {showPassword ? (
                                            <EyeOff
                                                size={20}
                                            />
                                        ) : (
                                            <Eye
                                                size={20}
                                            />
                                        )}
                                    </button>

                                </div>

                            </div>

                            {/* ================================================= */}
                            {/* LOGIN BUTTON */}
                            {/* ================================================= */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full text-md py-3.5 rounded-xl bg-sky-700 text-white font-semibold hover:bg-sky-800 active:scale-[0.99] transition shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">

                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>

                                        Signing in...

                                    </span>
                                ) : (
                                    "Login"
                                )}
                            </button>

                        </form>

                        {/* ================================================= */}
                        {/* SOCIAL LOGIN */}
                        {/* ================================================= */}

                        <div className="flex items-center gap-3 my-6">

                            <div className="flex-1 h-px bg-slate-200"></div>

                            <span className="text-xs text-slate-400 whitespace-nowrap">
                                OR CONTINUE WITH
                            </span>

                            <div className="flex-1 h-px bg-slate-200"></div>

                        </div>

                        <div className="grid grid-cols-2 gap-3">

                            <SocialButton
                                icon="G"
                                name="Google"
                                onClick={() =>
                                    handleSocialLogin(
                                        "Google"
                                    )
                                }
                            />

                            <SocialButton
                                icon="in"
                                name="LinkedIn"
                                onClick={() =>
                                    handleSocialLogin(
                                        "LinkedIn"
                                    )
                                }
                            />

                        </div>

                        {/* ================================================= */}
                        {/* REGISTRATION */}
                        {/* ================================================= */}

                        <div className="text-center mt-7">

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

                        {/* ================================================= */}
                        {/* ADMIN LOGIN */}
                        {/* ================================================= */}

                        <div className="mt-6 pt-5 border-t border-slate-100 text-center">

                            <p className="text-sm text-slate-500 mb-2">
                                Are you an administrator?
                            </p>

                            <Link
                                to="/admin"
                                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-blue-200 text-blue-600 font-semibold hover:bg-blue-50 transition"
                            >
                                Admin Login
                            </Link>

                        </div>

                        {/* ================================================= */}
                        {/* HOME */}
                        {/* ================================================= */}

                        <div className="text-center mt-5">

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

// =====================================================
// SOCIAL BUTTON
// =====================================================

const SocialButton = ({
    icon,
    name,
    onClick,
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition"
        >
            <span className="font-bold">
                {icon}
            </span>

            <span className="text-sm">
                {name}
            </span>
        </button>
    );
};

export default Login;