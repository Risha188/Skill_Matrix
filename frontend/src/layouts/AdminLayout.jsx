import {
    NavLink,
    Outlet,
    useLocation,
    useNavigate,
} from "react-router-dom";

import { useEffect, useState } from "react";

import { useAdmin } from "../context/AdminContext.jsx";

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        currentAdmin,
        logoutAdmin,
    } = useAdmin();

    // =========================================================
    // MOBILE SIDEBAR STATE
    // =========================================================

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // =========================================================
    // CLOSE SIDEBAR WHEN ROUTE CHANGES
    // =========================================================

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    // =========================================================
    // CLOSE SIDEBAR ON DESKTOP
    // =========================================================

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener(
                "resize",
                handleResize
            );
        };
    }, []);

    // =========================================================
    // PREVENT BODY SCROLL ON MOBILE
    // =========================================================

    useEffect(() => {
        if (
            isSidebarOpen &&
            window.innerWidth < 1024
        ) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isSidebarOpen]);

    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {
        logoutAdmin();

        setIsSidebarOpen(false);

        navigate("/admin/login", {
            replace: true,
        });
    };

    // =========================================================
    // NAVIGATION ITEMS
    // =========================================================

    const navItems = [
        {
            name: "Dashboard",
            path: "/admin/dashboard",
            icon: (
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
                </svg>
            ),
        },

        {
            name: "Employees",
            path: "/admin/employees",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <circle
                        cx="9"
                        cy="7"
                        r="4"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 21a6 6 0 0112 0"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 4a4 4 0 010 6"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 13a6 6 0 014 8"
                    />
                </svg>
            ),
        },

        {
            name: "All Projects",
            path: "/admin/allprojects",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <rect
                        x="3"
                        y="4"
                        width="18"
                        height="16"
                        rx="2"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 8h8"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12h8"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 16h5"
                    />
                </svg>
            ),
        },

        {
            name: "Assigned Projects",
            path: "/admin/assignedproject",
            icon: (
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
                        d="M4 6h16"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 12h16"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 18h10"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 17l2 2 4-4"
                    />
                </svg>
            ),
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

    // =========================================================
    // NAVIGATION LINK STYLE
    // =========================================================

    const navLinkClass = ({ isActive }) =>
        `
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
                ? `
                    bg-blue-600
                    text-white
                    shadow-lg
                    shadow-blue-900/20
                  `
                : `
                    text-slate-300
                    hover:bg-slate-800
                    hover:text-white
                  `
        }
        `;

    // =========================================================
    // ICON STYLE
    // =========================================================

    const iconClass = ({ isActive }) =>
        `
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
                ? `
                    bg-white/15
                    text-white
                  `
                : `
                    bg-slate-800
                    text-slate-400
                    group-hover:bg-slate-700
                    group-hover:text-white
                  `
        }
        `;

    // =========================================================
    // SIDEBAR CONTENT
    // =========================================================

    const sidebarContent = (
        <div className="flex h-full min-h-0 flex-col">

            {/* =================================================
                BRAND
            ================================================= */}

            <div
                className="
                    flex
                    h-20
                    shrink-0
                    items-center
                    justify-between
                    border-b
                    border-slate-800
                    px-5
                "
            >

                <div className="flex min-w-0 items-center gap-3">

                    {/* LOGO */}

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
                            shadow-blue-900/30
                        "
                    >
                        SM
                    </div>

                    {/* BRAND */}

                    <div className="min-w-0">

                        <h1
                            className="
                                truncate
                                text-base
                                font-bold
                                tracking-wide
                                text-white
                            "
                        >
                            SkillMatrix
                        </h1>

                        <p
                            className="
                                mt-0.5
                                text-xs
                                text-slate-400
                            "
                        >
                            Admin Portal
                        </p>

                    </div>

                </div>

                {/* MOBILE CLOSE */}

                <button
                    type="button"
                    onClick={() =>
                        setIsSidebarOpen(false)
                    }
                    className="
                        ml-3
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        text-slate-400
                        transition
                        hover:bg-slate-800
                        hover:text-white
                        lg:hidden
                    "
                    aria-label="Close menu"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

            </div>

            {/* =================================================
                NAVIGATION
            ================================================= */}

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

                    {/* MAIN NAVIGATION */}

                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={navLinkClass}
                        >
                            {({ isActive }) => (
                                <>
                                    {/* ICON */}

                                    <span
                                        className={iconClass({
                                            isActive,
                                        })}
                                    >
                                        {item.icon}
                                    </span>

                                    {/* LABEL */}

                                    <span className="truncate">
                                        {item.name}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    ))}

                </div>

                {/* =================================================
                    PROJECT SECTION
                ================================================= */}

                {isProjectPage && (
                    <div className="mt-7">

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
                                Project
                            </p>

                        </div>

                        <div className="space-y-1">

                            {/* ALL PROJECTS */}

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
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                            >
                                                <rect
                                                    x="3"
                                                    y="4"
                                                    width="18"
                                                    height="16"
                                                    rx="2"
                                                />

                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M8 8h8M8 12h8M8 16h5"
                                                />
                                            </svg>
                                        </span>

                                        <span className="truncate">
                                            All Projects
                                        </span>
                                    </>
                                )}
                            </NavLink>

                            {/* ASSIGNED PROJECTS */}

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
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M4 6h16"
                                                />

                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M4 12h16"
                                                />

                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M4 18h10"
                                                />

                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M17 17l2 2 4-4"
                                                />
                                            </svg>
                                        </span>

                                        <span className="truncate">
                                            Assigned Projects
                                        </span>
                                    </>
                                )}
                            </NavLink>

                        </div>

                    </div>
                )}

            </nav>

            {/* =================================================
                ADMIN PROFILE + LOGOUT
            ================================================= */}

            <div
                className="
                    shrink-0
                    border-t
                    border-slate-800
                    p-3
                "
            >

                {/* ADMIN PROFILE */}

                <div
                    className="
                        mb-2
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

                        <p
                            className="
                                truncate
                                text-sm
                                font-semibold
                                text-white
                            "
                        >
                            {currentAdmin?.name ||
                                "Administrator"}
                        </p>

                        <p
                            className="
                                truncate
                                text-xs
                                text-slate-500
                            "
                        >
                            {currentAdmin?.isDefault
                                ? "System Administrator"
                                : "Administrator"}
                        </p>

                    </div>

                </div>

                {/* LOGOUT */}

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

        </div>
    );

    return (
        <div className="min-h-screen bg-slate-100">

            {/* =================================================
                MOBILE OVERLAY
            ================================================= */}

            {isSidebarOpen && (
                <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={() =>
                        setIsSidebarOpen(false)
                    }
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-black/50
                        backdrop-blur-[2px]
                        lg:hidden
                    "
                />
            )}

            {/* =================================================
                DESKTOP SIDEBAR
            ================================================= */}

            <aside
                className="
                    fixed
                    left-0
                    top-0
                    z-50
                    hidden
                    h-screen
                    w-64
                    flex-col
                    bg-slate-950
                    text-white
                    shadow-2xl
                    lg:flex
                "
            >
                {sidebarContent}
            </aside>

            {/* =================================================
                MOBILE SIDEBAR
            ================================================= */}

            <aside
                className={`
                    fixed
                    left-0
                    top-0
                    z-50
                    h-screen
                    w-[min(85vw,20rem)]
                    bg-slate-950
                    text-white
                    shadow-2xl
                    transition-transform
                    duration-300
                    ease-in-out
                    lg:hidden
                    ${
                        isSidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >
                {sidebarContent}
            </aside>

            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <div className="min-h-screen lg:ml-64">

                {/* =================================================
                    MOBILE HEADER
                ================================================= */}

                <header
                    className="
                        sticky
                        top-0
                        z-30
                        flex
                        h-16
                        items-center
                        justify-between
                        border-b
                        border-slate-200
                        bg-white/95
                        px-4
                        shadow-sm
                        backdrop-blur
                        sm:px-6
                        lg:hidden
                    "
                >

                    {/* MENU */}

                    <button
                        type="button"
                        onClick={() =>
                            setIsSidebarOpen(true)
                        }
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-slate-900
                            text-white
                            shadow-sm
                            transition
                            hover:bg-slate-800
                            active:scale-95
                        "
                        aria-label="Open menu"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>

                    {/* TITLE */}

                    <div
                        className="
                            min-w-0
                            flex-1
                            px-3
                            text-center
                        "
                    >
                        <h1
                            className="
                                truncate
                                text-base
                                font-bold
                                text-slate-900
                                sm:text-lg
                            "
                        >
                            Admin Panel
                        </h1>

                        <p
                            className="
                                hidden
                                text-xs
                                text-slate-500
                                sm:block
                            "
                        >
                            SkillMatrix
                        </p>
                    </div>

                    {/* ADMIN */}

                    <div
                        className="
                            max-w-28
                            text-right
                            sm:max-w-40
                        "
                    >
                        <p
                            className="
                                truncate
                                text-xs
                                font-semibold
                                text-slate-800
                                sm:text-sm
                            "
                        >
                            {currentAdmin?.name ||
                                "Administrator"}
                        </p>

                        <p
                            className="
                                hidden
                                truncate
                                text-[10px]
                                text-slate-500
                                sm:block
                            "
                        >
                            {currentAdmin?.isDefault
                                ? "System Administrator"
                                : "Administrator"}
                        </p>
                    </div>

                </header>

                {/* =================================================
                    PAGE CONTENT
                ================================================= */}

                <main
                    className="
                        min-h-[calc(100vh-4rem)]
                        w-full
                        overflow-x-hidden
                        p-4
                        sm:p-5
                        md:p-6
                        lg:min-h-screen
                        lg:p-8
                    "
                >
                    <Outlet />
                </main>

            </div>

        </div>
    );
};

export default AdminLayout;