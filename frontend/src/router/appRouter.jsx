import {
    createBrowserRouter,
    createRoutesFromElements,
    Navigate,
    Route,
} from "react-router-dom";

// =========================================================
// AUTHENTICATION
// =========================================================

import Login from "../pages/auth/Login.jsx";
import Registration from "../pages/auth/Registration.jsx";
import forgotPassword from "../pages/auth/forgotPassword.jsx";
import verifyEmail from "../pages/auth/verifyEmail.jsx";
import setPassword from "../pages/auth/setPassword.jsx";
import verifyResetCode from "../pages/auth/verifyResetCode.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";

// =========================================================
// ADMIN LOGIN
// =========================================================

import AdminLogin from "../pages/admin/AdminLogin.jsx";

// =========================================================
// ADMIN PANEL
// =========================================================

import AdminLayout from "../layouts/AdminLayout.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import Employees from "../pages/admin/Employees.jsx";
import EmployeeDetails from "../pages/admin/EmployeeDetails.jsx";
import AllProjects from "../pages/admin/AllProjects.jsx";
import AssignedProject from "../pages/admin/AssignedProject.jsx";
import ReassignProject from "../pages/admin/ReassignProject.jsx";
import ProjectDetails from "../pages/admin/ProjectDetails.jsx";

// =========================================================
// EMPLOYEE PROTECTED ROUTE
// =========================================================

import ProtectedRoute from "./protectedRoute.jsx";

// =========================================================
// EMPLOYEE LAYOUT
// =========================================================

import EmployeeLayout from "../layouts/EmployeeLayout.jsx";

// =========================================================
// EMPLOYEE PAGES
// =========================================================

import PersonalInformation from "../pages/employee/PersonalInformation.jsx";
import Education from "../pages/employee/Education.jsx";
import Address from "../pages/employee/Address.jsx";
import Skills from "../pages/employee/Skills.jsx";
import WorkExperience from "../pages/employee/WorkExperience.jsx";
import BDM from "../pages/employee/BDM.jsx";
import Dashboard from "../pages/employee/Dashboard.jsx";

// =========================================================
// MAIN ROUTER
// =========================================================

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* =================================================
                START PAGE
            ================================================= */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

            {/* =================================================
                EMPLOYEE AUTHENTICATION
            ================================================= */}

            <Route
                path="/registration"
                element={<Registration />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/forgot-password"
                element={<forgotPassword />}
            />

            <Route
                path="/verify-reset-code"
                element={<verifyResetCode />}
            />

            <Route
                path="/reset-password"
                element={<ResetPassword />}
            />

            <Route
                path="/verify-email"
                element={<verifyEmail />}
            />

            <Route
                path="/set-password"
                element={<setPassword />}
            />

            {/* =================================================
                ADMIN AUTHENTICATION
            ================================================= */}

            {/* /admin redirects to Admin Login */}

            <Route
                path="/admin"
                element={
                    <Navigate
                        to="/admin/login"
                        replace
                    />
                }
            />

            {/* Admin Login */}

            <Route
                path="/admin/login"
                element={<AdminLogin />}
            />

            {/* =================================================
                ADMIN DASHBOARD
            ================================================= */}

            <Route
                path="/admin/dashboard"
                element={<AdminLayout />}
            >
                <Route
                    index
                    element={<AdminDashboard />}
                />
            </Route>

            {/* =================================================
                ADMIN EMPLOYEES
            ================================================= */}

            <Route
                path="/admin/employees"
                element={<AdminLayout />}
            >
                <Route
                    index
                    element={<Employees />}
                />
            </Route>

            {/* =================================================
                ADMIN EMPLOYEE DETAILS
            ================================================= */}

            <Route
                path="/admin/employees/:employeeId"
                element={<AdminLayout />}
            >
                <Route
                    index
                    element={<EmployeeDetails />}
                />
            </Route>

            {/* =================================================
                ADMIN ALL PROJECTS
            ================================================= */}

            <Route
                path="/admin/allprojects"
                element={<AdminLayout />}
            >
                <Route
                    index
                    element={<AllProjects />}
                />
            </Route>

            {/* =================================================
                ADMIN ASSIGNED PROJECTS
            ================================================= */}

            <Route
                path="/admin/assignedproject"
                element={<AdminLayout />}
            >
                <Route
                    index
                    element={<AssignedProject />}
                />
            </Route>

            {/* =================================================
                ADMIN REASSIGN PROJECT
            ================================================= */}

            <Route
                path="/admin/reassign-project/:projectId"
                element={<AdminLayout />}
            >
                <Route
                    index
                    element={<ReassignProject />}
                />
            </Route>

            {/* =================================================
                ADMIN PROJECT DETAILS
            ================================================= */}

            <Route
                path="/admin/projectdetails/:id"
                element={<AdminLayout />}
            >
                <Route
                    index
                    element={<ProjectDetails />}
                />
            </Route>

            {/* =================================================
                PROTECTED EMPLOYEE ROUTES
            ================================================= */}

            <Route
                element={<ProtectedRoute />}
            >
                <Route
                    path="/employee"
                    element={<EmployeeLayout />}
                >
                    {/* Employee Dashboard */}

                    <Route
                        path="dashboard"
                        element={<Dashboard />}
                    />

                    {/* Personal Information */}

                    <Route
                        path="personal"
                        element={
                            <PersonalInformation />
                        }
                    />

                    {/* Education */}

                    <Route
                        path="education"
                        element={<Education />}
                    />

                    {/* Address */}

                    <Route
                        path="address"
                        element={<Address />}
                    />

                    {/* Skills */}

                    <Route
                        path="skills"
                        element={<Skills />}
                    />

                    {/* Work Experience */}

                    <Route
                        path="experience"
                        element={<WorkExperience />}
                    />

                    {/* BDM */}

                    <Route
                        path="bdm"
                        element={<BDM />}
                    />
                </Route>
            </Route>

            {/* =================================================
                UNKNOWN URL
            ================================================= */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />
        </>
    )
);

export default router;