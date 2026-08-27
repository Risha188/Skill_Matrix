import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/Employee/Sidebar";

const EmployeeLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const location = useLocation();

    // =========================================================
    // CLOSE MOBILE SIDEBAR WHEN ROUTE CHANGES
    // =========================================================

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    // =========================================================
    // CLOSE MOBILE SIDEBAR ON DESKTOP
    // =========================================================

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // =========================================================
    // PREVENT BODY SCROLL WHEN MOBILE SIDEBAR IS OPEN
    // =========================================================

    useEffect(() => {
        if (isSidebarOpen && window.innerWidth < 1024) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isSidebarOpen]);

    return (
        <div className="min-h-screen w-full bg-gray-50">

            {/* =================================================
                MOBILE OVERLAY
            ================================================= */}

            {isSidebarOpen && (
                <button
                    type="button"
                    aria-label="Close employee menu"
                    onClick={() => setIsSidebarOpen(false)}
                    className="
                        fixed
                        inset-0
                        z-40
                        cursor-default
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
                    border-r
                    border-gray-200
                    bg-white
                    lg:block
                "
            >
                <div className="h-full w-full overflow-y-auto">
                    <Sidebar />
                </div>
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
                <div className="relative h-full w-full overflow-y-auto">

                    {/* CLOSE BUTTON */}

                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(false)}
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
                MAIN AREA
            ================================================= */}

            <main
                className="
                    min-h-screen
                    w-full
                    lg:ml-64
                    lg:w-auto
                "
            >

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
                        w-full
                        items-center
                        border-b
                        border-gray-200
                        bg-white
                        px-4
                        shadow-sm
                        sm:px-6
                        lg:hidden
                    "
                >

                    {/* LEFT MENU BUTTON */}

                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(true)}
                        aria-label="Open employee menu"
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
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

                    {/* CENTER TITLE */}

                    <div className="min-w-0 flex-1 text-center">

                        <h1 className="truncate text-base font-bold text-gray-900 sm:text-lg">
                            Employee Panel
                        </h1>

                        <p className="hidden text-xs text-gray-500 sm:block">
                            SkillMatrix
                        </p>

                    </div>

                    {/* RIGHT BALANCING SPACE */}

                    <div className="h-10 w-10 shrink-0" />

                </header>

                {/* =================================================
                    PAGE CONTENT
                ================================================= */}

                <section
                    className="
                        w-full
                        px-4
                        py-6
                        sm:px-6
                        sm:py-8
                        lg:px-8
                        lg:py-8
                        xl:px-10
                    "
                >
                    <div
                        className="
                            mx-auto
                            w-full
                            max-w-7xl
                        "
                    >
                        <Outlet />
                    </div>
                </section>

            </main>

        </div>
    );
};

export default EmployeeLayout;