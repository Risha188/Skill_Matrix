import {
    createBrowserRouter,
    createRoutesFromElements,
    Navigate,
    Route,
} from "react-router-dom";

// =========================================================
// ADMIN LAYOUT
// =========================================================

import AdminLayout from "../layouts/AdminLayout.jsx";

// =========================================================
// ADMIN PAGES
// =========================================================

import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import Employees from "../pages/admin/Employees.jsx";
import EmployeeDetails from "../pages/admin/EmployeeDetails.jsx";
import AllProjects from "../pages/admin/AllProjects.jsx";
import AssignedProject from "../pages/admin/AssignedProject.jsx";
import ReassignProject from "../pages/admin/ReassignProject.jsx";
import ProjectDetails from "../pages/admin/ProjectDetails.jsx";

// =========================================================
// ADMIN ROUTER
// =========================================================

const AdminRouter = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* =================================================
                ROOT
            ================================================= */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/admin/dashboard"
                        replace
                    />
                }
            />

            {/* =================================================
                ADMIN PANEL
            ================================================= */}

            <Route
                path="/admin"
                element={
                    <AdminLayout />
                }
            >

                {/* =================================================
                    DEFAULT ADMIN ROUTE
                ================================================= */}

                <Route
                    index
                    element={
                        <Navigate
                            to="dashboard"
                            replace
                        />
                    }
                />

                {/* =================================================
                    DASHBOARD
                ================================================= */}

                <Route
                    path="dashboard"
                    element={
                        <AdminDashboard />
                    }
                />

                {/* =================================================
                    EMPLOYEES
                ================================================= */}

                <Route
                    path="employees"
                    element={
                        <Employees />
                    }
                />

                {/* =================================================
                    EMPLOYEE DETAILS
                ================================================= */}

                <Route
                    path="employees/:employeeId"
                    element={
                        <EmployeeDetails />
                    }
                />

                {/* =================================================
                    ALL PROJECTS
                ================================================= */}

                <Route
                    path="allprojects"
                    element={
                        <AllProjects />
                    }
                />

                {/* =================================================
                    ASSIGNED PROJECTS
                ================================================= */}

                <Route
                    path="assignedproject"
                    element={
                        <AssignedProject />
                    }
                />

                {/* =================================================
                    REASSIGN PROJECT
                ================================================= */}

                <Route
                    path="reassign-project/:projectId"
                    element={
                        <ReassignProject />
                    }
                />

                {/* =================================================
                    PROJECT DETAILS
                ================================================= */}

                <Route
                    path="projectdetails/:id"
                    element={
                        <ProjectDetails />
                    }
                />

            </Route>

            {/* =================================================
                UNKNOWN ROUTES
            ================================================= */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/admin/dashboard"
                        replace
                    />
                }
            />

        </>
    )
);

export default AdminRouter;