// src/main.jsx

import React from "react";

import ReactDOM from "react-dom/client";

import {
    RouterProvider,
} from "react-router-dom";

import AdminRouter from "./router/AdminRouter.jsx";

import {
    AdminProvider,
} from "./context/AdminContext.jsx";

import "./index.css";

ReactDOM.createRoot(
    document.getElementById("root")
).render(
    <React.StrictMode>
        <AdminProvider>
            <RouterProvider
                router={AdminRouter}
            />
        </AdminProvider>
    </React.StrictMode>
);