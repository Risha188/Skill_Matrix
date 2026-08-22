import {
    NavLink,
    Outlet,
    useLocation,
    useNavigate,
} from "react-router-dom";

import { useAdmin } from "../context/AdminContext.jsx";

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        currentAdmin,
        logoutAdmin,
    } = useAdmin();

    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {
        logoutAdmin();

        navigate("/admin/dashboard", {
            replace: true,
        });
    };

    // =========================================================
    // NAVIGATION
    // =========================================================

    const navItems = [
        {
            name: "Dashboard",
            path: "/admin/dashboard",
        },
        {
            name: "Employees",
            path: "/admin/employees",
        },
        {
            name: "All Projects",
            path: "/admin/allprojects",
        },
        {
            name: "Assigned Projects",
            path: "/admin/assignedproject",
        },
    ];

    // =========================================================
    // PROJECT PAGE CHECK
    // =========================================================

    const isProjectPage =
        location.pathname.includes(
            "/admin/projectdetails"
        ) ||
        location.pathname.includes(
            "/admin/reassignproject"
        );

    return (
        <div className="min-h-screen bg-slate-100">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-slate-900 text-white shadow-2xl">

                {/* =================================================
                    BRAND
                ================================================= */}

                <div className="flex h-20 shrink-0 items-center border-b border-slate-700 px-6">

                    <div>
                        <h1 className="text-xl font-bold text-white">
                            Admin Panel
                        </h1>

                        <p className="mt-1 text-xs text-slate-400">
                            SkillMatrix
                        </p>
                    </div>

                </div>

                {/* =================================================
                    NAVIGATION
                ================================================= */}

                <nav className="flex-1 overflow-y-auto px-3 py-6">

                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Main Menu
                    </p>

                    <div className="space-y-1">

                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `block rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                                        isActive
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                    }`
                                }
                            >
                                {item.name}
                            </NavLink>
                        ))}

                    </div>

                    {/* =================================================
                        PROJECT NAVIGATION
                    ================================================= */}

                    {isProjectPage && (
                        <div className="mt-8">

                            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Project
                            </p>

                            <div className="space-y-1">

                                <NavLink
                                    to="/admin/allprojects"
                                    className={({ isActive }) =>
                                        `block rounded-xl px-4 py-3 text-sm font-medium transition ${
                                            isActive
                                                ? "bg-blue-600 text-white"
                                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                        }`
                                    }
                                >
                                    All Projects
                                </NavLink>

                                <NavLink
                                    to="/admin/assignedproject"
                                    className={({ isActive }) =>
                                        `block rounded-xl px-4 py-3 text-sm font-medium transition ${
                                            isActive
                                                ? "bg-blue-600 text-white"
                                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                        }`
                                    }
                                >
                                    Assigned Projects
                                </NavLink>

                            </div>

                        </div>
                    )}

                </nav>

                {/* =================================================
                    ADMIN INFORMATION
                ================================================= */}

                <div className="shrink-0 border-t border-slate-700 p-4">

                    <div className="mb-3 rounded-xl bg-slate-800 p-3">

                        <p className="truncate text-sm font-semibold text-white">
                            {currentAdmin?.name ||
                                "Administrator"}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-400">
                            {currentAdmin?.isDefault
                                ? "System Administrator"
                                : "Administrator"}
                        </p>

                    </div>

                    {/* =================================================
                        LOGOUT
                    ================================================= */}

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500 hover:text-white"
                    >
                        Logout
                    </button>

                </div> 

            </aside>

            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <div className="ml-64 min-h-screen">

                {/* =================================================
                    PAGE CONTENT
                ================================================= */}

                <main className="min-h-[calc(100vh-5rem)] p-6 md:p-8">
                    <Outlet />
                </main>

            </div>

        </div>
    );
};

export default AdminLayout;