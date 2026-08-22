import {
    createBrowserRouter,
    Navigate,
} from "react-router-dom";

import EmployeeLayout from "../layouts/EmployeeLayout.jsx";

import Dashboard from "../pages/employee/Dashboard.jsx";
import PersonalInformation from "../pages/employee/PersonalInformation.jsx";
import Education from "../pages/employee/Education.jsx";
import Address from "../pages/employee/Address.jsx";
import Skills from "../pages/employee/Skills.jsx";
import WorkExperience from "../pages/employee/WorkExperience.jsx";
import BDM from "../pages/employee/BDM.jsx";

const EmployeeRouter = createBrowserRouter([
    {
        path: "/",
        element: (
            <Navigate
                to="/employee/personal"
                replace
            />
        ),
    },

    {
        path: "/employee",
        element: <EmployeeLayout />,

        children: [
            {
                index: true,
                element: (
                    <Navigate
                        to="personal"
                        replace
                    />
                ),
            },

            {
                path: "dashboard",
                element: <Dashboard />,
            },

            {
                path: "personal",
                element: <PersonalInformation />,
            },

            {
                path: "education",
                element: <Education />,
            },

            {
                path: "address",
                element: <Address />,
            },

            {
                path: "skills",
                element: <Skills />,
            },

            {
                path: "experience",
                element: <WorkExperience />,
            },

            {
                path: "bdm",
                element: <BDM />,
            },
        ],
    },
]);

export default EmployeeRouter;