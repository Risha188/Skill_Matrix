
import {
    createBrowserRouter,
    createRoutesFromElements,
    Navigate,
    Route,
} from "react-router-dom";

// ==========================================
// AUTHENTICATION
// ==========================================

import Login from "../pages/auth/Login.jsx";
import Registration from "../pages/auth/Registration.jsx";
import ForgotPassword from "../pages/auth/forgotPassword.jsx";
import VerifyEmail from "../pages/auth/verifyEmail.jsx";
import SetPassword from "../pages/auth/setPassword.jsx";
import VerifyResetCode from "../pages/auth/verifyResetCode.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";

// ==========================================
// ADMIN
// ==========================================

import AdminLogin from "../pages/admin/AdminLogin.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";

import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import Employees from "../pages/admin/Employees.jsx";
import EmployeeDetails from "../pages/admin/EmployeeDetails.jsx";
import AllProjects from "../pages/admin/AllProjects.jsx";
import AssignedProject from "../pages/admin/AssignedProject.jsx";
import ReassignProject from "../pages/admin/ReassignProject.jsx";
import ProjectDetails from "../pages/admin/ProjectDetails.jsx";

// ==========================================
// EMPLOYEE
// ==========================================

import EmployeeLayout from "../layouts/EmployeeLayout.jsx";
import ProtectedRoute from "./protectedRoute.jsx";

import Dashboard from "../pages/employee/Dashboard.jsx";
import PersonalInformation from "../pages/employee/PersonalInformation.jsx";
import Education from "../pages/employee/Education.jsx";
import Address from "../pages/employee/Address.jsx";
import Skills from "../pages/employee/Skills.jsx";
import WorkExperience from "../pages/employee/WorkExperience.jsx";
import BDM from "../pages/employee/BDM.jsx";

// ==========================================
// ROUTER
// ==========================================

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* ROOT */}
            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            {/* AUTHENTICATION */}
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />

            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />

            <Route
                path="/verify-reset-code"
                element={<VerifyResetCode />}
            />

            <Route
                path="/reset-password"
                element={<ResetPassword />}
            />

            <Route
                path="/verify-email"
                element={<VerifyEmail />}
            />

            <Route
                path="/set-password"
                element={<SetPassword />}
            />

            {/* ADMIN LOGIN */}
            <Route
                path="/admin"
                element={<Navigate to="/admin/login" replace />}
            />

            <Route
                path="/admin/login"
                element={<AdminLogin />}
            />

            {/* ADMIN DASHBOARD */}
            <Route
                path="/admin/dashboard"
                element={<AdminLayout />}
            >
                <Route index element={<AdminDashboard />} />
            </Route>

            {/* ADMIN EMPLOYEES */}
            <Route
                path="/admin/employees"
                element={<AdminLayout />}
            >
                <Route index element={<Employees />} />
            </Route>

            {/* ADMIN EMPLOYEE DETAILS */}
            <Route
                path="/admin/employees/:employeeId"
                element={<AdminLayout />}
            >
                <Route index element={<EmployeeDetails />} />
            </Route>

            {/* ADMIN PROJECTS */}
            <Route
                path="/admin/allprojects"
                element={<AdminLayout />}
            >
                <Route index element={<AllProjects />} />
            </Route>

            <Route
                path="/admin/assignedproject"
                element={<AdminLayout />}
            >
                <Route index element={<AssignedProject />} />
            </Route>

            <Route
                path="/admin/reassign-project/:projectId"
                element={<AdminLayout />}
            >
                <Route index element={<ReassignProject />} />
            </Route>

            <Route
                path="/admin/projectdetails/:id"
                element={<AdminLayout />}
            >
                <Route index element={<ProjectDetails />} />
            </Route>

            {/* ======================================
                PROTECTED EMPLOYEE ROUTES
            ====================================== */}

            <Route element={<ProtectedRoute />}>
                <Route
                    path="/employee"
                    element={<EmployeeLayout />}
                >
                    <Route
                        index
                        element={
                            <Navigate
                                to="/employee/dashboard"
                                replace
                            />
                        }
                    />

                    <Route
                        path="dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="personal"
                        element={<PersonalInformation />}
                    />

                    <Route
                        path="education"
                        element={<Education />}
                    />

                    <Route
                        path="address"
                        element={<Address />}
                    />

                    <Route
                        path="skills"
                        element={<Skills />}
                    />

                    <Route
                        path="experience"
                        element={<WorkExperience />}
                    />

                    <Route
                        path="bdm"
                        element={<BDM />}
                    />
                </Route>
            </Route>

            {/* UNKNOWN ROUTES */}
            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />
        </>
    )
);

export default router;
