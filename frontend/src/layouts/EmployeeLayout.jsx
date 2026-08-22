import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Employee/Sidebar";

const EmployeeLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // =========================================================
    // CLOSE SIDEBAR WHEN ROUTE CHANGES
    // =========================================================

    useEffect(() => {
        setIsSidebarOpen(false);
    }, []);

    // =========================================================
    // CLOSE SIDEBAR WHEN SCREEN BECOMES DESKTOP
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
    // PREVENT BODY SCROLL WHEN MOBILE SIDEBAR IS OPEN
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

    return (
        <div className="min-h-screen bg-gray-50">

            {/* =================================================
                MOBILE OVERLAY
            ================================================= */}

            {isSidebarOpen && (
                <button
                    type="button"
                    aria-label="Close employee menu"
                    onClick={() =>
                        setIsSidebarOpen(false)
                    }
                    className="
                        fixed inset-0 z-40
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
                    bg-white
                    shadow-xl
                    lg:block
                "
            >
                <Sidebar />
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
                    bg-white
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
                <div className="relative h-full">

                    {/* MOBILE CLOSE BUTTON */}

                    <button
                        type="button"
                        onClick={() =>
                            setIsSidebarOpen(false)
                        }
                        aria-label="Close menu"
                        className="
                            absolute
                            right-3
                            top-3
                            z-50
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            bg-gray-100
                            text-gray-600
                            transition
                            hover:bg-gray-200
                            hover:text-gray-900
                            active:scale-95
                        "
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

                    <Sidebar />

                </div>
            </aside>

            {/* =================================================
                EMPLOYEE CONTENT
            ================================================= */}

            <main className="min-h-screen lg:pl-64">

                {/* =================================================
                    MOBILE TOP BAR
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
                        border-gray-200
                        bg-white/95
                        px-4
                        shadow-sm
                        backdrop-blur
                        sm:px-6
                        lg:hidden
                    "
                >

                    {/* MENU BUTTON */}

                    <button
                        type="button"
                        onClick={() =>
                            setIsSidebarOpen(true)
                        }
                        aria-label="Open employee menu"
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-600
                            text-white
                            shadow-sm
                            transition
                            hover:bg-blue-700
                            active:scale-95
                        "
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

                    <div className="min-w-0 flex-1 px-3 text-center">
                        <h1 className="truncate text-base font-bold text-gray-900 sm:text-lg">
                            Employee Panel
                        </h1>

                        <p className="hidden text-xs text-gray-500 sm:block">
                            SkillMatrix
                        </p>
                    </div>

                    {/* RIGHT SPACE */}

                    <div className="h-10 w-10" />

                </header>

                {/* =================================================
                    PAGE CONTENT
                ================================================= */}

                <div
                    className="
                        w-full
                        overflow-x-hidden
                        p-4
                        sm:p-5
                        md:p-6
                        lg:p-8
                    "
                >
                    <Outlet />
                </div>

            </main>

        </div>
    );
};

export default EmployeeLayout;