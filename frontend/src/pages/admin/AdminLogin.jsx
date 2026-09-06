import { useState } from "react";
import {
    Link,
    useNavigate,
} from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "../../service/authService";
import { useAdmin } from "../../context/AdminContext.jsx";


const AdminLogin = () => {

    const navigate = useNavigate();

    const {
        // We only need logout/login state from context.
        // DO NOT use setCurrentAdmin here.
    } = useAdmin();


    // =========================================================
    // STATE
    // =========================================================

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // =========================================================
    // INPUT CHANGE
    // =========================================================

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
    };


    // =========================================================
    // ADMIN LOGIN
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (loading) {
            return;
        }

        setError("");


        // =====================================================
        // GET LOGIN DATA
        // =====================================================

        const email =
            formData.email
                .trim()
                .toLowerCase();

        const password =
            formData.password;


        // =====================================================
        // VALIDATION
        // =====================================================

        if (!email) {

            setError(
                "Please enter your admin email."
            );

            return;
        }


        if (!password) {

            setError(
                "Please enter your admin password."
            );

            return;
        }


        setLoading(true);


        try {

            console.log(
                "================================="
            );

            console.log(
                "ADMIN LOGIN REQUEST"
            );

            console.log(
                "Email:",
                email
            );

            console.log(
                "================================="
            );


            // =================================================
            // BACKEND LOGIN
            // =================================================

            const response =
                await loginUser({
                    email,
                    password,
                });


            console.log(
                "Admin login response:",
                response?.data
            );


            const data =
                response?.data;


            // =================================================
            // RESPONSE CHECK
            // =================================================

            if (!data) {

                setError(
                    "No response was received from the server."
                );

                return;
            }


            // =================================================
            // LOGIN FAILED
            // =================================================

            if (!data.success) {

                setError(
                    data.message ||
                    "Invalid admin email or password."
                );

                return;
            }


            // =================================================
            // TOKEN CHECK
            // =================================================

            if (!data.token) {

                console.error(
                    "Admin login succeeded but token is missing."
                );

                setError(
                    "Login failed because the server did not return an authentication token."
                );

                return;
            }


            // =================================================
            // USER CHECK
            // =================================================

            if (!data.user) {

                setError(
                    "Login failed because administrator information was not returned."
                );

                return;
            }


            // =================================================
            // ROLE CHECK
            // =================================================

            const userRole =
                String(
                    data.user.role || ""
                )
                    .trim()
                    .toLowerCase();


            console.log(
                "Logged in role:",
                userRole
            );


            // =================================================
            // BLOCK EMPLOYEE FROM ADMIN PANEL
            // =================================================

            if (
                userRole !== "admin"
            ) {

                console.error(
                    "Employee attempted admin login:",
                    data.user
                );


                // IMPORTANT:
                // Only clear ADMIN session.
                // DO NOT touch employee session.

                sessionStorage.removeItem(
                    "adminToken"
                );

                sessionStorage.removeItem(
                    "adminUser"
                );

                sessionStorage.removeItem(
                    "adminUserId"
                );

                sessionStorage.removeItem(
                    "adminUserEmail"
                );

                sessionStorage.removeItem(
                    "adminUserRole"
                );

                sessionStorage.removeItem(
                    "adminAuthenticated"
                );


                setError(
                    "This account does not have administrator access."
                );

                return;
            }


            // =================================================
            // CREATE ADMIN OBJECT
            // =================================================

            const adminId =
                data.user.id ||
                data.user._id;


            const adminEmail =
                data.user.email ||
                email;


            const adminName =
                data.user.fullName ||
                data.user.name ||
                "Administrator";


            const adminUser = {

                id: adminId,

                _id:
                    data.user._id ||
                    data.user.id,

                name:
                    adminName,

                fullName:
                    adminName,

                email:
                    adminEmail,

                role: "admin",

                isDefault:
                    false,

                isActive: true,

                isApproved: true,

                permissions: [
                    "dashboard",
                    "employees",
                    "projects",
                ],
            };


            // =================================================
            // SAVE ADMIN JWT
            // =================================================

            // IMPORTANT:
            //
            // Admin uses:
            // sessionStorage -> adminToken
            //
            // Employee uses:
            // sessionStorage -> employeeToken
            //
            // NEVER use:
            // localStorage.token
            // localStorage.user
            // localStorage.userId
            //
            // This keeps both sessions independent.

            sessionStorage.setItem(
                "adminToken",
                data.token
            );


            // =================================================
            // SAVE ADMIN USER
            // =================================================

            sessionStorage.setItem(
                "adminUser",
                JSON.stringify(
                    adminUser
                )
            );


            sessionStorage.setItem(
                "adminUserId",
                String(adminId)
            );


            sessionStorage.setItem(
                "adminUserEmail",
                adminEmail
            );


            sessionStorage.setItem(
                "adminUserRole",
                "admin"
            );


            sessionStorage.setItem(
                "adminAuthenticated",
                "true"
            );


            // =================================================
            // SAVE CURRENT ADMIN FOR ADMIN CONTEXT
            // =================================================

            sessionStorage.setItem(
                "skillmatrix_current_admin",
                JSON.stringify(
                    adminUser
                )
            );


            // =================================================
            // CLEAN OLD ADMIN STORAGE
            // =================================================

            // Remove old admin values if they exist.
            // These are NOT used for employee authentication.

            localStorage.removeItem(
                "skillmatrix_current_admin"
            );

            localStorage.removeItem(
                "adminToken"
            );

            localStorage.removeItem(
                "adminUser"
            );

            localStorage.removeItem(
                "adminUserId"
            );

            localStorage.removeItem(
                "adminUserEmail"
            );

            localStorage.removeItem(
                "adminUserRole"
            );

            localStorage.removeItem(
                "adminAuthenticated"
            );


            // =================================================
            // SUCCESS
            // =================================================

            console.log(
                "================================="
            );

            console.log(
                "ADMIN LOGIN SUCCESS"
            );

            console.log(
                "Admin Email:",
                adminEmail
            );

            console.log(
                "Admin Role:",
                userRole
            );

            console.log(
                "Admin JWT saved in sessionStorage"
            );

            console.log(
                "================================="
            );


            // =================================================
            // REDIRECT TO ADMIN DASHBOARD
            // =================================================

            navigate(
                "/admin/dashboard",
                {
                    replace: true,
                }
            );


        } catch (error) {

            console.error(
                "================================="
            );

            console.error(
                "ADMIN LOGIN ERROR"
            );

            console.error(
                "Status:",
                error?.response?.status
            );

            console.error(
                "Response:",
                error?.response?.data
            );

            console.error(
                "Error:",
                error
            );

            console.error(
                "================================="
            );


            // =================================================
            // ERROR MESSAGE
            // =================================================

            if (
                error?.response?.status === 401
            ) {

                setError(
                    error?.response?.data?.message ||
                    "Invalid admin email or password."
                );

            } else if (
                error?.response?.status === 403
            ) {

                setError(
                    error?.response?.data?.message ||
                    "Administrator access is not allowed."
                );

            } else if (
                error?.response?.status === 400
            ) {

                setError(
                    error?.response?.data?.message ||
                    "Please check your login details."
                );

            } else if (
                error?.response?.status >= 500
            ) {

                setError(
                    error?.response?.data?.message ||
                    "Server error. Please try again later."
                );

            } else {

                setError(
                    error?.response?.data?.message ||
                    "Unable to connect to the server."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div
            className="
                min-h-screen
                bg-linear-to-br
                from-slate-100
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
                    overflow-hidden
                    rounded-3xl
                    bg-white
                    shadow-2xl
                    border
                    border-slate-100
                "
            >

                <div
                    className="
                        grid
                        md:grid-cols-2
                    "
                >

                    {/* =================================================
                        LEFT SIDE
                    ================================================= */}

                    <div
                        className="
                            hidden
                            md:flex
                            flex-col
                            justify-between
                            bg-sky-700
                            p-10
                            text-white
                        "
                    >

                        <div>

                            <div
                                className="
                                    mb-10
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <img
                                    src="/pcs_logo.jpg"
                                    alt="PCS Global"
                                    className="
                                        h-20
                                        w-20
                                        rounded-full
                                        object-contain
                                    "
                                />

                                <div>

                                    <h1
                                        className="
                                            text-xl
                                            font-bold
                                        "
                                    >
                                        SkillMatrix
                                    </h1>

                                    <p
                                        className="
                                            text-sm
                                            text-slate-200
                                        "
                                    >
                                        Administration Portal
                                    </p>

                                </div>

                            </div>


                            <h2
                                className="
                                    text-4xl
                                    font-bold
                                    leading-tight
                                "
                            >
                                Welcome to the
                                Administration Portal
                            </h2>


                            <p
                                className="
                                    mt-5
                                    leading-7
                                    text-slate-200
                                "
                            >
                                Manage employees, projects,
                                assignments and other
                                SkillMatrix administration
                                features from one secure
                                dashboard.
                            </p>

                        </div>


                        <div
                            className="
                                space-y-4
                                text-sm
                                text-slate-200
                            "
                        >

                            <div>
                                ✓ Employee Management
                            </div>

                            <div>
                                ✓ Project Management
                            </div>

                            <div>
                                ✓ Team Assignment
                            </div>

                            <div>
                                ✓ Secure Administrator Access
                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        RIGHT SIDE
                    ================================================= */}

                    <div
                        className="
                            p-6
                            sm:p-10
                        "
                    >

                        {/* MOBILE LOGO */}

                        <div
                            className="
                                mb-8
                                text-center
                                md:hidden
                            "
                        >

                            <img
                                src="/pcs_logo.png"
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


                            <h1
                                className="
                                    mt-2
                                    text-2xl
                                    font-bold
                                    text-slate-900
                                "
                            >
                                SkillMatrix
                            </h1>

                        </div>


                        {/* =================================================
                            HEADER
                        ================================================= */}

                        <div
                            className="mb-7"
                        >

                            <span
                                className="
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
                                "
                            >

                                <span
                                    className="
                                        h-2
                                        w-2
                                        rounded-full
                                        bg-blue-500
                                    "
                                />

                                ADMINISTRATOR

                            </span>


                            <h2
                                className="
                                    mt-4
                                    text-3xl
                                    font-bold
                                    text-sky-800
                                "
                            >
                                Admin Login
                            </h2>


                            <p
                                className="
                                    mt-2
                                    text-sm
                                    text-slate-600
                                "
                            >
                                Sign in to access the
                                SkillMatrix administration
                                portal.
                            </p>

                        </div>


                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {error && (

                            <div
                                className="
                                    mb-5
                                    rounded-xl
                                    border
                                    border-red-200
                                    bg-red-50
                                    px-4
                                    py-3
                                "
                            >

                                <p
                                    className="
                                        text-sm
                                        font-medium
                                        text-red-700
                                    "
                                >
                                    {error}
                                </p>

                            </div>

                        )}


                        {/* =================================================
                            FORM
                        ================================================= */}

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
                                    disabled={loading}
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


                                <div
                                    className="
                                        relative
                                    "
                                >

                                    <input
                                        id="admin-password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter admin password"
                                        autoComplete="current-password"
                                        disabled={loading}
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
                                            setShowPassword(
                                                (prev) =>
                                                    !prev
                                            )
                                        }
                                        className="
                                            absolute
                                            right-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-lg
                                            text-slate-500
                                            hover:text-blue-600
                                        "
                                        tabIndex={-1}
                                    >
                                        {showPassword
                                            ? <EyeOff size={20} />
                                            : <Eye size={20} />}
                                    </button>

                                </div>

                            </div>


                            {/* LOGIN BUTTON */}

                            <button
                                type="submit"
                                disabled={loading}
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

                                {loading
                                    ? "Signing in..."
                                    : "Admin Login"}

                            </button>

                        </form>


                        {/* =================================================
                            SECURITY MESSAGE
                        ================================================= */}

                        <div
                            className="
                                mt-6
                                rounded-xl
                                border
                                border-blue-100
                                bg-blue-50
                                p-4
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-blue-800
                                "
                            >
                                🔒 Secure Administrator Access
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-xs
                                    leading-5
                                    text-blue-600
                                "
                            >
                                Only authorized administrator
                                accounts can access this portal.
                            </p>

                        </div>


                        {/* =================================================
                            EMPLOYEE LOGIN
                        ================================================= */}

                        <div
                            className="
                                mt-7
                                text-center
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    text-slate-500
                                "
                            >
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


                        {/* =================================================
                            HOME
                        ================================================= */}

                        <div
                            className="
                                mt-4
                                text-center
                            "
                        >

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