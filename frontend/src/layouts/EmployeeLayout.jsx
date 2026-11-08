
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/Employee/Sidebar.jsx";

const EmployeeLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar after navigation
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    // Handle desktop resize
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

    // Lock body scrolling on mobile
    useEffect(() => {
        document.body.style.overflow =
            isSidebarOpen && window.innerWidth < 1024
                ? "hidden"
                : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [isSidebarOpen]);

    return (
        <div className="min-h-screen w-full bg-gray-50">

            {/* MOBILE OVERLAY */}
            {isSidebarOpen && (
                <button
                    type="button"
                    aria-label="Close menu"
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                />
            )}

            {/* DESKTOP SIDEBAR */}
            <aside className="
                fixed left-0 top-0 z-40
                hidden h-screen w-64
                border-r border-gray-200 bg-white
                lg:block
            ">
                <Sidebar />
            </aside>

            {/* MOBILE SIDEBAR */}
            <aside
                className={`
                    fixed left-0 top-0 z-50
                    h-screen w-[min(85vw,20rem)]
                    bg-white shadow-2xl
                    transition-transform duration-300
                    lg:hidden
                    ${isSidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
                `}
            >
                <div className="relative h-full">
                    <button
                        type="button"
                        aria-label="Close sidebar"
                        onClick={() => setIsSidebarOpen(false)}
                        className="
                            absolute right-3 top-3 z-[60]
                            flex h-9 w-9 items-center justify-center
                            rounded-lg bg-gray-100 text-gray-700
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
                            <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <Sidebar />
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="
                min-h-screen min-w-0 w-full
                lg:ml-64 lg:w-[calc(100%-16rem)]
            ">

                {/* MOBILE HEADER */}
                <header className="
                    sticky top-0 z-30
                    flex h-16 items-center
                    border-b border-gray-200
                    bg-white px-4 shadow-sm
                    lg:hidden
                ">
                    <button
                        type="button"
                        aria-label="Open sidebar"
                        onClick={() => setIsSidebarOpen(true)}
                        className="
                            flex h-10 w-10 items-center justify-center
                            rounded-xl bg-blue-600 text-white
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
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div className="flex-1 text-center">
                        <h1 className="text-lg font-bold text-gray-900">
                            Employee Panel
                        </h1>
                        <p className="text-xs text-gray-500">
                            SkillMatrix
                        </p>
                    </div>

                    <div className="h-10 w-10" />
                </header>

                {/* PAGE CONTENT */}
                <section className="
                    w-full px-4 py-6
                    sm:px-6 sm:py-8
                    lg:px-8 lg:py-8
                    xl:px-10
                ">
                    <div className="mx-auto w-full max-w-7xl">
                        <Outlet />
                    </div>
                </section>

            </main>
        </div>
    );
};

export default EmployeeLayout;
