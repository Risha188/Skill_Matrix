import React from "react";
import {NavLink} from "react-router-dom";

const Sidebar = () => {
    const navLinkClass = ({isActive}) =>
        `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${isActive
            ? "bg-blue-100 text-blue-500 shadow-md"
            : "text-white hover:bg-blue-200 hover:text-blue-500"
        }`;

    return (
        <aside className="fixed left-0 top-0 z-10 h-screen w-64 bg-sky-600 text-white shadow-xl">

            {/* Logo */}
            <div className="flex h-20 shrink-0 items-center gap-3 border-b border-blue-400 px-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-lg font-bold text-blue-600 shadow-md">
                    SM
                </div>

                <div>
                    <h2 className="text-lg font-bold tracking-wide">
                        SkillMatrix
                    </h2>

                    <p className="text-xs text-blue-100">
                        Employee Panel
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-6">

                <p className="mb-3 px-3 text-xs font-semibold tracking-widest text-blue-100">
                    PROFILE
                </p>

                <div className="space-y-2">

                    <NavLink
                        to="/employee/dashboard"
                        className={navLinkClass}
                    >
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/employee/personal"
                        className={navLinkClass}
                    >
                        <span>Personal Information</span>
                    </NavLink>

                    <NavLink
                        to="/employee/education"
                        className={navLinkClass}
                    >
                        <span>Education</span>
                    </NavLink>

                    <NavLink
                        to="/employee/address"
                        className={navLinkClass}
                    >
                        <span>Address</span>
                    </NavLink>

                    <NavLink
                        to="/employee/skills"
                        className={navLinkClass}
                    >
                        <span>Skills</span>
                    </NavLink>

                    <NavLink
                        to="/employee/experience"
                        className={navLinkClass}
                    >
                        <span>Work Experience</span>
                    </NavLink>

                    <NavLink
                        to="/employee/bdm"
                        className={navLinkClass}
                    >
                        <span>BDM Details</span>
                    </NavLink>

                </div>
            </nav>

            {/* Logout */}
            <div className="shrink-0 border-t border-blue-400 p-4">
                <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-200 hover:text-blue-600"
                >
                    <span>Logout</span>
                </button>
            </div>

        </aside>
    );
};

export default Sidebar;