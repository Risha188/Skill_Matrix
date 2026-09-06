import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
    const location = useLocation();

    // ==========================================
    // EMPLOYEE AUTHENTICATION
    // ==========================================

    const employeeToken =
        sessionStorage.getItem("employeeToken");

    const employeeRole =
        sessionStorage.getItem("employeeUserRole");

    const employeeAuthenticated =
        sessionStorage.getItem(
            "employeeAuthenticated"
        );

    // ==========================================
    // DEBUG
    // ==========================================

    console.log("=================================");
    console.log("EMPLOYEE PROTECTED ROUTE");
    console.log(
        "Current path:",
        location.pathname
    );
    console.log(
        "Employee token:",
        employeeToken
            ? "FOUND"
            : "NOT FOUND"
    );
    console.log(
        "Employee role:",
        employeeRole
    );
    console.log(
        "Employee authenticated:",
        employeeAuthenticated
    );
    console.log("=================================");

    // ==========================================
    // CHECK EMPLOYEE LOGIN
    // ==========================================

    if (!employeeToken) {
        console.warn(
            "Employee token not found."
        );

        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location.pathname,
                }}
            />
        );
    }

    // ==========================================
    // CHECK EMPLOYEE ROLE
    // ==========================================

    if (
        employeeRole &&
        employeeRole !== "employee"
    ) {
        console.warn(
            "Invalid employee role:",
            employeeRole
        );

        sessionStorage.removeItem(
            "employeeToken"
        );

        sessionStorage.removeItem(
            "employeeUser"
        );

        sessionStorage.removeItem(
            "employeeUserId"
        );

        sessionStorage.removeItem(
            "employeeUserEmail"
        );

        sessionStorage.removeItem(
            "employeeUserRole"
        );

        sessionStorage.removeItem(
            "employeeAuthenticated"
        );

        sessionStorage.removeItem(
            "employeeId"
        );

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    // ==========================================
    // EMPLOYEE IS AUTHENTICATED
    // ==========================================

    return <Outlet />;
};

export default ProtectedRoute;