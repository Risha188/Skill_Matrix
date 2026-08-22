import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import { useAdmin } from "../../context/AdminContext.jsx";

import {
    getEmployeesWithStatus,
} from "../../data/employeeStatus";

import projectDetails from "../../data/projectDetails";

const AdminDashboard = () => {
    const navigate = useNavigate();

    const {
        admins,
    } = useAdmin();

    const [
        dashboardEmployees,
        setDashboardEmployees,
    ] = useState([]);

    // =========================================================
    // LOAD EMPLOYEES
    // =========================================================

    const loadEmployees = () => {
        const updatedEmployees =
            getEmployeesWithStatus();

        setDashboardEmployees(
            updatedEmployees
        );
    };

    useEffect(() => {
        loadEmployees();

        const handleStorageChange = () => {
            loadEmployees();
        };

        window.addEventListener(
            "storage",
            handleStorageChange
        );

        return () => {
            window.removeEventListener(
                "storage",
                handleStorageChange
            );
        };
    }, []);

    // =========================================================
    // EMPLOYEE COUNTS
    // =========================================================

    const totalEmployees =
        dashboardEmployees.length;

    const activeEmployees =
        dashboardEmployees.filter(
            (employee) =>
                employee.presentStatus ===
                "Active"
        ).length;

    const inactiveEmployees =
        dashboardEmployees.filter(
            (employee) =>
                employee.presentStatus ===
                "Inactive"
        );

    // =========================================================
    // PROJECT COUNTS
    // =========================================================

    const totalProjects =
        projectDetails.length;

    const activeProjects =
        projectDetails.filter(
            (project) =>
                project.status ===
                "Active"
        ).length;

    const completedProjects =
        projectDetails.filter(
            (project) =>
                project.status ===
                "Completed"
        ).length;

    const pendingProjects =
        projectDetails.filter(
            (project) =>
                project.status ===
                "Pending"
        ).length;

    // =========================================================
    // DASHBOARD STATS
    // =========================================================

    const stats = [
        {
            title: "Total Employees",

            value: totalEmployees,

            description:
                "Total employees in the organization",

            bg: "bg-blue-50",

            valueColor:
                "text-blue-700",

            onClick: () =>
                navigate(
                    "/admin/employees"
                ),
        },

        {
            title: "Active Employees",

            value: activeEmployees,

            description:
                "Currently active employees",

            bg: "bg-green-50",

            valueColor:
                "text-green-700",

            onClick: () =>
                navigate(
                    "/admin/employees?status=active"
                ),
        },

        {
            title: "Total Projects",

            value: totalProjects,

            description:
                `${activeProjects} active, ${completedProjects} completed, ${pendingProjects} pending`,

            bg: "bg-purple-50",

            valueColor:
                "text-purple-700",

            onClick: () =>
                navigate(
                    "/admin/allprojects"
                ),
        },

        {
            title: "Inactive Employees",

            value: inactiveEmployees.length,

            description:
                "Employees currently inactive",

            bg: "bg-red-50",

            valueColor:
                "text-red-700",

            onClick: () =>
                navigate(
                    "/admin/employees?status=inactive"
                ),
        },
    ];

    return (
        <div className="space-y-8">

            {/* =================================================
                HEADER
            ================================================= */}

            <div>
                <h1 className="text-3xl font-bold text-slate-900">
                    Dashboard
                </h1>

                <p className="mt-1 text-slate-500">
                    Welcome to the SkillMatrix
                    administration panel.
                </p>
            </div>

            {/* =================================================
                MAIN STAT CARDS
            ================================================= */}

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

                {stats.map((stat) => (
                    <button
                        key={stat.title}
                        type="button"
                        onClick={stat.onClick}
                        className={`w-full rounded-2xl ${stat.bg} p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg`}
                    >

                        <p className="text-sm font-medium text-slate-500">
                            {stat.title}
                        </p>

                        <h2
                            className={`mt-2 text-3xl font-bold ${stat.valueColor}`}
                        >
                            {stat.value}
                        </h2>

                        <p className="mt-2 text-xs text-slate-500">
                            {stat.description}
                        </p>

                        <p className="mt-4 text-xs font-semibold text-slate-600">
                            Click to view details
                        </p>

                    </button>
                ))}

            </div>

            {/* =================================================
                PROJECT + ADMINISTRATOR OVERVIEW
            ================================================= */}

            <div className="grid gap-6 lg:grid-cols-2">

                {/* =================================================
                    PROJECT OVERVIEW
                ================================================= */}

                <div className="rounded-2xl bg-white p-6 shadow-sm">

                    <div className="mb-6">

                        <h2 className="text-lg font-bold text-slate-900">
                            Project Overview
                        </h2>

                        <p className="text-sm text-slate-500">
                            Current project status
                        </p>

                    </div>

                    <div className="grid grid-cols-3 gap-4">

                        {/* ACTIVE */}

                        <div className="rounded-xl bg-green-50 p-4">

                            <p className="text-xs font-medium text-slate-500">
                                Active
                            </p>

                            <p className="mt-2 text-2xl font-bold text-green-700">
                                {activeProjects}
                            </p>

                        </div>

                        {/* COMPLETED */}

                        <div className="rounded-xl bg-blue-50 p-4">

                            <p className="text-xs font-medium text-slate-500">
                                Completed
                            </p>

                            <p className="mt-2 text-2xl font-bold text-blue-700">
                                {completedProjects}
                            </p>

                        </div>

                        {/* PENDING */}

                        <div className="rounded-xl bg-orange-50 p-4">

                            <p className="text-xs font-medium text-slate-500">
                                Pending
                            </p>

                            <p className="mt-2 text-2xl font-bold text-orange-600">
                                {pendingProjects}
                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/allprojects"
                            )
                        }
                        className="mt-6 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                        View All Projects
                    </button>

                </div>

                {/* =================================================
                    ADMINISTRATORS
                ================================================= */}

                <div className="rounded-2xl bg-white p-6 shadow-sm">

                    <div className="mb-6">

                        <h2 className="text-lg font-bold text-slate-900">
                            Administrators
                        </h2>

                        <p className="text-sm text-slate-500">
                            Administrator accounts
                        </p>

                    </div>

                    <div className="space-y-3">

                        {admins.map(
                            (admin) => (
                                <div
                                    key={
                                        admin.id
                                    }
                                    className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
                                >

                                    <div>

                                        <p className="font-semibold text-slate-800">
                                            {
                                                admin.name
                                            }
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            {
                                                admin.email
                                            }
                                        </p>

                                    </div>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                            admin.status ===
                                            "Active"
                                                ? "bg-green-100 text-green-700"
                                                : admin.status ===
                                                  "Pending"
                                                ? "bg-orange-100 text-orange-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {
                                            admin.status
                                        }
                                    </span>

                                </div>
                            )
                        )}

                    </div>

                </div>

            </div>

            {/* =================================================
                INACTIVE EMPLOYEES
            ================================================= */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">

                <div className="mb-6 flex items-center justify-between">

                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Inactive Employees
                        </h2>

                        <p className="text-sm text-slate-500">
                            Employees who are currently inactive
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/employees?status=inactive"
                            )
                        }
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                        View All
                    </button>

                </div>

                {inactiveEmployees.length ===
                0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center">

                        <p className="font-semibold text-slate-700">
                            No inactive employees
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                            All employees are currently active.
                        </p>

                    </div>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                        {inactiveEmployees.map(
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
                                    `${firstName} ${lastName}`.trim();

                                return (
                                    <button
                                        key={
                                            employee.employeeId
                                        }
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                `/admin/employees/${employee.employeeId}`
                                            )
                                        }
                                        className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-red-200 hover:bg-red-50 hover:shadow-sm"
                                    >

                                        <div className="flex items-center justify-between">

                                            <div>

                                                <p className="font-semibold text-slate-800">
                                                    {
                                                        fullName
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {
                                                        employee.employeeId
                                                    }
                                                </p>

                                            </div>

                                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                                Inactive
                                            </span>

                                        </div>

                                        <p className="mt-3 text-xs text-slate-500">
                                            {
                                                employee
                                                    .personalDetails
                                                    ?.email
                                            }
                                        </p>

                                    </button>
                                );
                            }
                        )}

                    </div>
                )}

            </div>

        </div>
    );
};

export default AdminDashboard;