
import {
    createBrowserRouter,
    Route,
    createRoutesFromElements,
    Navigate,
} from "react-router-dom";

import EmployeeLayout from "../layouts/EmployeeLayout.jsx";

import PersonalInformation from "../pages/employee/PersonalInformation.jsx";
import Education from "../pages/employee/Education.jsx";
import Address from "../pages/employee/Address.jsx";
import Skills from "../pages/employee/Skills.jsx";
import WorkExperience from "../pages/employee/WorkExperience.jsx";
import BDM from "../pages/employee/BDM.jsx";
import Dashboard from "../pages/employee/Dashboard.jsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* Default Route */}
            <Route
                path="/"
                element={
                    <Navigate
                        to="/employee/personal"
                        replace
                    />
                }
            />

            {/* Employee Panel */}
            <Route
                path="/employee"
                element={<EmployeeLayout />}
            >
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
        </>
    )
);

export default router;

