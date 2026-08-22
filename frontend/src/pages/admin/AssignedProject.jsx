import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// =========================================================
// SAME STORAGE KEY AS ASSIGN PROJECT
// =========================================================

const PROJECT_STORAGE_KEY = "assignedProjects";

const AssignedProject = () => {

    // =========================================================
    // NAVIGATION
    // =========================================================

    const navigate = useNavigate();

    // =========================================================
    // STATES
    // =========================================================

    const [assignedProjects, setAssignedProjects] =
        useState([]);

    const [search, setSearch] = useState("");

    // =========================================================
    // LOAD PROJECTS
    // =========================================================

    useEffect(() => {

        const loadProjects = () => {

            try {

                const storedProjects =
                    localStorage.getItem(
                        PROJECT_STORAGE_KEY
                    );

                if (storedProjects) {

                    setAssignedProjects(
                        JSON.parse(storedProjects)
                    );

                } else {

                    setAssignedProjects([]);

                }

            } catch (error) {

                console.error(
                    "Failed to load assigned projects:",
                    error
                );

                setAssignedProjects([]);

            }

        };

        loadProjects();

        // Listen for localStorage changes
        window.addEventListener(
            "storage",
            loadProjects
        );

        return () => {

            window.removeEventListener(
                "storage",
                loadProjects
            );

        };

    }, []);

    // =========================================================
    // SEARCH PROJECTS BY PROJECT NAME
    // =========================================================

    const filteredProjects =
        assignedProjects.filter((project) => {

            const searchValue =
                search
                    .toLowerCase()
                    .trim();

            if (!searchValue) {
                return true;
            }

            return project.projectName
                ?.toLowerCase()
                .includes(searchValue);

        });

    // =========================================================
    // VIEW PROJECT
    // =========================================================

    const handleViewProject = (project) => {

        navigate(
            `/admin/projectdetails/${project.id}`
        );

    };

    // =========================================================
    // RETURN
    // =========================================================

    return (

        <div className="min-h-screen bg-gray-100 p-6">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-6">

                <h1 className="text-2xl font-bold text-gray-800">
                    Assigned Projects
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    View all projects assigned to you.
                </p>

            </div>


            {/* =================================================
                SUMMARY
            ================================================= */}

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {/* TOTAL PROJECTS */}

                <div className="rounded-xl bg-white p-5 shadow-sm">

                    <p className="text-sm text-gray-500">
                        Total Projects
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-gray-800">
                        {assignedProjects.length}
                    </h2>

                </div>


                {/* ACTIVE PROJECTS */}

                <div className="rounded-xl bg-white p-5 shadow-sm">

                    <p className="text-sm text-gray-500">
                        Active Projects
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-green-600">

                        {
                            assignedProjects.filter(
                                (project) =>
                                    project.status ===
                                    "Active"
                            ).length
                        }

                    </h2>

                </div>


                {/* PENDING PROJECTS */}

                <div className="rounded-xl bg-white p-5 shadow-sm">

                    <p className="text-sm text-gray-500">
                        Pending Projects
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-yellow-600">

                        {
                            assignedProjects.filter(
                                (project) =>
                                    project.status ===
                                    "Pending"
                            ).length
                        }

                    </h2>

                </div>


                {/* COMPLETED PROJECTS */}

                <div className="rounded-xl bg-white p-5 shadow-sm">

                    <p className="text-sm text-gray-500">
                        Completed Projects
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-blue-600">

                        {
                            assignedProjects.filter(
                                (project) =>
                                    project.status ===
                                    "Completed"
                            ).length
                        }

                    </h2>

                </div>

            </div>


            {/* =================================================
                SEARCH BAR
            ================================================= */}

            <div className="mb-5 rounded-xl bg-white p-4 shadow-sm">

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    {/* SEARCH INPUT */}

                    <div className="relative w-full sm:max-w-md">

                        {/* SEARCH ICON */}

                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-5 w-5 text-gray-400"
                            >

                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m21 21-4.5-4.5m0 0A7.5 7.5 0 1 0 6 6a7.5 7.5 0 0 0 10.5 10.5Z"
                                />

                            </svg>

                        </div>


                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search project by name..."
                            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />


                        {/* CLEAR SEARCH */}

                        {search && (

                            <button
                                type="button"
                                onClick={() =>
                                    setSearch("")
                                }
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition hover:text-gray-600"
                            >

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="h-5 w-5"
                                >

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18 18 6M6 6l12 12"
                                    />

                                </svg>

                            </button>

                        )}

                    </div>

                </div>

            </div>


            {/* =================================================
                PROJECT LIST
            ================================================= */}

            {filteredProjects.length > 0 ? (

                <div className="space-y-4">

                    {filteredProjects.map(
                        (project) => (

                            <div
                                key={project.id}
                                className="rounded-xl bg-white shadow-sm transition hover:shadow-md"
                            >

                                {/* =================================================
                                    PROJECT ROW
                                ================================================= */}

                                <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">

                                    {/* =================================================
                                        PROJECT
                                    ================================================= */}

                                    <div className="min-w-0 lg:w-[28%]">

                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                            Project
                                        </p>

                                        <h2 className="mt-1 text-md font-semibold text-gray-800">
                                            {
                                                project.projectName
                                            }
                                        </h2>

                                        <p className="mt-1 text-xs font-medium text-gray-400">
                                            {
                                                project.projectCode
                                            }
                                        </p>

                                    </div>


                                    {/* =================================================
                                        TEAM MEMBER
                                    ================================================= */}

                                    <div className="lg:w-[14%]">

                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                            Team Member
                                        </p>

                                        <p className="mt-2 text-sm font-semibold text-gray-800">

                                            {
                                                project
                                                    .employeeIds
                                                    ?.length || 0
                                            }{" "}

                                            Members

                                        </p>

                                    </div>


                                    {/* =================================================
                                        START DATE
                                    ================================================= */}

                                    <div className="lg:w-[15%]">

                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                            Start Date
                                        </p>

                                        <p className="mt-2 text-sm font-medium text-gray-700">
                                            {
                                                project.startDate
                                            }
                                        </p>

                                    </div>


                                    {/* =================================================
                                        STATUS
                                    ================================================= */}

                                    <div className="lg:w-[14%]">

                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                            Status
                                        </p>

                                        <span
                                            className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                                                project.status ===
                                                "Active"
                                                    ? "bg-green-100 text-green-700"
                                                    : project.status ===
                                                      "Pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-blue-100 text-blue-700"
                                            }`}
                                        >
                                            {
                                                project.status
                                            }
                                        </span>

                                    </div>


                                    {/* =================================================
                                        ACTION
                                    ================================================= */}

                                    <div className="lg:w-[15%] lg:text-right">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleViewProject(
                                                    project
                                                )
                                            }
                                            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                                        >
                                            View Project
                                        </button>

                                    </div>

                                </div>

                            </div>

                        )
                    )}

                </div>

            ) : (

                /* =================================================
                    EMPTY / SEARCH EMPTY STATE
                ================================================= */

                <div className="rounded-xl bg-white p-10 text-center shadow-sm">

                    {search.trim() ? (

                        <>

                            <h2 className="text-lg font-semibold text-gray-800">
                                No Projects Found
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                No project matches{" "}
                                <span className="font-medium text-gray-700">
                                    "{search}"
                                </span>
                                .
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    setSearch("")
                                }
                                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                            >
                                Clear Search
                            </button>

                        </>

                    ) : (

                        <>

                            <h2 className="text-lg font-semibold text-gray-800">
                                No Projects Assigned
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                You currently don't have
                                any projects assigned to you.
                            </p>

                        </>

                    )}

                </div>

            )}

        </div>
    );
};

export default AssignedProject;