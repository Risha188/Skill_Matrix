import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import { EmployeeProfileProvider } from "../context/EmployeeProfileContext.jsx";

const EmployeeLayout = () => {
    return (
        <EmployeeProfileProvider>

            <div className="relative min-h-screen bg-gray-50">

                {/* Sidebar */}
                <Sidebar />

                {/* Employee Content */}
                <main className="ml-64 min-h-screen p-6">
                    <div className="mx-auto w-full max-w-7xl">
                        <Outlet />
                    </div>
                </main>

            </div>

        </EmployeeProfileProvider>
    );
};

export default EmployeeLayout;