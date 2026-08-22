import { Outlet } from "react-router-dom";
import Sidebar from "../components/Employee/Sidebar";

const EmployeeLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">

            {/* Sidebar */}
            <Sidebar />

            {/* Employee Content */}
            <main className="min-h-screen pl-64">
                <div className="w-full p-6">
                    <Outlet />
                </div>
            </main>

        </div>
    );
};

export default EmployeeLayout;