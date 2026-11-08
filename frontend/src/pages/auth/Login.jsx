
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "../../service/authService";

const Login = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSocialLogin = (provider) => {
        alert(`${provider} login is not connected yet.`);
    };

    const clearEmployeeSession = () => {
        const keys = [
            "employeeToken",
            "employeeUser",
            "employeeUserId",
            "employeeUserEmail",
            "employeeUserRole",
            "employeeAuthenticated",
            "employeeId",
        ];

        keys.forEach((key) =>
            sessionStorage.removeItem(key)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        const email = formData.email.trim().toLowerCase();
        const password = formData.password;

        if (!email || !password) {
            alert("Email and password are required.");
            return;
        }

        setLoading(true);

        try {
            console.log("Employee login request started.");

            // authService returns response.data directly.
            const data = await loginUser({
                email,
                password,
            });

            console.log("LOGIN RESPONSE:", {
                success: data?.success,
                message: data?.message,
                role: data?.user?.role,
                hasToken: Boolean(data?.token),
                hasEmployee: Boolean(data?.employee),
            });

            if (!data || data.success !== true) {
                alert(
                    data?.message ||
                    "Login failed. Please check your email and password."
                );
                return;
            }

            const token =
                data.token ||
                data.accessToken ||
                data.access_token;

            const user =
                data.user ||
                data.userData ||
                data.employee?.user ||
                {};

            if (!token) {
                console.error("Login response did not contain a token.");
                alert("Login succeeded, but the authentication token was not returned.");
                return;
            }

            const userRole = String(
                user.role || data.role || data.userRole || ""
            ).trim().toLowerCase();

            if (userRole === "admin") {
                clearEmployeeSession();

                alert(
                    "This is the Employee Login page. Please use Admin Login."
                );
                return;
            }

            if (userRole !== "employee") {
                console.error("Unexpected account role:", userRole);
                alert("This account does not have employee access.");
                return;
            }

            const employee = data.employee || data.employeeData || {};

            const userId =
                user.id ||
                user._id ||
                data.userId ||
                data.user_id ||
                "";

            const userEmail = user.email || email;

            const employeeId =
                employee.employeeId ||
                employee.empId ||
                employee.employeeID ||
                data.employeeId ||
                data.empId ||
                "";

            // Clear only old employee session.
            clearEmployeeSession();

            // Save employee session.
            sessionStorage.setItem("employeeToken", token);
            sessionStorage.setItem(
                "employeeUser",
                JSON.stringify(user)
            );
            sessionStorage.setItem("employeeUserId", String(userId));
            sessionStorage.setItem("employeeUserEmail", userEmail);
            sessionStorage.setItem("employeeUserRole", "employee");
            sessionStorage.setItem("employeeAuthenticated", "true");

            if (employeeId) {
                sessionStorage.setItem(
                    "employeeId",
                    String(employeeId)
                );
            }

            // Remove old generic employee authentication data.
            [
                "token",
                "authToken",
                "accessToken",
                "user",
                "userId",
                "userEmail",
                "userRole",
                "employeeId",
                "isAuthenticated",
            ].forEach((key) => localStorage.removeItem(key));

            console.log("Employee login successful.");

            navigate("/employee/dashboard", {
                replace: true,
            });

        } catch (error) {
            console.error("EMPLOYEE LOGIN ERROR:", error.message);

            alert(
                error.message ||
                "Unable to login. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">

                <div className="grid md:grid-cols-2">

                    {/* LEFT SIDE */}
                    <div className="hidden md:flex bg-linear-to-br from-sky-700 to-indigo-900 text-white p-10 flex-col justify-between">

                        <div>
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

                            <h2 className="text-4xl font-bold leading-tight mb-5">
                                Welcome back!
                            </h2>

                            <p className="text-blue-100 leading-7">
                                Sign in to access your Skill Matrix profile
                                and manage your professional information,
                                skills and experience.
                            </p>
                        </div>

                        <div className="space-y-4 text-sm text-blue-100">
                            {[
                                "Secure employee profile",
                                "Manage skills and experience",
                                "Professional skill tracking",
                            ].map((feature) => (
                                <div
                                    key={feature}
                                    className="flex items-center gap-3"
                                >
                                    <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                                        ✓
                                    </span>
                                    {feature}
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* RIGHT SIDE */}
                    <div className="p-6 sm:p-10">

                        {/* MOBILE LOGO */}
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

                        {/* HEADING */}
                        <div className="mb-7">
                            <h2 className="text-3xl font-bold text-slate-800">
                                Welcome Back
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Sign in to continue to your account.
                            </p>
                        </div>

                        {/* LOGIN FORM */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* EMAIL */}
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
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50"
                                />
                            </div>

                            {/* PASSWORD */}
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
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        required
                                        disabled={loading}
                                        className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50"
                                    />

                                    <button
                                        type="button"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                        disabled={loading}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>

                                </div>
                            </div>

                            {/* LOGIN BUTTON */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full text-md py-3.5 rounded-xl bg-sky-700 text-white font-semibold hover:bg-sky-800 active:scale-[0.99] transition shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Signing in...
                                    </span>
                                ) : (
                                    "Login"
                                )}
                            </button>

                        </form>

                        {/* SOCIAL LOGIN */}
                        <div className="flex items-center gap-3 my-6">
                            <div className="flex-1 h-px bg-slate-200" />
                            <span className="text-xs text-slate-400 whitespace-nowrap">
                                OR CONTINUE WITH
                            </span>
                            <div className="flex-1 h-px bg-slate-200" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <SocialButton
                                icon="G"
                                name="Google"
                                onClick={() => handleSocialLogin("Google")}
                            />

                            <SocialButton
                                icon="in"
                                name="LinkedIn"
                                onClick={() => handleSocialLogin("LinkedIn")}
                            />
                        </div>

                        {/* REGISTRATION */}
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

                        {/* ADMIN LOGIN */}
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

                        {/* HOME */}
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

const SocialButton = ({ icon, name, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition"
    >
        <span className="font-bold">{icon}</span>
        <span className="text-sm">{name}</span>
    </button>
);

export default Login;
