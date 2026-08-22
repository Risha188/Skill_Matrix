import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";

import {
    EmployeeProfileProvider,
} from "./context/EmployeeProfileContext.jsx";
// import { AdminProvider } from "./context/AdminContext.jsx";

import "./index.css";

ReactDOM.createRoot(
    document.getElementById("root")
).render(
    <React.StrictMode>
        <EmployeeProfileProvider>
            <App />
        </EmployeeProfileProvider>
    </React.StrictMode>
);