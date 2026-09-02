import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

// =========================================================
// STORAGE KEYS
// =========================================================

const PROJECT_STORAGE_KEY =
    "assignedProjects";

const DELETED_PROJECTS_KEY =
    "deletedProjectIds";

// =========================================================
// GET PROJECT STATUS
// =========================================================

const getProjectStatus = (
    startDate,
    endDate
) => {
    if (!startDate || !endDate) {
        return "Pending";
    }

    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    const start = new Date(
        `${startDate}T00:00:00`
    );

    const end = new Date(
        `${endDate}T23:59:59`
    );

    if (
        Number.isNaN(
            start.getTime()
        )
    ) {
        return "Pending";
    }

    if (
        Number.isNaN(
            end.getTime()
        )
    ) {
        return "Pending";
    }

    if (today < start) {
        return "Pending";
    }

    if (today <= end) {
        return "Active";
    }

    return "Completed";
};

// =========================================================
// GET DELETED PROJECT IDS
// =========================================================

const getDeletedProjectIds = () => {
    try {
        const storedDeletedProjects =
            localStorage.getItem(
                DELETED_PROJECTS_KEY
            );

        if (!storedDeletedProjects) {
            return [];
        }

        const parsedDeletedProjects =
            JSON.parse(
                storedDeletedProjects
            );

        if (
            !Array.isArray(
                parsedDeletedProjects
            )
        ) {
            return [];
        }

        return parsedDeletedProjects.map(
            String
        );
    } catch (error) {
        console.error(
            "Failed to read deleted project IDs:",
            error
        );

        return [];
    }
};

// =========================================================
// LOAD ASSIGNED PROJECTS
// =========================================================

const loadAssignedProjects = () => {
    try {
        const storedProjects =
            localStorage.getItem(
                PROJECT_STORAGE_KEY
            );

        if (!storedProjects) {
            return [];
        }

        const parsedProjects =
            JSON.parse(
                storedProjects
            );

        if (
            !Array.isArray(
                parsedProjects
            )
        ) {
            return [];
        }

        const deletedProjectIds =
            getDeletedProjectIds();

        return parsedProjects
            .filter(
                (project) =>
                    !deletedProjectIds.includes(
                        String(project.id)
                    )
            )
            .map((project) => ({
                ...project,

                employeeIds:
                    Array.isArray(
                        project.employeeIds
                    )
                        ? project.employeeIds
                        : [],

                status:
                    getProjectStatus(
                        project.startDate,
                        project.endDate
                    ),
            }));
    } catch (error) {
        console.error(
            "Failed to load assigned projects:",
            error
        );

        return [];
    }
};

// =========================================================
// ASSIGNED PROJECT
// =========================================================

const AssignedProject = () => {

    // =========================================================
    // NAVIGATION
    // =========================================================

    const navigate =
        useNavigate();

    // =========================================================
    // STATES
    // =========================================================

    const [
        assignedProjects,
        setAssignedProjects,
    ] = useState(() =>
        loadAssignedProjects()
    );

    const [
        search,
        setSearch,
    ] = useState("");

    // =========================================================
    // LOAD / REFRESH PROJECTS
    // =========================================================

    const refreshProjects = () => {
        const latestProjects =
            loadAssignedProjects();

        setAssignedProjects(
            latestProjects
        );
    };

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {
        refreshProjects();
    }, []);

    // =========================================================
    // STORAGE + WINDOW FOCUS
    // =========================================================

    useEffect(() => {

        const handleStorageChange = () => {
            refreshProjects();
        };

        const handleWindowFocus = () => {
            refreshProjects();
        };

        window.addEventListener(
            "storage",
            handleStorageChange
        );

        window.addEventListener(
            "focus",
            handleWindowFocus
        );

        return () => {

            window.removeEventListener(
                "storage",
                handleStorageChange
            );

            window.removeEventListener(
                "focus",
                handleWindowFocus
            );

        };

    }, []);

    // =========================================================
    // AUTOMATIC STATUS REFRESH
    // =========================================================

    useEffect(() => {

        const interval =
            setInterval(() => {
                refreshProjects();
            }, 60 * 1000);

        return () => {
            clearInterval(
                interval
            );
        };

    }, []);

    // =========================================================
    // FILTER PROJECTS
    // =========================================================

    const filteredProjects =
        useMemo(() => {

            const searchValue =
                search
                    .toLowerCase()
                    .trim();

            if (!searchValue) {
                return assignedProjects;
            }

            return assignedProjects.filter(
                (project) => {

                    const projectName =
                        String(
                            project.projectName ||
                                ""
                        ).toLowerCase();

                    const projectCode =
                        String(
                            project.projectCode ||
                                ""
                        ).toLowerCase();

                    return (
                        projectName.includes(
                            searchValue
                        ) ||
                        projectCode.includes(
                            searchValue
                        )
                    );
                }
            );

        }, [
            assignedProjects,
            search,
        ]);

    // =========================================================
    // VIEW PROJECT
    // =========================================================
    //
    // IMPORTANT:
    //
    // Use exactly the same route everywhere:
    //
    // /admin/project-details/:projectId
    //
    // Do NOT use:
    //
    // /admin/projectdetails/:projectId
    //
    // =========================================================

    const handleViewProject = (
        project
    ) => {

        if (!project?.id) {
            return;
        }

        navigate(
            `/admin/project-details/${project.id}`,
            {
                state: {
                    project,
                },
            }
        );
    };

    // =========================================================
    // CLEAR SEARCH
    // =========================================================

    const handleClearSearch = () => {
        setSearch("");
    };

    // =========================================================
    // STATUS CLASSES
    // =========================================================

    const getStatusClasses = (
        status
    ) => {

        switch (status) {

            case "Active":
                return "bg-green-100 text-green-700";

            case "Completed":
                return "bg-blue-100 text-blue-700";

            case "Pending":
            default:
                return "bg-yellow-100 text-yellow-700";
        }
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

                {/* TOTAL */}

                <div className="rounded-xl bg-white p-5 shadow-sm">

                    <p className="text-sm text-gray-500">
                        Total Projects
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-gray-800">
                        {
                            assignedProjects.length
                        }
                    </h2>

                </div>

                {/* ACTIVE */}

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

                {/* PENDING */}

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

                {/* COMPLETED */}

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
                            placeholder="Search project by name or code..."
                            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />

                        {/* CLEAR */}

                        {search && (

                            <button
                                type="button"
                                onClick={
                                    handleClearSearch
                                }
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition hover:text-gray-600"
                                title="Clear search"
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

                    {/* RESULT COUNT */}

                    {search.trim() && (

                        <p className="text-sm text-gray-500">

                            <span className="font-semibold text-gray-700">
                                {
                                    filteredProjects.length
                                }
                            </span>{" "}

                            project
                            {
                                filteredProjects.length !==
                                1
                                    ? "s"
                                    : ""
                            }{" "}
                            found

                        </p>

                    )}

                </div>

                <p className="mt-2 text-xs text-gray-400">
                    Search projects by project name or
                    project code.
                </p>

            </div>

            {/* =================================================
                PROJECT LIST
            ================================================= */}

            {filteredProjects.length > 0 ? (

                <div className="space-y-4">

                    {filteredProjects.map(
                        (project) => {

                            const currentStatus =
                                getProjectStatus(
                                    project.startDate,
                                    project.endDate
                                );

                            return (

                                <div
                                    key={
                                        project.id
                                    }
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

                                            <h2 className="mt-1 truncate text-base font-semibold text-gray-800">
                                                {
                                                    project.projectName ||
                                                    "Unnamed Project"
                                                }
                                            </h2>

                                            <p className="mt-1 text-xs font-medium text-gray-400">
                                                {
                                                    project.projectCode ||
                                                    "-"
                                                }
                                            </p>

                                        </div>

                                        {/* =================================================
                                            TEAM MEMBERS
                                        ================================================= */}

                                        <div className="lg:w-[14%]">

                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                Team Members
                                            </p>

                                            <p className="mt-2 text-sm font-semibold text-gray-800">

                                                {
                                                    project
                                                        .employeeIds
                                                        ?.length ||
                                                    0
                                                }{" "}

                                                {
                                                    project
                                                        .employeeIds
                                                        ?.length ===
                                                    1
                                                        ? "Member"
                                                        : "Members"
                                                }

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
                                                    project.startDate ||
                                                    "-"
                                                }
                                            </p>

                                        </div>

                                        {/* =================================================
                                            END DATE
                                        ================================================= */}

                                        <div className="lg:w-[15%]">

                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                End Date
                                            </p>

                                            <p className="mt-2 text-sm font-medium text-gray-700">
                                                {
                                                    project.endDate ||
                                                    "-"
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
                                                className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                                                    currentStatus
                                                )}`}
                                            >
                                                {
                                                    currentStatus
                                                }
                                            </span>

                                        </div>

                                        {/* =================================================
                                            ACTION
                                        ================================================= */}

                                        <div className="lg:w-[14%] lg:text-right">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleViewProject(
                                                        {
                                                            ...project,
                                                            status: currentStatus,
                                                        }
                                                    )
                                                }
                                                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            >
                                                View Project
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            );
                        }
                    )}

                </div>

            ) : (

                /* =================================================
                    EMPTY STATE
                ================================================= */

                <div className="rounded-xl bg-white p-10 text-center shadow-sm">

                    {search.trim() ? (

                        <>

                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="h-6 w-6 text-gray-400"
                                >

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m21 21-4.5-4.5m0 0A7.5 7.5 0 1 0 6 6a7.5 7.5 0 0 0 10.5 10.5Z"
                                    />

                                </svg>

                            </div>

                            <h2 className="mt-3 text-lg font-semibold text-gray-800">
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
                                onClick={
                                    handleClearSearch
                                }
                                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                            >
                                Clear Search
                            </button>

                        </>

                    ) : (

                        <>

                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="h-6 w-6 text-gray-400"
                                >

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                    />

                                </svg>

                            </div>

                            <h2 className="mt-3 text-lg font-semibold text-gray-800">
                                No Projects Assigned
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                You currently don't
                                have any projects
                                assigned to you.
                            </p>

                        </>

                    )}

                </div>

            )}

        </div>
    );
};

export default AssignedProject;