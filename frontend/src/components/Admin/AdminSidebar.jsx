// src/components/admin/AdminSidebar.jsx

import {
    NavLink,
    useNavigate,
} from "react-router-dom";

import {
    useAdmin,
} from "../../context/AdminContext";

import {
    ADMIN_PERMISSIONS,
} from "../../data/adminData";

const AdminSidebar = () => {

    const navigate = useNavigate();

    const {
        currentAdmin,
        logoutAdmin,
        hasPermission,
    } = useAdmin();

    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {

        logoutAdmin();

        navigate("/admin/login", {
            replace: true,
        });
    };

    // =========================================================
    // PERMISSION CHECK
    // =========================================================

    const canView = (permission) => {
        return (
            currentAdmin?.isDefault ||
            hasPermission(permission)
        );
    };

    // =========================================================
    // NAVIGATION STYLE
    // =========================================================

    const navLinkClass = ({ isActive }) => `
        group
        flex
        w-full
        items-center
        gap-3
        rounded-xl
        px-3
        py-3
        text-sm
        font-medium
        transition-all
        duration-200

        ${
            isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }
    `;

    // =========================================================
    // ICON STYLE
    // =========================================================

    const iconClass = ({ isActive }) => `
        flex
        h-9
        w-9
        shrink-0
        items-center
        justify-center
        rounded-lg
        transition-all
        duration-200

        ${
            isActive
                ? "bg-white/15 text-white"
                : "bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white"
        }
    `;

    return (
        <aside
            className="
                flex
                h-full
                min-h-0
                w-full
                flex-col
                bg-slate-950
                text-white
            "
        >

            {/* =====================================================
                BRAND
            ===================================================== */}

            <div
                className="
                    flex
                    h-20
                    shrink-0
                    items-center
                    gap-3
                    border-b
                    border-slate-800
                    px-5
                "
            >

                <div
                    className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-600
                        text-sm
                        font-bold
                        tracking-wide
                        text-white
                        shadow-lg
                    "
                >
                    SM
                </div>

                <div className="min-w-0">

                    <h2
                        className="
                            truncate
                            text-base
                            font-bold
                            tracking-wide
                            text-white
                        "
                    >
                        SkillMatrix
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-400">
                        Admin Portal
                    </p>

                </div>

            </div>

            {/* =====================================================
                ADMIN INFORMATION
            ===================================================== */}

            <div
                className="
                    shrink-0
                    border-b
                    border-slate-800
                    px-4
                    py-4
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        bg-slate-900
                        px-3
                        py-3
                    "
                >

                    <div
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-600
                            text-xs
                            font-bold
                            uppercase
                            text-white
                        "
                    >
                        {currentAdmin?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "A"}
                    </div>

                    <div className="min-w-0">

                        <p className="truncate text-sm font-semibold text-white">
                            {currentAdmin?.name || "Administrator"}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                            {currentAdmin?.isDefault
                                ? "System Administrator"
                                : "Administrator"}
                        </p>

                    </div>

                </div>

            </div>

            {/* =====================================================
                NAVIGATION
            ===================================================== */}

            <nav
                className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    px-3
                    py-6
                "
            >

                <div className="mb-3 px-3">

                    <p
                        className="
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.18em]
                            text-slate-500
                        "
                    >
                        Administration
                    </p>

                </div>

                <div className="space-y-1">

                    {/* =================================================
                        DASHBOARD
                    ================================================= */}

                    {canView(
                        ADMIN_PERMISSIONS.DASHBOARD
                    ) && (

                        <NavLink
                            to="/admin/dashboard"
                            className={navLinkClass}
                        >

                            {({ isActive }) => (
                                <>

                                    <span
                                        className={iconClass({
                                            isActive,
                                        })}
                                    >

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="block h-5 w-5"
                                        >

                                            <path d="M3 12l9-9 9 9" />

                                            <path d="M5 10v10h14V10" />

                                            <path d="M9 20v-6h6v6" />

                                        </svg>

                                    </span>

                                    <span className="truncate">
                                        Dashboard
                                    </span>

                                </>
                            )}

                        </NavLink>
                    )}

                    {/* =================================================
                        EMPLOYEES
                    ================================================= */}

                    {canView(
                        ADMIN_PERMISSIONS.EMPLOYEES
                    ) && (

                        <NavLink
                            to="/admin/employees"
                            className={navLinkClass}
                        >

                            {({ isActive }) => (
                                <>

                                    <span
                                        className={iconClass({
                                            isActive,
                                        })}
                                    >

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="block h-5 w-5"
                                        >

                                            <circle
                                                cx="9"
                                                cy="7"
                                                r="4"
                                            />

                                            <path d="M3 21a6 6 0 0112 0" />

                                            <path d="M16 4a4 4 0 010 6" />

                                            <path d="M17 13a6 6 0 014 8" />

                                        </svg>

                                    </span>

                                    <span className="truncate">
                                        Employees
                                    </span>

                                </>
                            )}

                        </NavLink>
                    )}

                    {/* =================================================
                        ALL PROJECTS
                    ================================================= */}

                    {canView(
                        ADMIN_PERMISSIONS.PROJECTS
                    ) && (

                        <NavLink
                            to="/admin/allprojects"
                            className={navLinkClass}
                        >

                            {({ isActive }) => (
                                <>

                                    <span
                                        className={iconClass({
                                            isActive,
                                        })}
                                    >

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="block h-5 w-5"
                                        >

                                            <path
                                                d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                                            />

                                        </svg>

                                    </span>

                                    <span className="truncate">
                                        All Projects
                                    </span>

                                </>
                            )}

                        </NavLink>
                    )}

                    {/* =================================================
                        ASSIGNED PROJECTS
                    ================================================= */}

                    {canView(
                        ADMIN_PERMISSIONS.PROJECTS
                    ) && (

                        <NavLink
                            to="/admin/assignedproject"
                            className={navLinkClass}
                        >

                            {({ isActive }) => (
                                <>

                                    <span
                                        className={iconClass({
                                            isActive,
                                        })}
                                    >

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="block h-5 w-5"
                                        >

                                            <path d="M4 6h16" />

                                            <path d="M4 12h16" />

                                            <path d="M4 18h10" />

                                            <path d="M17 17l2 2 4-4" />

                                        </svg>

                                    </span>

                                    <span className="truncate">
                                        Assigned Projects
                                    </span>

                                </>
                            )}

                        </NavLink>
                    )}

                </div>

            </nav>

            {/* =====================================================
                LOGOUT
            ===================================================== */}

            <div
                className="
                    shrink-0
                    border-t
                    border-slate-800
                    p-3
                "
            >

                <button
                    type="button"
                    onClick={handleLogout}
                    className="
                        group
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-3
                        text-sm
                        font-medium
                        text-slate-400
                        transition-all
                        duration-200
                        hover:bg-red-500/10
                        hover:text-red-400
                    "
                >

                    <span
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-slate-800
                            text-slate-400
                            transition
                            group-hover:bg-red-500/10
                            group-hover:text-red-400
                        "
                    >

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="block h-5 w-5"
                        >

                            <path d="M10 17l5-5-5-5" />

                            <path d="M15 12H3" />

                            <path d="M21 3v18" />

                        </svg>

                    </span>

                    <span>
                        Logout
                    </span>

                </button>

            </div>

        </aside>
    );
};

export default AdminSidebar;