import { useState, useMemo } from "react";
import {useLocation, useNavigate} from 'react-router-dom';
import employees from "../../data/mockEmployees";
import { updateProjectEmployees } from "../../utils/projectStorage";

const ReassignProject = () => {
    const navigate = useNavigate();
    const location = useLocation();

    //PROJECT
    const project = location.state?.project;

    //STATES
    const [selectedEmployees, setSelectedEmployees] = useState(project?.employeeIds || []);
    const [employeeSearch, setEmployeeSearch] = useState("");

    //HELPERS
    const getEmployeeName = (employee)=>{
        const firstName = employee.personalDetails?.firstName || [];

        const lastName = employee.personalDetails?.lastName || [];

        return `${firstName} ${lastName}`.trim();
    };

    //INITIALS
    const getInitials = (employee)=>{
        const firstName = employee.personalDetails?.firstName || [];

        const lastName = employee.personalDetails?.lastName || [];

        return `${firstName[0] || ""} ${lastName[0] || ""}`.trim();
    };

    //Convert skill value to array
    const normalizeSkills = (skills) => {
        if(!skills) {
            return [];
        }

        if(Array.isArray(skills)){
            return skills.map((skill)=>{
                if(typeof skill === "string"){
                    return skill.trim();
                }

                if(skill?.skillName){
                    return skill.skillName.trim();
                }

                if(skill?.name){
                    return skill.name.trim();
                }

                if(skill?.skill){
                    return skill.skill.trim();
                }

                if(skill?.title){
                    return skill.title.trim();
                }
                return "";
            })
            .filter(Boolean);
        }

        if(typeof skills === "string"){
            return skills.split(","),map((skill)=> skill.trim())
            .filter("Boolean");
        }
        return [];
    }

    //Technical Skills
    const getTechnicalSkills = (employee)=>{
        const technicalSkills =
            employee.technicalSkills ??
            employee.technicalSkill ??
            employee.skills ??
            employee.primarySkills ??
            employee.primarySkill ??
            employee.personalDetails?.technicalSkills ??
            employee.personalDetails?.technicalSkill ??
            employee.personalDetails?.primarySkills ??
            employee.personalDetails?.primarySkill ??
            [];

        return normalizeSkills(
            technicalSkills
        );
    };

    // =========================================================
    // GET SKILLS AS SEARCHABLE TEXT
    // =========================================================

    const getTechnicalSkillsText = (employee) => {
        return getTechnicalSkills(employee)
            .join(" ")
            .toLowerCase();
    };

    // =========================================================
    // CHECK WHETHER CHANGES WERE MADE
    // =========================================================

    const hasChanges = useMemo(() => {

        if (!project) {
            return false;
        }

        const originalEmployees =
            project.employeeIds || [];

        if (
            originalEmployees.length !==
            selectedEmployees.length
        ) {
            return true;
        }

        return originalEmployees.some(
            (employeeId) =>
                !selectedEmployees.includes(
                    employeeId
                )
        );

    }, [
        project,
        selectedEmployees,
    ]);

    // =========================================================
    // CURRENT ASSIGNED EMPLOYEES
    // =========================================================

    const currentEmployees = useMemo(() => {

        return employees.filter(
            (employee) =>
                selectedEmployees.includes(
                    employee.employeeId
                )
        );

    }, [
        selectedEmployees,
    ]);

    // SEARCH EMPLOYEES

    const availableEmployees = useMemo(() => {

        const searchValue =
            employeeSearch
                .toLowerCase()
                .trim();

        return employees.filter(
            (employee) => {

                const isAssigned =
                    selectedEmployees.includes(
                        employee.employeeId
                    );

                // -------------------------------------------------
                // NO SEARCH
                // -------------------------------------------------

                if (!searchValue) {
                    return !isAssigned;
                }

                // -------------------------------------------------
                // EMPLOYEE NAME
                // -------------------------------------------------

                const employeeName =
                    getEmployeeName(employee)
                        .toLowerCase();

                // -------------------------------------------------
                // EMPLOYEE ID
                // -------------------------------------------------

                const employeeId =
                    employee.employeeId
                        .toLowerCase();

                // -------------------------------------------------
                // TECHNICAL SKILLS
                // -------------------------------------------------

                const technicalSkills =
                    getTechnicalSkillsText(
                        employee
                    );

                // -------------------------------------------------
                // SEARCH
                // -------------------------------------------------

                return (
                    employeeName.includes(
                        searchValue
                    ) ||
                    employeeId.includes(
                        searchValue
                    ) ||
                    technicalSkills.includes(
                        searchValue
                    )
                );
            }
        );

    }, [
        employeeSearch,
        selectedEmployees,
    ]);

    // =========================================================
    // TOGGLE EMPLOYEE
    // =========================================================

    const toggleEmployee = (employeeId) => {

        setSelectedEmployees(
            (previous) => {

                const alreadySelected =
                    previous.includes(
                        employeeId
                    );

                // =================================================
                // REMOVE
                // =================================================

                if (alreadySelected) {

                    if (
                        previous.length <= 2
                    ) {
                        alert(
                            "At least 2 employees are required for every project."
                        );

                        return previous;
                    }

                    return previous.filter(
                        (id) =>
                            id !== employeeId
                    );
                }

                // =================================================
                // ADD
                // =================================================

                return [
                    ...previous,
                    employeeId,
                ];
            }
        );
    };

    // =========================================================
    // SAVE CHANGES
    // =========================================================

    const handleSaveChanges = () => {

        // -----------------------------------------------------
        // NO CHANGES
        // -----------------------------------------------------

        if (!hasChanges) {
            return;
        }

        // -----------------------------------------------------
        // MINIMUM EMPLOYEES
        // -----------------------------------------------------

        if (
            selectedEmployees.length < 2
        ) {
            alert(
                "At least 2 employees are required for every project."
            );

            return;
        }

        // -----------------------------------------------------
        // UPDATE PROJECT STORAGE
        // -----------------------------------------------------

        const updatedProjects =
            updateProjectEmployees(
                project.id,
                selectedEmployees
            );

        // -----------------------------------------------------
        // UPDATE FAILED
        // -----------------------------------------------------

        if (!updatedProjects) {

            alert(
                "Failed to update project employees."
            );

            return;
        }

        // -----------------------------------------------------
        // SUCCESS
        // -----------------------------------------------------

        alert(
            "Project employees updated successfully."
        );

        // -----------------------------------------------------
        // BACK
        // -----------------------------------------------------

        navigate(
            "/admin/createnewproject"
        );
    };

    // =========================================================
    // PROJECT NOT FOUND
    // =========================================================

    if (!project) {

        return (
            <div className="min-h-screen bg-gray-100 p-6">

                <div className="rounded-xl bg-white p-8 text-center shadow-sm">

                    <h2 className="text-xl font-semibold text-gray-800">
                        Project Not Found
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        No project information was provided.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/assignproject"
                            )
                        }
                        className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        Back to Assign Projects
                    </button>

                </div>

            </div>
        );
    }

    // =========================================================
    // EMPLOYEE ITEM
    // =========================================================

    const EmployeeItem = ({
        employee,
        type,
    }) => {

        const fullName =
            getEmployeeName(employee);

        const initials =
            getInitials(employee);

        const technicalSkills =
            getTechnicalSkills(employee);

        const isAssigned =
            selectedEmployees.includes(
                employee.employeeId
            );

        const isAssignedSection =
            type === "assigned";

        return (
            <div
                className={`rounded-lg border p-4 transition ${
                    isAssigned
                        ? "border-blue-100 bg-blue-50"
                        : "border-gray-100 hover:border-blue-200 hover:bg-blue-50"
                }`}
            >

                {/* =================================================
                    TOP SECTION
                ================================================= */}

                <div className="flex items-start justify-between gap-4">

                    {/* EMPLOYEE */}

                    <div className="flex min-w-0 items-center gap-3">

                        {/* AVATAR */}

                        <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                                isAssigned
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                        >
                            {initials}
                        </div>

                        {/* NAME + ID */}

                        <div className="min-w-0">

                            <p className="truncate text-sm font-semibold text-gray-800">
                                {fullName ||
                                    "Unknown Employee"}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                {employee.employeeId}
                            </p>

                        </div>

                    </div>

                    {/* =================================================
                        ACTION
                    ================================================= */}

                    {isAssigned ? (

                        isAssignedSection ? (

                            <button
                                type="button"
                                onClick={() =>
                                    toggleEmployee(
                                        employee.employeeId
                                    )
                                }
                                className="shrink-0 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                            >
                                Remove
                            </button>

                        ) : (

                            <span className="shrink-0 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-medium text-blue-600">
                                Already Assigned
                            </span>

                        )

                    ) : (

                        <button
                            type="button"
                            onClick={() =>
                                toggleEmployee(
                                    employee.employeeId
                                )
                            }
                            className="shrink-0 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700"
                        >
                            Assign
                        </button>

                    )}

                </div>

                {/* =================================================
                    ALREADY ASSIGNED
                ================================================= */}

                {isAssigned &&
                    !isAssignedSection && (

                        <div className="mt-2 ml-[52px]">

                            <p className="text-xs font-medium text-blue-600">
                                Already assigned to this project
                            </p>

                        </div>
                    )}

                {/* =================================================
                    TECHNICAL SKILLS
                ================================================= */}

                <div className="mt-4 border-t border-gray-100 pt-3">

                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                        Technical Skills
                    </p>

                    {technicalSkills.length > 0 ? (

                        <div className="flex flex-wrap gap-1.5">

                            {technicalSkills.map(
                                (skill, index) => (

                                    <span
                                        key={`${skill}-${index}`}
                                        className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                                            isAssigned
                                                ? "bg-white text-blue-700 ring-1 ring-blue-100"
                                                : "bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                        {skill}
                                    </span>

                                )
                            )}

                        </div>

                    ) : (

                        <p className="text-xs text-gray-400">
                            No technical skills added
                        </p>

                    )}

                </div>

            </div>
        );
    };

    // =========================================================
    // AVAILABLE EMPLOYEE COUNT
    // =========================================================

    const availableEmployeeCount =
        employees.filter(
            (employee) =>
                !selectedEmployees.includes(
                    employee.employeeId
                )
        ).length;

    // =========================================================
    // RETURN
    // =========================================================

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/assignproject"
                            )
                        }
                        className="mb-3 text-sm font-medium text-blue-600 transition hover:text-blue-800"
                    >
                        ← Back to Assign Projects
                    </button>

                    <h1 className="text-2xl font-bold text-gray-800">
                        Reassign Project
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage employees assigned to this project.
                    </p>

                </div>

                {/* PROJECT CODE */}

                <div className="rounded-lg bg-blue-50 px-4 py-3">

                    <p className="text-xs text-blue-500">
                        Project Code
                    </p>

                    <p className="text-sm font-semibold text-blue-700">
                        {project.projectCode}
                    </p>

                </div>

            </div>

            {/* =================================================
                PROJECT INFORMATION
            ================================================= */}

            <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

                <div className="mb-5">

                    <h2 className="text-lg font-semibold text-gray-800">
                        Project Information
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        View project details before changing
                        the assigned employees.
                    </p>

                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    {/* PROJECT NAME */}

                    <div>

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Project Name
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-800">
                            {project.projectName}
                        </p>

                    </div>

                    {/* PROJECT CODE */}

                    <div>

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Project Code
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-800">
                            {project.projectCode}
                        </p>

                    </div>

                    {/* START DATE */}

                    <div>

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Start Date
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-800">
                            {project.startDate}
                        </p>

                    </div>

                    {/* STATUS */}

                    <div>

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Status
                        </p>

                        <span
                            className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                                project.status === "Active"
                                    ? "bg-green-100 text-green-700"
                                    : project.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-blue-100 text-blue-700"
                            }`}
                        >
                            {project.status}
                        </span>

                    </div>

                </div>

            </div>
            
            {/* =================================================
                EMPLOYEE MANAGEMENT
            ================================================= */}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* =================================================
                    ASSIGNED EMPLOYEES
                ================================================= */}

                <div className="rounded-xl bg-white shadow-sm">

                    <div className="border-b border-gray-100 px-6 py-5">

                        <div className="flex items-center justify-between gap-3">

                            <div>

                                <h2 className="text-lg font-semibold text-gray-800">
                                    Assigned Employees
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Employees currently assigned
                                    to this project.
                                </p>

                            </div>

                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                {currentEmployees.length}
                            </span>

                        </div>

                    </div>

                    <div className="max-h-[500px] overflow-y-auto p-4">

                        {currentEmployees.length > 0 ? (

                            <div className="space-y-3">

                                {currentEmployees.map(
                                    (employee) => (

                                        <EmployeeItem
                                            key={
                                                employee.employeeId
                                            }
                                            employee={employee}
                                            type="assigned"
                                        />

                                    )
                                )}

                            </div>

                        ) : (

                            <div className="rounded-lg border border-dashed border-gray-300 px-5 py-10 text-center">

                                <p className="text-sm font-medium text-gray-600">
                                    No employees assigned
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                    Please assign at least
                                    2 employees.
                                </p>

                            </div>

                        )}

                    </div>

                </div>

                {/* =================================================
                    AVAILABLE EMPLOYEES
                ================================================= */}

                <div className="rounded-xl bg-white shadow-sm">

                    <div className="border-b border-gray-100 px-6 py-5">

                        <div className="flex items-center justify-between gap-3">

                            <div>

                                <h2 className="text-lg font-semibold text-gray-800">
                                    Available Employees
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Search employees by name,
                                    ID or technical skill.
                                </p>

                            </div>

                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                                {availableEmployeeCount}
                            </span>

                        </div>

                        {/* =================================================
                            SEARCH
                        ================================================= */}

                        <div className="mt-4">

                            <div className="relative">

                                <input
                                    type="text"
                                    value={employeeSearch}
                                    onChange={(e) =>
                                        setEmployeeSearch(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search by name, ID or skill e.g. MERN, Python..."
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />

                            </div>

                        </div>

                        <p className="mt-2 text-xs text-gray-400">
                            Search supports employee name,
                            employee ID and technical skills
                            such as MERN, React, Node.js,
                            Python or SQL.
                        </p>

                    </div>

                    {/* =================================================
                        RESULTS
                    ================================================= */}

                    <div className="max-h-[500px] overflow-y-auto p-4">

                        {availableEmployees.length > 0 ? (

                            <div className="space-y-3">

                                {availableEmployees.map(
                                    (employee) => (

                                        <EmployeeItem
                                            key={
                                                employee.employeeId
                                            }
                                            employee={employee}
                                            type={
                                                selectedEmployees.includes(
                                                    employee.employeeId
                                                )
                                                    ? "assigned-search"
                                                    : "available"
                                            }
                                        />

                                    )
                                )}

                            </div>

                        ) : (

                            <div className="rounded-lg border border-dashed border-gray-300 px-5 py-10 text-center">

                                {employeeSearch.trim() ? (

                                    <>

                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">

                                            <span className="text-lg font-semibold text-gray-400">
                                                ?
                                            </span>

                                        </div>

                                        <p className="mt-3 text-sm font-semibold text-gray-600">
                                            No Employee Found
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            No employee matches "
                                            {employeeSearch}"
                                        </p>

                                    </>

                                ) : (

                                    <>

                                        <p className="text-sm font-medium text-gray-600">
                                            No employees are
                                            available
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            All employees are
                                            currently assigned
                                            to this project.
                                        </p>

                                    </>

                                )}

                            </div>

                        )}

                    </div>

                </div>

            </div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="mt-6 flex flex-col-reverse gap-3 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <p className="text-sm font-medium text-gray-700">
                        {selectedEmployees.length}
                        {" "}
                        employees assigned
                    </p>

                    <p
                        className={`mt-1 text-xs ${
                            selectedEmployees.length >= 2
                                ? "text-green-600"
                                : "text-red-500"
                        }`}
                    >
                        {selectedEmployees.length >= 2
                            ? hasChanges
                                ? "You have unsaved changes."
                                : "No changes made."
                            : "Minimum 2 employees are required."}
                    </p>

                </div>

                <div className="flex gap-3">

                    {/* CANCEL */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/assignproject"
                            )
                        }
                        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    {/* SAVE */}

                    <button
                        type="button"
                        disabled={!hasChanges}
                        onClick={handleSaveChanges}
                        className={`rounded-lg px-5 py-2.5 text-sm font-medium transition ${
                            hasChanges
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "cursor-not-allowed bg-gray-200 text-gray-400"
                        }`}
                    >
                        Save Changes
                    </button>

                </div>

            </div>

        </div>
    );
};

export default ReassignProject;
