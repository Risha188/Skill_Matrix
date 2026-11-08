
import React from "react";
import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom";

const ProtectedRoute = () => {
    const location = useLocation();

    const token = sessionStorage.getItem("employeeToken");
    const role = (
        sessionStorage.getItem("employeeUserRole") || ""
    ).trim().toLowerCase();

    const authenticated =
        sessionStorage.getItem("employeeAuthenticated") === "true";

    const isValidEmployee =
        Boolean(token) &&
        authenticated &&
        role === "employee";

    if (!isValidEmployee) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;
