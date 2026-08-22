import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {

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

            {/* =================================================
                BRAND
            ================================================= */}

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

                {/* BRAND TEXT */}

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

                    <p
                        className="
                            mt-0.5
                            text-xs
                            text-slate-400
                        "
                    >
                        Employee Portal
                    </p>

                </div>

            </div>

            {/* =================================================
                NAVIGATION
            ================================================= */}

            <nav
                className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    overflow-x-hidden
                    px-3
                    py-6

                    [scrollbar-none]
                    [-ms-overflow-style:none]
                    [&::-webkit-scrollbar]:hidden
                "
            >

                {/* SECTION TITLE */}

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
                        Workspace
                    </p>

                </div>

                {/* =================================================
                    NAVIGATION LINKS
                ================================================= */}

                <div className="space-y-1">

                    {/* =================================================
                        DASHBOARD
                    ================================================= */}

                    <NavLink
                        to="/employee/dashboard"
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
                                </span>

                                <span className="truncate">
                                    Dashboard
                                </span>
                            </>
                        )}
                    </NavLink>

                    {/* =================================================
                        PERSONAL INFORMATION
                    ================================================= */}

                    <NavLink
                        to="/employee/personal"
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
                                            d="M15 19a6 6 0 00-12 0"
                                        />

                                        <circle
                                            cx="9"
                                            cy="7"
                                            r="4"
                                        />

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
                                    </svg>
                                </span>

                                <span className="truncate">
                                    Personal Information
                                </span>
                            </>
                        )}
                    </NavLink>

                    {/* =================================================
                        EDUCATION
                    ================================================= */}

                    <NavLink
                        to="/employee/education"
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
                                    </svg>
                                </span>

                                <span className="truncate">
                                    Education
                                </span>
                            </>
                        )}
                    </NavLink>

                    {/* =================================================
                        ADDRESS
                    ================================================= */}

                    <NavLink
                        to="/employee/address"
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
                                            d="M12 21s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z"
                                        />

                                        <circle
                                            cx="12"
                                            cy="9"
                                            r="2.5"
                                        />
                                    </svg>
                                </span>

                                <span className="truncate">
                                    Address
                                </span>
                            </>
                        )}
                    </NavLink>

                    {/* =================================================
                        SKILLS
                    ================================================= */}

                    <NavLink
                        to="/employee/skills"
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
                                            d="M9 12l2 2 4-4"
                                        />

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 3l7 4v5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V7l7-4z"
                                        />
                                    </svg>
                                </span>

                                <span className="truncate">
                                    Skills
                                </span>
                            </>
                        )}
                    </NavLink>

                    {/* =================================================
                        WORK EXPERIENCE
                    ================================================= */}

                    <NavLink
                        to="/employee/experience"
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
                                    </svg>
                                </span>

                                <span className="truncate">
                                    Work Experience
                                </span>
                            </>
                        )}
                    </NavLink>

                    {/* =================================================
                        BDM DETAILS
                    ================================================= */}

                    <NavLink
                        to="/employee/bdm"
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
                                        <circle
                                            cx="12"
                                            cy="7"
                                            r="3"
                                        />

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
                                    </svg>
                                </span>

                                <span className="truncate">
                                    BDM Details
                                </span>
                            </>
                        )}
                    </NavLink>

                </div>

            </nav>

            {/* =================================================
                EMPLOYEE PROFILE / LOGOUT
            ================================================= */}

            <div
                className="
                    shrink-0
                    border-t
                    border-slate-800
                    p-3
                "
            >

                {/* EMPLOYEE PROFILE */}

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

                    {/* AVATAR */}

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
                            text-white
                        "
                    >
                        EM
                    </div>

                    {/* EMPLOYEE DETAILS */}

                    <div className="min-w-0">

                        <p
                            className="
                                truncate
                                text-sm
                                font-semibold
                                text-white
                            "
                        >
                            Employee
                        </p>

                        <p
                            className="
                                truncate
                                text-xs
                                text-slate-500
                            "
                        >
                            Employee Account
                        </p>

                    </div>

                </div>

                {/* =================================================
                    LOGOUT
                ================================================= */}

                <button
                    type="button"
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

        </aside>
    );
};

export default Sidebar;