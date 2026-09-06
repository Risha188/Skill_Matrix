import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

// =========================================================
// NAVIGATION ITEMS
// =========================================================

const navItems = [
    {
        label: "Dashboard",
        path: "/employee/dashboard",
        icon: (
            <>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l9-9 9 9"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 10v10h14V10"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 20v-6h6v6"
                />
            </>
        ),
    },
    {
        label: "Personal Information",
        path: "/employee/personal",
        icon: (
            <>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19a6 6 0 00-12 0"
                />
                <circle cx="9" cy="7" r="4" />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 8v6"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M22 11h-6"
                />
            </>
        ),
    },
    {
        label: "Education",
        path: "/employee/education",
        icon: (
            <>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 9l9-5 9 5-9 5-9-5z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 12v5c3 2 7 2 10 0v-5"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 10v5"
                />
            </>
        ),
    },
    {
        label: "Address",
        path: "/employee/address",
        icon: (
            <>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z"
                />
                <circle cx="12" cy="9" r="2.5" />
            </>
        ),
    },
    {
        label: "Skills",
        path: "/employee/skills",
        icon: (
            <>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3l7 4v5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V7l7-4z"
                />
            </>
        ),
    },
    {
        label: "Work Experience",
        path: "/employee/experience",
        icon: (
            <>
                <rect
                    x="3"
                    y="7"
                    width="18"
                    height="13"
                    rx="2"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12h18"
                />
            </>
        ),
    },
    {
        label: "BDM Details",
        path: "/employee/bdm",
        icon: (
            <>
                <circle cx="12" cy="7" r="3" />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 21a7 7 0 0114 0"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 8v5"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.5 10.5h-5"
                />
            </>
        ),
    },
];

// =========================================================
// COMMON STYLES
// =========================================================

const navLinkClass = ({ isActive }) =>
    [
        "group",
        "flex",
        "w-full",
        "items-center",
        "gap-3",
        "rounded-xl",
        "px-3",
        "py-3",
        "text-sm",
        "font-medium",
        "transition-all",
        "duration-200",
        isActive
            ? "bg-white text-sky-700 shadow-md shadow-sky-900/10"
            : "text-sky-50 hover:bg-sky-500 hover:text-white",
    ].join(" ");

const iconClass = ({ isActive }) =>
    [
        "flex",
        "h-9",
        "w-9",
        "shrink-0",
        "items-center",
        "justify-center",
        "rounded-lg",
        "transition-all",
        "duration-200",
        isActive
            ? "bg-sky-100 text-sky-700"
            : "bg-sky-500 text-sky-100 group-hover:bg-sky-400 group-hover:text-white",
    ].join(" ");

// =========================================================
// REUSABLE NAVIGATION ITEM
// =========================================================

const NavItem = ({ item }) => (
    <NavLink to={item.path} className={navLinkClass}>
        {({ isActive }) => (
            <>
                <span className={iconClass({ isActive })}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    >
                        {item.icon}
                    </svg>
                </span>

                <span className="truncate">
                    {item.label}
                </span>
            </>
        )}
    </NavLink>
);

// =========================================================
// SIDEBAR
// =========================================================

const Sidebar = () => {
    const navigate = useNavigate();

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {
        const storageKeys = [
            "token",
            "authToken",
            "accessToken",
            "skillmatrix_token",
            "user",
            "userId",
            "userEmail",
            "userRole",
            "employeeId",
            "isAuthenticated",
        ];

        storageKeys.forEach((key) => {
            localStorage.removeItem(key);
        });

        navigate("/login", {
            replace: true,
        });
    };

    return (
        <aside className="flex h-full min-h-0 w-full flex-col bg-sky-700 text-white">

            {/* =================================================
                BRAND
            ================================================= */}

            <div className="flex h-20 shrink-0 items-center gap-3 border-b border-sky-500 px-5">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-md">
                    <img
                        src="../../public/pcs_logo.jpg"
                        alt="PCS Logo"
                        className="h-full w-full object-contain rounded-full"
                    />
                </div>

                <div className="min-w-0">
                    <h2 className="truncate text-base font-bold tracking-wide text-white">
                        SkillMatrix
                    </h2>

                    <p className="mt-0.5 text-xs text-sky-100">
                        Employee Portal
                    </p>
                </div>
            </div>

            {/* =================================================
                NAVIGATION
            ================================================= */}

            <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-6 [scrollbar:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

                <div className="mb-3 px-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-100">
                        Workspace
                    </p>
                </div>

                <div className="space-y-1">
                    {navItems.map((item) => (
                        <NavItem
                            key={item.path}
                            item={item}
                        />
                    ))}
                </div>
            </nav>

            {/* =================================================
                EMPLOYEE PROFILE + LOGOUT
            ================================================= */}

            <div className="shrink-0 border-t border-sky-500 p-3">

                {/* PROFILE */}

                <div className="mb-2 flex items-center gap-3 rounded-xl bg-sky-500 px-3 py-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-sky-700">
                        EM
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                            Employee
                        </p>

                        <p className="truncate text-xs text-sky-100">
                            Employee Account
                        </p>
                    </div>
                </div>

                {/* LOGOUT */}

                <button
                    type="button"
                    onClick={handleLogout}
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-sky-50 transition-all duration-200 hover:bg-white hover:text-red-600"
                >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500 text-sky-100 transition group-hover:bg-red-50 group-hover:text-red-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10 17l5-5-5-5"
                            />

                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12H3"
                            />

                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 3v18"
                            />
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

export default Sidebar;