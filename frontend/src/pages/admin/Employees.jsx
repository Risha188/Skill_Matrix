import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
    useSearchParams,
} from "react-router-dom";

import employees from "../../data/mockEmployees";

import {
    getEmployeesWithStatus,
    updateEmployeeStatus,
} from "../../data/employeeStatus";

const Employees = () => {
    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();

    const [search, setSearch] =
        useState("");

    const [
        employeeList,
        setEmployeeList,
    ] = useState([]);

    // =========================================================
    // LOAD EMPLOYEES
    // =========================================================

    useEffect(() => {
        const updatedEmployees =
            getEmployeesWithStatus();

        setEmployeeList(
            updatedEmployees
        );
    }, []);

    // =========================================================
    // STATUS FILTER
    // =========================================================

    const statusFilter =
        searchParams.get(
            "status"
        );

    // =========================================================
    // EMPLOYEE COUNTS
    // =========================================================

    const totalEmployees =
        employeeList.length;

    const activeEmployees =
        employeeList.filter(
            (employee) =>
                employee.presentStatus ===
                "Active"
        ).length;

    const inactiveEmployees =
        employeeList.filter(
            (employee) =>
                employee.presentStatus ===
                "Inactive"
        ).length;

    // =========================================================
    // SEARCH + STATUS FILTER
    // =========================================================

    const filteredEmployees =
        useMemo(() => {
            const searchValue =
                search
                    .trim()
                    .toLowerCase();

            return employeeList.filter(
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

                    const matchesSearch =
                        !searchValue ||
                        fullName.includes(
                            searchValue
                        ) ||
                        employee.employeeId
                            .toLowerCase()
                            .includes(
                                searchValue
                            ) ||
                        employee
                            .personalDetails
                            ?.email
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            );

                    const matchesStatus =
                        !statusFilter ||
                        employee.presentStatus
                            .toLowerCase() ===
                            statusFilter;

                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );
        }, [
            employeeList,
            search,
            statusFilter,
        ]);

    // =========================================================
    // CHANGE EMPLOYEE STATUS
    // =========================================================

    const handleStatusChange = (
        employeeId,
        newStatus
    ) => {
        const updatedStatuses =
            updateEmployeeStatus(
                employeeId,
                newStatus
            );

        const updatedEmployees =
            employeeList.map(
                (employee) => ({
                    ...employee,

                    presentStatus:
                        updatedStatuses[
                            employee
                                .employeeId
                        ] ||
                        employee.presentStatus,
                })
            );

        setEmployeeList(
            updatedEmployees
        );
    };

    // =========================================================
    // SHOW ALL
    // =========================================================

    const showAllEmployees = () => {
        setSearchParams({});
    };

    // =========================================================
    // SHOW ACTIVE
    // =========================================================

    const showActiveEmployees = () => {
        setSearchParams({
            status: "active",
        });
    };

    // =========================================================
    // SHOW INACTIVE
    // =========================================================

    const showInactiveEmployees = () => {
        setSearchParams({
            status: "inactive",
        });
    };

    return (
        <div className="min-h-screen">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-6">

                <h1 className="text-2xl font-bold text-gray-800">
                    Employees
                </h1>

                <p className="mt-1 text-gray-500">
                    View and manage employee
                    information and status.
                </p>

            </div>

            {/* =================================================
                SUMMARY CARDS
            ================================================= */}

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

                {/* TOTAL */}

                <button
                    type="button"
                    onClick={
                        showAllEmployees
                    }
                    className={`rounded-xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                        !statusFilter
                            ? "ring-2 ring-blue-500"
                            : ""
                    }`}
                >

                    <p className="text-sm font-medium text-gray-500">
                        Total Employees
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-blue-600">
                        {totalEmployees}
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                        All employees
                    </p>

                </button>

                {/* ACTIVE */}

                <button
                    type="button"
                    onClick={
                        showActiveEmployees
                    }
                    className={`rounded-xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                        statusFilter ===
                        "active"
                            ? "ring-2 ring-green-500"
                            : ""
                    }`}
                >

                    <p className="text-sm font-medium text-gray-500">
                        Active Employees
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-green-600">
                        {activeEmployees}
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                        Currently active
                    </p>

                </button>

                {/* INACTIVE */}

                <button
                    type="button"
                    onClick={
                        showInactiveEmployees
                    }
                    className={`rounded-xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                        statusFilter ===
                        "inactive"
                            ? "ring-2 ring-red-500"
                            : ""
                    }`}
                >

                    <p className="text-sm font-medium text-gray-500">
                        Inactive Employees
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-red-600">
                        {inactiveEmployees}
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                        Currently inactive
                    </p>

                </button>

            </div>

            {/* =================================================
                ACTIVE FILTER MESSAGE
            ================================================= */}

            {statusFilter && (
                <div className="mb-6 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">

                    <div>

                        <p className="text-sm font-semibold text-blue-800">
                            Showing{" "}
                            {statusFilter ===
                            "active"
                                ? "active"
                                : "inactive"}{" "}
                            employees
                        </p>

                        <p className="mt-1 text-xs text-blue-600">
                            {filteredEmployees.length}{" "}
                            employee
                            {filteredEmployees.length !==
                            1
                                ? "s"
                                : ""}{" "}
                            found
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={
                            showAllEmployees
                        }
                        className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                    >
                        Show All
                    </button>

                </div>
            )}

            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">

                <div className="max-w-md">

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target
                                    .value
                            )
                        }
                        placeholder="Search employee by name, ID or email..."
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />

                </div>

                {search && (
                    <p className="mt-2 text-xs text-gray-500">
                        {
                            filteredEmployees.length
                        }{" "}
                        employee
                        {filteredEmployees.length !==
                        1
                            ? "s"
                            : ""}{" "}
                        found
                    </p>
                )}

            </div>

            {/* =================================================
                EMPLOYEE TABLE
            ================================================= */}

            <div className="overflow-x-auto rounded-xl bg-white shadow-sm">

                <table className="w-full min-w-[1100px]">

                    <thead className="bg-gray-50">

                        <tr>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Employee ID
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Name
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Email
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Primary Skills
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Secondary Skills
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Status
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredEmployees.length >
                        0 ? (
                            filteredEmployees.map(
                                (
                                    employee
                                ) => (
                                    <tr
                                        key={
                                            employee.employeeId
                                        }
                                        className="border-t transition hover:bg-gray-50"
                                    >

                                        {/* ID */}

                                        <td className="px-6 py-4">

                                            <Link
                                                to={`/admin/employees/${employee.employeeId}`}
                                                className="font-semibold text-blue-600 hover:underline"
                                            >
                                                {
                                                    employee.employeeId
                                                }
                                            </Link>

                                        </td>

                                        {/* NAME */}

                                        <td className="px-6 py-4">

                                            <p className="font-medium text-gray-800">
                                                {
                                                    employee
                                                        .personalDetails
                                                        ?.firstName
                                                }{" "}
                                                {
                                                    employee
                                                        .personalDetails
                                                        ?.lastName
                                                }
                                            </p>

                                        </td>

                                        {/* EMAIL */}

                                        <td className="px-6 py-4 text-sm text-gray-600">

                                            {
                                                employee
                                                    .personalDetails
                                                    ?.email
                                            }

                                        </td>

                                        {/* PRIMARY SKILLS */}

                                        <td className="px-6 py-4">

                                            <div className="flex max-w-xs flex-wrap gap-2">

                                                {employee.primarySkills?.map(
                                                    (
                                                        skill,
                                                        index
                                                    ) => (
                                                        <span
                                                            key={
                                                                index
                                                            }
                                                            className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700"
                                                        >
                                                            {
                                                                skill
                                                            }
                                                        </span>
                                                    )
                                                )}

                                            </div>

                                        </td>

                                        {/* SECONDARY SKILLS */}

                                        <td className="px-6 py-4">

                                            <div className="flex max-w-xs flex-wrap gap-2">

                                                {employee.secondarySkills?.map(
                                                    (
                                                        skill,
                                                        index
                                                    ) => (
                                                        <span
                                                            key={
                                                                index
                                                            }
                                                            className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700"
                                                        >
                                                            {
                                                                skill
                                                            }
                                                        </span>
                                                    )
                                                )}

                                            </div>

                                        </td>

                                        {/* STATUS */}

                                        <td className="px-6 py-4">

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                    employee.presentStatus ===
                                                    "Active"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {
                                                    employee.presentStatus
                                                }
                                            </span>

                                        </td>

                                        {/* ACTION */}

                                        <td className="px-6 py-4">

                                            {employee.presentStatus ===
                                            "Active" ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            employee.employeeId,
                                                            "Inactive"
                                                        )
                                                    }
                                                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-600 hover:text-white"
                                                >
                                                    Deactivate
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            employee.employeeId,
                                                            "Active"
                                                        )
                                                    }
                                                    className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-600 hover:text-white"
                                                >
                                                    Activate
                                                </button>
                                            )}

                                        </td>

                                    </tr>
                                )
                            )
                        ) : (
                            <tr>

                                <td
                                    colSpan="7"
                                    className="px-6 py-12 text-center"
                                >

                                    <p className="text-sm font-medium text-gray-700">
                                        No employees
                                        found
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Try changing
                                        the search
                                        or status
                                        filter.
                                    </p>

                                </td>

                            </tr>
                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default Employees;