
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    UserRound,
    GraduationCap,
    MapPin,
    ShieldCheck,
    BriefcaseBusiness,
    Users,
    LogOut,
} from "lucide-react";

// ==========================================
// NAVIGATION ITEMS
// ==========================================

const navItems = [
    {
        label: "Dashboard",
        path: "/employee/dashboard",
        Icon: LayoutDashboard,
    },
    {
        label: "Personal Information",
        path: "/employee/personal",
        Icon: UserRound,
    },
    {
        label: "Education",
        path: "/employee/education",
        Icon: GraduationCap,
    },
    {
        label: "Address",
        path: "/employee/address",
        Icon: MapPin,
    },
    {
        label: "Skills",
        path: "/employee/skills",
        Icon: ShieldCheck,
    },
    {
        label: "Work Experience",
        path: "/employee/experience",
        Icon: BriefcaseBusiness,
    },
    {
        label: "BDM Details",
        path: "/employee/bdm",
        Icon: Users,
    },
];

// ==========================================
// SIDEBAR COMPONENT
// ==========================================

const Sidebar = () => {
    const navigate = useNavigate();

    // Read logged-in employee
    let employee = {};

    try {
        employee = JSON.parse(
            sessionStorage.getItem("employeeUser") || "{}"
        );
    } catch {
        employee = {};
    }

    const employeeName =
        employee.fullName ||
        employee.name ||
        employee.employeeName ||
        "Employee";

    const employeeEmail =
        sessionStorage.getItem("employeeUserEmail") ||
        employee.email ||
        "Employee Account";

    const initials = employeeName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join("") || "EM";

    // ======================================
    // LOGOUT
    // ======================================

    const handleLogout = () => {
        try {
            // Remove employee authentication
            const employeeKeys = [
                "employeeToken",
                "employeeUser",
                "employeeUserId",
                "employeeUserEmail",
                "employeeUserRole",
                "employeeAuthenticated",
                "employeeId",
                "employee",
            ];

            employeeKeys.forEach((key) => {
                sessionStorage.removeItem(key);
                localStorage.removeItem(key);
            });

            // Remove legacy employee authentication keys
            const legacyKeys = [
                "token",
                "authToken",
                "accessToken",
                "skillmatrix_token",
                "user",
                "userId",
                "userEmail",
                "userRole",
                "isAuthenticated",
            ];

            legacyKeys.forEach((key) => {
                sessionStorage.removeItem(key);
                localStorage.removeItem(key);
            });

            // Notify any components listening for employee changes
            window.dispatchEvent(
                new Event("employeeLoggedOut")
            );

            // Redirect to employee login
            navigate("/login", {
                replace: true,
            });

        } catch (error) {
            console.error("Employee logout error:", error);
            alert("Unable to logout. Please try again.");
        }
    };

    return (
        <aside className="
            flex h-full min-h-0 w-full flex-col
            bg-sky-700 text-white
        ">

            {/* BRAND */}
            <div className="
                flex h-20 shrink-0 items-center gap-3
                border-b border-sky-500 px-5
            ">
                <div className="
                    flex h-14 w-14 shrink-0
                    items-center justify-center
                    overflow-hidden rounded-full bg-white shadow-md
                ">
                    <img
                        src="/pcs_logo.jpg"
                        alt="PCS Logo"
                        className="h-full w-full rounded-full object-contain"
                    />
                </div>

                <div className="min-w-0">
                    <h2 className="truncate text-base font-bold tracking-wide">
                        SkillMatrix
                    </h2>

                    <p className="mt-0.5 text-xs text-sky-100">
                        Employee Portal
                    </p>
                </div>
            </div>

            {/* NAVIGATION */}
            <nav className="
                min-h-0 flex-1 overflow-y-auto
                overflow-x-hidden px-3 py-6
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
            ">
                <div className="mb-3 px-3">
                    <p className="
                        text-[10px] font-semibold
                        uppercase tracking-[0.18em] text-sky-100
                    ">
                        Workspace
                    </p>
                </div>

                <div className="space-y-1">
                    {navItems.map(({ label, path, Icon }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) => `
                                group flex w-full items-center gap-3
                                rounded-xl px-3 py-3
                                text-sm font-medium
                                transition-all duration-200
                                ${
                                    isActive
                                        ? "bg-white text-sky-700 shadow-md shadow-sky-900/10"
                                        : "text-sky-50 hover:bg-sky-500 hover:text-white"
                                }
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <span className={`
                                        flex h-9 w-9 shrink-0
                                        items-center justify-center
                                        rounded-lg transition-all
                                        ${
                                            isActive
                                                ? "bg-sky-100 text-sky-700"
                                                : "bg-sky-500 text-sky-100 group-hover:bg-sky-400 group-hover:text-white"
                                        }
                                    `}>
                                        <Icon size={20} strokeWidth={1.8} />
                                    </span>

                                    <span className="truncate">
                                        {label}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>

            {/* EMPLOYEE PROFILE AND LOGOUT */}
            <div className="shrink-0 border-t border-sky-500 p-3">

                <div className="
                    mb-2 flex items-center gap-3
                    rounded-xl bg-sky-500 px-3 py-3
                ">
                    <div className="
                        flex h-9 w-9 shrink-0 items-center
                        justify-center rounded-full
                        bg-white text-xs font-bold text-sky-700
                    ">
                        {initials}
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                            {employeeName}
                        </p>

                        <p className="truncate text-xs text-sky-100">
                            {employeeEmail}
                        </p>
                    </div>
                </div>

                {/* LOGOUT BUTTON */}
                <button
                    type="button"
                    onClick={handleLogout}
                    className="
                        group flex w-full items-center gap-3
                        rounded-xl px-3 py-3
                        text-sm font-medium text-sky-50
                        transition-all duration-200
                        hover:bg-white hover:text-red-600
                    "
                >
                    <span className="
                        flex h-9 w-9 items-center justify-center
                        rounded-lg bg-sky-500 text-sky-100
                        transition group-hover:bg-red-50
                        group-hover:text-red-600
                    ">
                        <LogOut size={20} strokeWidth={1.8} />
                    </span>

                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
