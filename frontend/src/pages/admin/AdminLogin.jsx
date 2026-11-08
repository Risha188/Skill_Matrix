
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAdmin } from "../../context/AdminContext.jsx";

const AdminLogin = () => {
    const navigate = useNavigate();

    const {
        loginAdmin,
        loading: adminLoading,
        currentAdmin,
    } = useAdmin();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Redirect an already authenticated administrator.
    if (currentAdmin && !adminLoading) {
        navigate("/admin/dashboard", { replace: true });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (submitting || adminLoading) return;

        const email = formData.email.trim().toLowerCase();
        const password = formData.password;

        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            // Use AdminContext, NOT the employee login API.
            const result = loginAdmin({
                email,
                password,
            });

            if (!result?.success) {
                setError(
                    result?.message ||
                    "Invalid administrator email or password."
                );
                return;
            }

            // AdminContext already saves currentAdmin in localStorage.
            // Do not overwrite it with a separate session object.
            navigate("/admin/dashboard", {
                replace: true,
            });
        } catch (err) {
            console.error("Administrator login error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const isLoading = submitting || adminLoading;

    return (
        <div className="
            min-h-screen
            bg-gradient-to-br
            from-slate-100
            via-white
            to-blue-50
            flex
            items-center
            justify-center
            px-4
            py-8
        ">
            <div className="
                w-full
                max-w-5xl
                overflow-hidden
                rounded-3xl
                bg-white
                shadow-2xl
                border
                border-slate-100
            ">
                <div className="grid md:grid-cols-2">

                    {/* LEFT SIDE */}
                    <div className="
                        hidden
                        md:flex
                        flex-col
                        justify-between
                        bg-sky-700
                        p-10
                        text-white
                    ">
                        <div>
                            <div className="mb-10 flex items-center gap-3">
                                <img
                                    src="/pcs_logo.jpg"
                                    alt="PCS Global"
                                    className="h-20 w-20 rounded-full object-contain"
                                />

                                <div>
                                    <h1 className="text-xl font-bold">
                                        SkillMatrix
                                    </h1>
                                    <p className="text-sm text-slate-200">
                                        Administration Portal
                                    </p>
                                </div>
                            </div>

                            <h2 className="
                                text-4xl
                                font-bold
                                leading-tight
                            ">
                                Welcome to the Administration Portal
                            </h2>

                            <p className="mt-5 leading-7 text-slate-200">
                                Manage employees, projects, assignments
                                and other SkillMatrix administration
                                features from one secure dashboard.
                            </p>
                        </div>

                        <div className="space-y-4 text-sm text-slate-200">
                            <div>✓ Employee Management</div>
                            <div>✓ Project Management</div>
                            <div>✓ Team Assignment</div>
                            <div>✓ Administrator Access</div>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="p-6 sm:p-10">

                        {/* MOBILE LOGO */}
                        <div className="mb-8 text-center md:hidden">
                            <img
                                src="/pcs_logo.jpg"
                                alt="PCS Global"
                                className="
                                    mx-auto
                                    h-14
                                    w-14
                                    rounded-full
                                    bg-white
                                    object-contain
                                    shadow
                                "
                            />

                            <h1 className="
                                mt-2
                                text-2xl
                                font-bold
                                text-slate-900
                            ">
                                SkillMatrix
                            </h1>
                        </div>

                        {/* HEADER */}
                        <div className="mb-7">
                            <span className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                bg-blue-50
                                px-3
                                py-1.5
                                text-xs
                                font-semibold
                                text-blue-600
                            ">
                                <span className="
                                    h-2
                                    w-2
                                    rounded-full
                                    bg-blue-500
                                " />
                                ADMINISTRATOR
                            </span>

                            <h2 className="
                                mt-4
                                text-3xl
                                font-bold
                                text-sky-800
                            ">
                                Admin Login
                            </h2>

                            <p className="mt-2 text-sm text-slate-600">
                                Sign in to access the SkillMatrix
                                administration portal.
                            </p>
                        </div>

                        {/* ERROR MESSAGE */}
                        {error && (
                            <div className="
                                mb-5
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                            ">
                                <p className="text-sm font-medium text-red-700">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* LOGIN FORM */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >
                            {/* EMAIL */}
                            <div>
                                <label
                                    htmlFor="admin-email"
                                    className="
                                        mb-1.5
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                    "
                                >
                                    Admin Email
                                </label>

                                <input
                                    id="admin-email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter admin email"
                                    autoComplete="username"
                                    disabled={isLoading}
                                    required
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-200
                                        px-4
                                        py-3
                                        text-slate-900
                                        outline-none
                                        transition
                                        focus:border-blue-500
                                        focus:ring-4
                                        focus:ring-blue-100
                                        disabled:bg-slate-100
                                    "
                                />
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <label
                                    htmlFor="admin-password"
                                    className="
                                        mb-1.5
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                    "
                                >
                                    Password
                                </label>

                                <div className="relative">
                                    <input
                                        id="admin-password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter admin password"
                                        autoComplete="current-password"
                                        disabled={isLoading}
                                        required
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-slate-200
                                            px-4
                                            py-3
                                            pr-12
                                            text-slate-900
                                            outline-none
                                            transition
                                            focus:border-blue-500
                                            focus:ring-4
                                            focus:ring-blue-100
                                            disabled:bg-slate-100
                                        "
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                        className="
                                            absolute
                                            right-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-slate-500
                                            hover:text-blue-600
                                        "
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

                            {/* LOGIN BUTTON */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="
                                    w-full
                                    rounded-xl
                                    bg-sky-700
                                    px-4
                                    py-3.5
                                    text-md
                                    font-semibold
                                    text-white
                                    shadow-lg
                                    transition
                                    hover:bg-sky-800
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >
                                {isLoading
                                    ? "Signing in..."
                                    : "Admin Login"
                                }
                            </button>
                        </form>

                        {/* SECURITY MESSAGE */}
                        <div className="
                            mt-6
                            rounded-xl
                            border
                            border-blue-100
                            bg-blue-50
                            p-4
                        ">
                            <p className="
                                text-sm
                                font-semibold
                                text-blue-800
                            ">
                                🔒 Secure Administrator Access
                            </p>

                            <p className="
                                mt-1
                                text-xs
                                leading-5
                                text-blue-600
                            ">
                                Only authorized administrator accounts
                                can access this portal.
                            </p>
                        </div>

                        {/* EMPLOYEE LOGIN */}
                        <div className="mt-7 text-center">
                            <p className="text-sm text-slate-500">
                                Are you an employee?{" "}
                                <Link
                                    to="/login"
                                    className="
                                        font-semibold
                                        text-blue-600
                                        hover:text-blue-700
                                    "
                                >
                                    Employee Login
                                </Link>
                            </p>
                        </div>

                        {/* HOME */}
                        <div className="mt-4 text-center">
                            <Link
                                to="/"
                                className="
                                    text-sm
                                    text-slate-500
                                    hover:text-blue-600
                                "
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

export default AdminLogin;
