import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import employees from "../../data/mockEmployees";
import projectDetails from "../../data/projectDetails";

const PROJECT_STORAGE_KEY = "assignedProjects";
const DELETED_PROJECTS_KEY = "deletedProjectIds";

// =========================================================
// GET PROJECT STATUS FROM DATES
// =========================================================
//
// Pending   = Project has not started yet
// Active    = Project has started and end date has not passed
// Completed = Project end date has passed
//
// Example:
//
// Start: 2026-08-20
// End:   2026-08-30
//
// Before Aug 20  -> Pending
// Aug 20-Aug 30  -> Active
// After Aug 30   -> Completed
//
// =========================================================

const getProjectStatus = (startDate, endDate) => {
    if (!startDate || !endDate) {
        return "Pending";
    }

    // Use local date instead of UTC to avoid timezone issues.
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59`);

    if (Number.isNaN(start.getTime())) {
        return "Pending";
    }

    if (Number.isNaN(end.getTime())) {
        return "Pending";
    }

    // Project has not started
    if (today < start) {
        return "Pending";
    }

    // Project is currently running
    if (today <= end) {
        return "Active";
    }

    // Project end date has passed
    return "Completed";
};

// =========================================================
// GET STORED PROJECTS
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
            JSON.parse(storedDeletedProjects);

        return Array.isArray(parsedDeletedProjects)
            ? parsedDeletedProjects.map(String)
            : [];
    } catch (error) {
        console.error(
            "Failed to read deleted projects:",
            error
        );

        return [];
    }
};

// =========================================================
// BUILD PROJECT LIST
// =========================================================

const buildProjects = () => {
    try {
        const storedProjects =
            localStorage.getItem(
                PROJECT_STORAGE_KEY
            );

        const deletedProjectIds =
            getDeletedProjectIds();

        let parsedProjects = [];

        if (storedProjects) {
            try {
                const parsed =
                    JSON.parse(storedProjects);

                if (Array.isArray(parsed)) {
                    parsedProjects = parsed;
                }
            } catch (error) {
                console.error(
                    "Failed to parse stored projects:",
                    error
                );
            }
        }

        // =====================================================
        // MERGE MASTER PROJECT DETAILS WITH STORED DATA
        // =====================================================

        const mergedProjects =
            projectDetails
                .filter(
                    (project) =>
                        !deletedProjectIds.includes(
                            String(project.id)
                        )
                )
                .map((masterProject) => {
                    const storedProject =
                        parsedProjects.find(
                            (storedItem) =>
                                String(
                                    storedItem.id
                                ) ===
                                String(
                                    masterProject.id
                                )
                        );

                    const employeeIds =
                        storedProject?.employeeIds ||
                        masterProject.employeeIds ||
                        [];

                    const startDate =
                        storedProject?.startDate ??
                        masterProject.startDate ??
                        "";

                    const endDate =
                        storedProject?.endDate ??
                        masterProject.endDate ??
                        "";

                    return {
                        ...masterProject,

                        ...storedProject,

                        employeeIds: [
                            ...employeeIds,
                        ],

                        startDate,

                        endDate,

                        // IMPORTANT:
                        // Status is ALWAYS calculated from dates.
                        status: getProjectStatus(
                            startDate,
                            endDate
                        ),
                    };
                });

        // =====================================================
        // KEEP CUSTOM PROJECTS
        // =====================================================

        const masterProjectIds =
            new Set(
                projectDetails.map(
                    (project) =>
                        String(project.id)
                )
            );

        const customProjects =
            parsedProjects
                .filter(
                    (storedProject) =>
                        !masterProjectIds.has(
                            String(storedProject.id)
                        )
                )
                .filter(
                    (storedProject) =>
                        !deletedProjectIds.includes(
                            String(storedProject.id)
                        )
                )
                .map((project) => ({
                    ...project,

                    employeeIds:
                        project.employeeIds || [],

                    status: getProjectStatus(
                        project.startDate,
                        project.endDate
                    ),
                }));

        return [
            ...mergedProjects,
            ...customProjects,
        ];
    } catch (error) {
        console.error(
            "Failed to build projects:",
            error
        );

        return [];
    }
};

// =========================================================
// EMPLOYEE ITEM
// =========================================================

const EmployeeItem = ({ employee }) => {
    const firstName =
        employee.personalDetails?.firstName ||
        "";

    const lastName =
        employee.personalDetails?.lastName ||
        "";

    const fullName =
        `${firstName} ${lastName}`.trim();

    const initials =
        `${firstName[0] || ""}${
            lastName[0] || ""
        }`.toUpperCase();

    return (
        <div className="flex items-center gap-2">

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
                {initials}
            </div>

            <div>
                <p className="text-sm font-medium text-gray-800">
                    {fullName || "Unknown Employee"}
                </p>

                <p className="text-xs text-gray-400">
                    {employee.employeeId}
                </p>
            </div>

        </div>
    );
};

// =========================================================
// ALL PROJECTS
// =========================================================

const AllProjects = () => {
    const navigate = useNavigate();

    // =========================================================
    // PROJECT STATE
    // =========================================================

    const [projects, setProjects] = useState(() =>
        buildProjects()
    );

    // =========================================================
    // OTHER STATES
    // =========================================================

    const [search, setSearch] = useState("");

    const [
        showAssignForm,
        setShowAssignForm,
    ] = useState(false);

    const [
        expandedProjects,
        setExpandedProjects,
    ] = useState([]);

    const [formData, setFormData] = useState({
        projectName: "",
        projectCode: "",
        employeeIds: [],
        startDate: "",
        endDate: "",
    });

    // =========================================================
    // REFRESH PROJECT STATUS
    // =========================================================
    //
    // This is important because the status depends on today's
    // date. When the application remains open across midnight,
    // the status will still update.
    //
    // =========================================================

    const refreshProjects = () => {
        const latestProjects =
            buildProjects();

        setProjects(latestProjects);
    };

    // =========================================================
    // SAVE PROJECTS
    // =========================================================

    useEffect(() => {
        if (!projects.length) {
            const deletedProjectIds =
                getDeletedProjectIds();

            const existingStoredProjects =
                localStorage.getItem(
                    PROJECT_STORAGE_KEY
                );

            // Only write when appropriate.
            if (
                existingStoredProjects !==
                JSON.stringify(projects)
            ) {
                localStorage.setItem(
                    PROJECT_STORAGE_KEY,
                    JSON.stringify(projects)
                );
            }

            return;
        }

        localStorage.setItem(
            PROJECT_STORAGE_KEY,
            JSON.stringify(projects)
        );
    }, [projects]);

    // =========================================================
    // REFRESH WHEN WINDOW FOCUSES / STORAGE CHANGES
    // =========================================================

    useEffect(() => {
        const handleRefresh = () => {
            refreshProjects();
        };

        window.addEventListener(
            "focus",
            handleRefresh
        );

        window.addEventListener(
            "storage",
            handleRefresh
        );

        return () => {
            window.removeEventListener(
                "focus",
                handleRefresh
            );

            window.removeEventListener(
                "storage",
                handleRefresh
            );
        };
    }, []);

    // =========================================================
    // AUTOMATIC DAILY STATUS REFRESH
    // =========================================================

    useEffect(() => {
        const interval = setInterval(
            () => {
                refreshProjects();
            },
            60 * 1000
        );

        return () => {
            clearInterval(interval);
        };
    }, []);

    // =========================================================
    // GET PROJECT EMPLOYEES
    // =========================================================

    const getProjectEmployees = (project) => {
        return employees.filter((employee) =>
            project.employeeIds?.includes(
                employee.employeeId
            )
        );
    };

    // =========================================================
    // TOGGLE PROJECT EMPLOYEES
    // =========================================================

    const toggleProjectEmployees = (
        projectId
    ) => {
        setExpandedProjects(
            (previous) =>
                previous.includes(projectId)
                    ? previous.filter(
                          (id) =>
                              id !== projectId
                      )
                    : [
                          ...previous,
                          projectId,
                      ]
        );
    };

    // =========================================================
    // PROJECT COUNTS
    // =========================================================

    const projectCounts = useMemo(() => {
        return {
            total: projects.length,

            active: projects.filter(
                (project) =>
                    getProjectStatus(
                        project.startDate,
                        project.endDate
                    ) === "Active"
            ).length,

            completed: projects.filter(
                (project) =>
                    getProjectStatus(
                        project.startDate,
                        project.endDate
                    ) === "Completed"
            ).length,

            pending: projects.filter(
                (project) =>
                    getProjectStatus(
                        project.startDate,
                        project.endDate
                    ) === "Pending"
            ).length,
        };
    }, [projects]);

    // =========================================================
    // SEARCH PROJECTS
    // =========================================================

    const filteredProjects = useMemo(() => {
        const searchValue =
            search.toLowerCase().trim();

        if (!searchValue) {
            return projects;
        }

        return projects.filter(
            (project) => {
                const currentStatus =
                    getProjectStatus(
                        project.startDate,
                        project.endDate
                    );

                // Project name
                const projectMatch =
                    project.projectName
                        ?.toLowerCase()
                        .includes(
                            searchValue
                        );

                // Project code
                const projectCodeMatch =
                    project.projectCode
                        ?.toLowerCase()
                        .includes(
                            searchValue
                        );

                // Project type
                const projectTypeMatch =
                    project.projectType
                        ?.toLowerCase()
                        .includes(
                            searchValue
                        );

                // Priority
                const priorityMatch =
                    project.priority
                        ?.toLowerCase()
                        .includes(
                            searchValue
                        );

                // Status
                const statusMatch =
                    currentStatus
                        .toLowerCase()
                        .includes(
                            searchValue
                        );

                // Employees
                const projectEmployees =
                    getProjectEmployees(
                        project
                    );

                const employeeMatch =
                    projectEmployees.some(
                        (employee) => {
                            const firstName =
                                employee
                                    .personalDetails
                                    ?.firstName ||
                                "";

                            const lastName =
                                employee
                                    .personalDetails
                                    ?.lastName ||
                                "";

                            const fullName =
                                `${firstName} ${lastName}`
                                    .toLowerCase();

                            const employeeId =
                                employee
                                    .employeeId
                                    ?.toLowerCase() ||
                                "";

                            return (
                                fullName.includes(
                                    searchValue
                                ) ||
                                employeeId.includes(
                                    searchValue
                                )
                            );
                        }
                    );

                return (
                    projectMatch ||
                    projectCodeMatch ||
                    projectTypeMatch ||
                    priorityMatch ||
                    statusMatch ||
                    employeeMatch
                );
            }
        );
    }, [projects, search]);

    // =========================================================
    // HANDLE FORM INPUT
    // =========================================================

    const handleChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setFormData(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );
    };

    // =========================================================
    // SELECT EMPLOYEE
    // =========================================================

    const handleEmployeeSelection = (
        employeeId
    ) => {
        setFormData(
            (previous) => {
                const alreadySelected =
                    previous.employeeIds.includes(
                        employeeId
                    );

                return {
                    ...previous,

                    employeeIds:
                        alreadySelected
                            ? previous.employeeIds.filter(
                                  (id) =>
                                      id !==
                                      employeeId
                              )
                            : [
                                  ...previous.employeeIds,
                                  employeeId,
                              ],
                };
            }
        );
    };

    // =========================================================
    // RESET FORM
    // =========================================================

    const resetForm = () => {
        setFormData({
            projectName: "",
            projectCode: "",
            employeeIds: [],
            startDate: "",
            endDate: "",
        });
    };

    // =========================================================
    // ASSIGN NEW PROJECT
    // =========================================================

    const handleAssignProject = (e) => {
        e.preventDefault();

        // -----------------------------------------------------
        // PROJECT NAME
        // -----------------------------------------------------

        if (!formData.projectName.trim()) {
            alert(
                "Please enter project name."
            );

            return;
        }

        // -----------------------------------------------------
        // PROJECT CODE
        // -----------------------------------------------------

        if (!formData.projectCode.trim()) {
            alert(
                "Please enter project code."
            );

            return;
        }

        // -----------------------------------------------------
        // EMPLOYEES
        // -----------------------------------------------------

        if (
            formData.employeeIds.length < 2
        ) {
            alert(
                "At least 2 employees are required for every project."
            );

            return;
        }

        // -----------------------------------------------------
        // START DATE
        // -----------------------------------------------------

        if (!formData.startDate) {
            alert(
                "Please select start date."
            );

            return;
        }

        // -----------------------------------------------------
        // END DATE
        // -----------------------------------------------------

        if (!formData.endDate) {
            alert(
                "Please select end date."
            );

            return;
        }

        // -----------------------------------------------------
        // DATE VALIDATION
        // -----------------------------------------------------

        const startDate = new Date(
            `${formData.startDate}T00:00:00`
        );

        const endDate = new Date(
            `${formData.endDate}T00:00:00`
        );

        if (endDate < startDate) {
            alert(
                "End date must be after or equal to start date."
            );

            return;
        }

        // -----------------------------------------------------
        // DUPLICATE PROJECT CODE
        // -----------------------------------------------------

        const duplicateProject =
            projects.some(
                (project) =>
                    project.projectCode
                        ?.toLowerCase() ===
                    formData.projectCode
                        .trim()
                        .toLowerCase()
            );

        if (duplicateProject) {
            alert(
                "A project with this project code already exists."
            );

            return;
        }

        // -----------------------------------------------------
        // NEW PROJECT STATUS
        // -----------------------------------------------------

        const calculatedStatus =
            getProjectStatus(
                formData.startDate,
                formData.endDate
            );

        // -----------------------------------------------------
        // NEW PROJECT
        // -----------------------------------------------------

        const newProject = {
            id: Date.now(),

            projectName:
                formData.projectName.trim(),

            projectCode:
                formData.projectCode
                    .trim()
                    .toUpperCase(),

            description:
                "Newly created project.",

            projectOverview:
                "Project created from the admin project management panel.",

            skills: [],

            technologies: [],

            projectType:
                "Web Application",

            priority: "Medium",

            employeeIds: [
                ...formData.employeeIds,
            ],

            startDate:
                formData.startDate,

            endDate:
                formData.endDate,

            // Automatically calculated.
            status:
                calculatedStatus,

            duration: "Custom",

            client:
                "Internal Project",

            repository:
                "Private Repository",

            environment:
                "Development",

            objectives: [],
        };

        // -----------------------------------------------------
        // ADD PROJECT
        // -----------------------------------------------------

        setProjects(
            (previousProjects) => [
                ...previousProjects,
                newProject,
            ]
        );

        // -----------------------------------------------------
        // RESET
        // -----------------------------------------------------

        resetForm();

        setShowAssignForm(false);
    };

    // =========================================================
    // REASSIGN PROJECT
    // =========================================================

    const handleReassign = (project) => {
        navigate(
            `/admin/reassign-project/${project.id}`,
            {
                state: {
                    project,
                },
            }
        );
    };

    // =========================================================
    // DELETE PROJECT
    // =========================================================

    const handleDeleteProject = (
        project
    ) => {
        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${project.projectName}"?`
            );

        if (!confirmed) {
            return;
        }

        // -----------------------------------------------------
        // SAVE DELETED PROJECT ID
        // -----------------------------------------------------
        //
        // This prevents projectDetails from recreating the
        // deleted project when the application reloads.
        //
        // -----------------------------------------------------

        const deletedProjectIds =
            getDeletedProjectIds();

        const projectId =
            String(project.id);

        if (
            !deletedProjectIds.includes(
                projectId
            )
        ) {
            deletedProjectIds.push(
                projectId
            );

            localStorage.setItem(
                DELETED_PROJECTS_KEY,
                JSON.stringify(
                    deletedProjectIds
                )
            );
        }

        // -----------------------------------------------------
        // REMOVE FROM CURRENT STATE
        // -----------------------------------------------------

        setProjects(
            (previousProjects) =>
                previousProjects.filter(
                    (item) =>
                        String(item.id) !==
                        projectId
                )
        );

        // -----------------------------------------------------
        // REMOVE FROM EXPANDED PROJECTS
        // -----------------------------------------------------

        setExpandedProjects(
            (previous) =>
                previous.filter(
                    (id) =>
                        String(id) !==
                        projectId
                )
        );
    };

    // =========================================================
    // CANCEL
    // =========================================================

    const handleCancel = () => {
        resetForm();

        setShowAssignForm(false);
    };

    // =========================================================
    // STATUS BADGE
    // =========================================================

    const getStatusClasses = (status) => {
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
                    All Projects
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Manage projects, dates and employee
                    assignments.
                </p>

            </div>

            {/* =================================================
                SUMMARY
            ================================================= */}

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                {/* TOTAL */}

                <div className="rounded-xl bg-white p-5 shadow-sm">

                    <p className="text-sm font-medium text-gray-500">
                        Total Projects
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-gray-800">
                        {projectCounts.total}
                    </h2>

                </div>

                {/* ACTIVE */}

                <div className="rounded-xl bg-white p-5 shadow-sm">

                    <p className="text-sm font-medium text-gray-500">
                        Active Projects
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-green-600">
                        {projectCounts.active}
                    </h2>

                </div>

                {/* COMPLETED */}

                <div className="rounded-xl bg-white p-5 shadow-sm">

                    <p className="text-sm font-medium text-gray-500">
                        Completed Projects
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-blue-600">
                        {projectCounts.completed}
                    </h2>

                </div>

                {/* PENDING */}

                <div className="rounded-xl bg-white p-5 shadow-sm">

                    <p className="text-sm font-medium text-gray-500">
                        Pending Projects
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-yellow-600">
                        {projectCounts.pending}
                    </h2>

                </div>

            </div>

            {/* =================================================
                SEARCH + CREATE
            ================================================= */}

            <div className="mb-4 flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">

                {/* SEARCH */}

                <div className="relative w-full md:w-96">

                    <input
                        type="text"
                        placeholder="Search project or employee..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />

                    <svg
                        className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                        />
                    </svg>

                </div>

                {/* CREATE */}

                <button
                    type="button"
                    onClick={() =>
                        setShowAssignForm(
                            (previous) =>
                                !previous
                        )
                    }
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                    {showAssignForm
                        ? "Close"
                        : "+ Create New Project"}
                </button>

            </div>

            {/* =================================================
                CREATE PROJECT FORM
            ================================================= */}

            {showAssignForm && (
                <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

                    <div className="mb-6">

                        <h2 className="text-lg font-semibold text-gray-800">
                            Create New Project
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            A minimum of 2 employees
                            is required for every
                            project.
                        </p>

                    </div>

                    <form
                        onSubmit={
                            handleAssignProject
                        }
                        className="grid grid-cols-1 gap-5 md:grid-cols-2"
                    >

                        {/* PROJECT NAME */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Project Name
                            </label>

                            <input
                                type="text"
                                name="projectName"
                                value={
                                    formData.projectName
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter project name"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />

                        </div>

                        {/* PROJECT CODE */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Project Code
                            </label>

                            <input
                                type="text"
                                name="projectCode"
                                value={
                                    formData.projectCode
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Example: PRJ011"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm uppercase outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />

                        </div>

                        {/* EMPLOYEES */}

                        <div className="md:col-span-2">

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Assign Employees
                            </label>

                            <div className="overflow-hidden rounded-lg border border-gray-300">

                                <div className="max-h-60 overflow-y-auto">

                                    {employees.map(
                                        (
                                            employee
                                        ) => {

                                            const firstName =
                                                employee
                                                    .personalDetails
                                                    ?.firstName ||
                                                "";

                                            const lastName =
                                                employee
                                                    .personalDetails
                                                    ?.lastName ||
                                                "";

                                            const fullName =
                                                `${firstName} ${lastName}`.trim();

                                            const isSelected =
                                                formData.employeeIds.includes(
                                                    employee.employeeId
                                                );

                                            return (
                                                <label
                                                    key={
                                                        employee.employeeId
                                                    }
                                                    className="flex cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0 hover:bg-gray-50"
                                                >

                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            isSelected
                                                        }
                                                        onChange={() =>
                                                            handleEmployeeSelection(
                                                                employee.employeeId
                                                            )
                                                        }
                                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />

                                                    <div className="flex-1">

                                                        <p className="text-sm font-medium text-gray-800">
                                                            {
                                                                fullName
                                                            }
                                                        </p>

                                                        <p className="text-xs text-gray-500">
                                                            {
                                                                employee.employeeId
                                                            }
                                                        </p>

                                                    </div>

                                                    {isSelected && (
                                                        <span className="text-xs font-medium text-blue-600">
                                                            Selected
                                                        </span>
                                                    )}

                                                </label>
                                            );
                                        }
                                    )}

                                </div>

                            </div>

                            <div className="mt-2 flex items-center justify-between">

                                <p className="text-xs text-gray-500">
                                    Select at least 2
                                    employees.
                                </p>

                                <p
                                    className={`text-xs font-medium ${
                                        formData
                                            .employeeIds
                                            .length >= 2
                                            ? "text-green-600"
                                            : "text-red-500"
                                    }`}
                                >
                                    {
                                        formData
                                            .employeeIds
                                            .length
                                    }{" "}
                                    selected
                                </p>

                            </div>

                        </div>

                        {/* START DATE */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Start Date
                            </label>

                            <input
                                type="date"
                                name="startDate"
                                value={
                                    formData.startDate
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />

                        </div>

                        {/* END DATE */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                End Date
                            </label>

                            <input
                                type="date"
                                name="endDate"
                                value={
                                    formData.endDate
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />

                        </div>

                        {/* AUTOMATIC STATUS */}

                        <div className="md:col-span-2">

                            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">

                                <p className="text-sm font-semibold text-blue-800">
                                    Project status is automatic
                                </p>

                                <div className="mt-2 space-y-1 text-xs text-blue-700">

                                    <p>
                                        • Before start date →
                                        Pending
                                    </p>

                                    <p>
                                        • Between start and
                                        end date → Active
                                    </p>

                                    <p>
                                        • After end date →
                                        Completed
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* BUTTONS */}

                        <div className="flex justify-end gap-3 md:col-span-2">

                            <button
                                type="button"
                                onClick={
                                    handleCancel
                                }
                                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                            >
                                Create New Project
                            </button>

                        </div>

                    </form>

                </div>
            )}

            {/* =================================================
                PROJECT TABLE
            ================================================= */}

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[1000px] text-left">

                        {/* HEADER */}

                        <thead className="border-b bg-gray-50">

                            <tr>

                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                    Project
                                </th>

                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                    Employees
                                </th>

                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                    Team Members
                                </th>

                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                    Start Date
                                </th>

                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                    End Date
                                </th>

                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        {/* BODY */}

                        <tbody className="divide-y divide-gray-100">

                            {filteredProjects.length >
                            0 ? (
                                filteredProjects.map(
                                    (project) => {

                                        const projectEmployees =
                                            getProjectEmployees(
                                                project
                                            );

                                        const visibleEmployees =
                                            projectEmployees.slice(
                                                0,
                                                2
                                            );

                                        const remainingEmployees =
                                            projectEmployees.slice(
                                                2
                                            );

                                        const isExpanded =
                                            expandedProjects.includes(
                                                project.id
                                            );

                                        // IMPORTANT:
                                        // Always calculate status from dates.
                                        const currentStatus =
                                            getProjectStatus(
                                                project.startDate,
                                                project.endDate
                                            );

                                        return (
                                            <tr
                                                key={
                                                    project.id
                                                }
                                                className="align-top transition hover:bg-gray-50"
                                            >

                                                {/* PROJECT */}

                                                <td className="px-6 py-4">

                                                    <p className="font-medium text-gray-800">
                                                        {
                                                            project.projectName
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-400">
                                                        {
                                                            project.projectCode
                                                        }
                                                    </p>

                                                </td>

                                                {/* EMPLOYEES */}

                                                <td className="px-6 py-4">

                                                    <div className="space-y-2">

                                                        {visibleEmployees.map(
                                                            (
                                                                employee
                                                            ) => (
                                                                <EmployeeItem
                                                                    key={
                                                                        employee.employeeId
                                                                    }
                                                                    employee={
                                                                        employee
                                                                    }
                                                                />
                                                            )
                                                        )}

                                                        {isExpanded &&
                                                            remainingEmployees.map(
                                                                (
                                                                    employee
                                                                ) => (
                                                                    <EmployeeItem
                                                                        key={
                                                                            employee.employeeId
                                                                        }
                                                                        employee={
                                                                            employee
                                                                        }
                                                                    />
                                                                )
                                                            )}

                                                        {remainingEmployees.length >
                                                            0 && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    toggleProjectEmployees(
                                                                        project.id
                                                                    )
                                                                }
                                                                className="ml-10 text-xs font-semibold text-blue-600 transition hover:text-blue-800 hover:underline"
                                                            >
                                                                {isExpanded
                                                                    ? "Show less"
                                                                    : `+${remainingEmployees.length} more`}
                                                            </button>
                                                        )}

                                                    </div>

                                                </td>

                                                {/* TEAM MEMBERS */}

                                                <td className="px-6 py-4">

                                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">

                                                        {
                                                            projectEmployees.length
                                                        }{" "}

                                                        {projectEmployees.length ===
                                                        1
                                                            ? "Member"
                                                            : "Members"}

                                                    </span>

                                                </td>

                                                {/* START DATE */}

                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {
                                                        project.startDate ||
                                                        "-"
                                                    }
                                                </td>

                                                {/* END DATE */}

                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {
                                                        project.endDate ||
                                                        "-"
                                                    }
                                                </td>

                                                {/* STATUS */}

                                                <td className="px-6 py-4">

                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                                                            currentStatus
                                                        )}`}
                                                    >
                                                        {
                                                            currentStatus
                                                        }
                                                    </span>

                                                </td>

                                                {/* ACTION */}

                                                <td className="px-6 py-4">

                                                    <div className="flex items-center gap-2">

                                                        {/* REASSIGN */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleReassign(
                                                                    project
                                                                )
                                                            }
                                                            className="rounded-lg border border-blue-600 px-3 py-2 text-xs font-medium text-blue-600 transition hover:bg-blue-600 hover:text-white"
                                                        >
                                                            Reassign
                                                        </button>

                                                        {/* DELETE */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteProject(
                                                                    project
                                                                )
                                                            }
                                                            className="rounded-lg border border-red-600 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-600 hover:text-white"
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>
                                        );
                                    }
                                )
                            ) : (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="px-6 py-10 text-center"
                                    >

                                        <p className="text-sm font-medium text-gray-700">
                                            No projects found.
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            Try searching with
                                            another project,
                                            employee or
                                            project code.
                                        </p>

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};

export default AllProjects;