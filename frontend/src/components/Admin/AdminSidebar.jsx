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

    const handleLogout = () => {
        logoutAdmin();

        navigate(
            "/admin/login",
            { replace: true }
        );
    };

    const linkClass = ({
        isActive,
    }) =>
        `flex items-center rounded-lg px-4 py-3 text-sm font-medium transition ${
            isActive
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
        }`;

    const canView = (
        permission
    ) => {
        return (
            currentAdmin?.isDefault ||
            hasPermission(permission)
        );
    };

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white shadow-sm">
            {/* LOGO */}

            <div className="border-b px-6 py-5">
                <h1 className="text-xl font-bold text-blue-600">
                    SkillMatrix
                </h1>

                <p className="mt-1 text-xs text-gray-500">
                    Admin Panel
                </p>
            </div>

            {/* ADMIN INFO */}

            <div className="border-b px-5 py-4">
                <p className="text-sm font-semibold text-gray-900">
                    {currentAdmin?.name}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                    {currentAdmin?.isDefault
                        ? "System Administrator"
                        : "Administrator"}
                </p>
            </div>

            {/* NAVIGATION */}

            <nav className="space-y-1 p-4">
                {canView(
                    ADMIN_PERMISSIONS.DASHBOARD
                ) && (
                    <NavLink
                        to="/admin/dashboard"
                        className={
                            linkClass
                        }
                    >
                        Dashboard
                    </NavLink>
                )}

                {canView(
                    ADMIN_PERMISSIONS.EMPLOYEES
                ) && (
                    <NavLink
                        to="/admin/employees"
                        className={
                            linkClass
                        }
                    >
                        Employees
                    </NavLink>
                )}

                {canView(
                    ADMIN_PERMISSIONS.PROJECTS
                ) && (
                    <>
                        <NavLink
                            to="/admin/allprojects"
                            className={
                                linkClass
                            }
                        >
                            All Projects
                        </NavLink>

                        <NavLink
                            to="/admin/assignedproject"
                            className={
                                linkClass
                            }
                        >
                            Assigned Projects
                        </NavLink>
                    </>
                )}
            </nav>

            {/* LOGOUT */}

            <div className="absolute bottom-0 left-0 right-0 border-t p-4">
                <button
                    onClick={
                        handleLogout
                    }
                    className="w-full rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100"
                >
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;