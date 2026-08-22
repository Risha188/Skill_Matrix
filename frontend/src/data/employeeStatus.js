import employees from "./mockEmployees";

const EMPLOYEE_STATUS_STORAGE_KEY =
    "skillmatrix_employee_status";

/*
|--------------------------------------------------------------------------
| Get stored employee statuses
|--------------------------------------------------------------------------
| Example:
| {
|   EMP001: "Active",
|   EMP002: "Inactive"
| }
*/

export const getEmployeeStatuses = () => {
    const storedStatuses =
        localStorage.getItem(
            EMPLOYEE_STATUS_STORAGE_KEY
        );

    if (!storedStatuses) {
        return {};
    }

    try {
        return JSON.parse(storedStatuses);
    } catch (error) {
        console.error(
            "Failed to read employee statuses:",
            error
        );

        return {};
    }
};

/*
|--------------------------------------------------------------------------
| Initialize employee statuses
|--------------------------------------------------------------------------
| If no status has been stored yet, use presentStatus
| from mockEmployees.
*/

export const initializeEmployeeStatuses = () => {
    const existingStatuses =
        getEmployeeStatuses();

    const initializedStatuses = {
        ...existingStatuses,
    };

    employees.forEach((employee) => {
        if (
            !initializedStatuses[
                employee.employeeId
            ]
        ) {
            initializedStatuses[
                employee.employeeId
            ] = employee.presentStatus;
        }
    });

    localStorage.setItem(
        EMPLOYEE_STATUS_STORAGE_KEY,
        JSON.stringify(
            initializedStatuses
        )
    );

    return initializedStatuses;
};

/*
|--------------------------------------------------------------------------
| Update employee status
|--------------------------------------------------------------------------
*/

export const updateEmployeeStatus = (
    employeeId,
    status
) => {
    const currentStatuses =
        getEmployeeStatuses();

    const updatedStatuses = {
        ...currentStatuses,

        [employeeId]: status,
    };

    localStorage.setItem(
        EMPLOYEE_STATUS_STORAGE_KEY,
        JSON.stringify(
            updatedStatuses
        )
    );

    return updatedStatuses;
};

/*
|--------------------------------------------------------------------------
| Get employee with latest status
|--------------------------------------------------------------------------
*/

export const getEmployeesWithStatus = () => {
    const statuses =
        initializeEmployeeStatuses();

    return employees.map((employee) => ({
        ...employee,

        presentStatus:
            statuses[
                employee.employeeId
            ] ||
            employee.presentStatus,
    }));
};

export default EMPLOYEE_STATUS_STORAGE_KEY;