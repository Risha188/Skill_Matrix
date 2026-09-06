import React from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider } from "react-router-dom";

import router from "./router/appRouter.jsx";

import { AdminProvider } from "./context/AdminContext.jsx";

import "./index.css";
import { EmployeeProfileProvider } from "./context/EmployeeProfileContext.jsx";

ReactDOM.createRoot(
    document.getElementById("root")
).render(
    <React.StrictMode>

        <AdminProvider>
            <EmployeeProfileProvider>
                <RouterProvider
                router={router}
            />
            </EmployeeProfileProvider>

        </AdminProvider>

    </React.StrictMode>
);