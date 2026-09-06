import {
    createBrowserRouter,
    Route,
    createRoutesFromElements,
    Navigate,
} from "react-router-dom";

// ========================================
// Authentication Pages
// ========================================

import Login from "../pages/auth/login.jsx";
import Registration from "../pages/auth/registration.jsx";
import ForgotPassword from "../pages/auth/forgotPassword.jsx";
import VerifyEmail from "../pages/auth/VerifyEmail.jsx";
import SetPassword from "../pages/auth/SetPassword.jsx";
import VerifyResetCode from "../pages/auth/verifyResetCode.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";

// ========================================
// Admin
// ========================================

import AdminLogin from "../pages/admin/AdminLogin.jsx";

// ========================================
// Protected Route
// ========================================

import ProtectedRoute from "./protectedRoute.jsx";

// ========================================
// Employee Layout
// ========================================

import EmployeeLayout from "../layouts/EmployeeLayout.jsx";

// ========================================
// Employee Pages
// ========================================

import PersonalInformation from "../pages/employee/PersonalInformation.jsx";
import Education from "../pages/employee/Education.jsx";
import Address from "../pages/employee/Address.jsx";
import Skills from "../pages/employee/Skills.jsx";
import WorkExperience from "../pages/employee/WorkExperience.jsx";
import BDM from "../pages/employee/BDM.jsx";
import Dashboard from "../pages/employee/Dashboard.jsx";

// ========================================
// ROUTER
// ========================================

const router = createBrowserRouter(
    createRoutesFromElements(
        <>

            {/* ======================================== */}
            {/* ROOT */}
            {/* ======================================== */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

            {/* ======================================== */}
            {/* AUTHENTICATION */}
            {/* ======================================== */}

            {/* Login */}

            <Route
                path="/login"
                element={<Login />}
            />

            {/* Employee Registration */}

            <Route
                path="/registration"
                element={<Registration />}
            />

            {/* Forgot Password */}

            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />

            {/* Verify Reset Code */}

            <Route
                path="/verify-reset-code"
                element={<VerifyResetCode />}
            />

            {/* Reset Password */}

            <Route
                path="/reset-password"
                element={<ResetPassword />}
            />

            {/* Verify Employee Email */}

            <Route
                path="/verify-email"
                element={<VerifyEmail />}
            />

            {/* Set Password */}

            <Route
                path="/set-password"
                element={<SetPassword />}
            />

            {/* ======================================== */}
            {/* ADMIN LOGIN */}
            {/* ======================================== */}

            <Route
                path="/admin"
                element={<AdminLogin />}
            />

            {/* ======================================== */}
            {/* PROTECTED EMPLOYEE ROUTES */}
            {/* ======================================== */}

            <Route element={<ProtectedRoute />}>

                <Route
                    path="/employee"
                    element={<EmployeeLayout />}
                >

                    {/* ======================================== */}
                    {/* EMPLOYEE DASHBOARD */}
                    {/* ======================================== */}

                    <Route
                        path="dashboard"
                        element={<Dashboard />}
                    />

                    {/* ======================================== */}
                    {/* PERSONAL INFORMATION */}
                    {/* ======================================== */}

                    <Route
                        path="personal"
                        element={<PersonalInformation />}
                    />

                    {/* ======================================== */}
                    {/* EDUCATION */}
                    {/* ======================================== */}

                    <Route
                        path="education"
                        element={<Education />}
                    />

                    {/* ======================================== */}
                    {/* ADDRESS */}
                    {/* ======================================== */}

                    <Route
                        path="address"
                        element={<Address />}
                    />

                    {/* ======================================== */}
                    {/* SKILLS */}
                    {/* ======================================== */}

                    <Route
                        path="skills"
                        element={<Skills />}
                    />

                    {/* ======================================== */}
                    {/* WORK EXPERIENCE */}
                    {/* ======================================== */}

                    <Route
                        path="experience"
                        element={<WorkExperience />}
                    />

                    {/* ======================================== */}
                    {/* BDM */}
                    {/* ======================================== */}

                    <Route
                        path="bdm"
                        element={<BDM />}
                    />

                </Route>

            </Route>

            {/* ======================================== */}
            {/* UNKNOWN URL */}
            {/* ======================================== */}

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