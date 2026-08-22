import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import {
    PROFILE_SECTIONS,
    getCompletedSections,
} from "../../utils/profileProgress.js";

const Dashboard = () => {

    // =========================================================
    // STATE
    // =========================================================

    const [completedSections, setCompletedSections] = useState([]);

    const [currentEmployee, setCurrentEmployee] = useState(null);

    // =========================================================
    // LOAD CURRENT EMPLOYEE
    // =========================================================

    const loadCurrentEmployee = () => {
        try {
            const storedEmployee =
                localStorage.getItem("currentEmployee");

            if (storedEmployee) {
                const employee = JSON.parse(storedEmployee);

                setCurrentEmployee(employee);
            } else {
                setCurrentEmployee(null);
            }

        } catch (error) {
            console.error(
                "Error loading current employee:",
                error
            );

            setCurrentEmployee(null);
        }
    };

    // =========================================================
    // LOAD PROFILE PROGRESS
    // =========================================================

    const loadProgress = () => {
        const completed = getCompletedSections();

        setCompletedSections(completed);
    };

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadCurrentEmployee();

        loadProgress();

        // Update dashboard when another page
        // completes a profile section
        window.addEventListener(
            "profileProgressUpdated",
            loadProgress
        );

        // Update employee when login information changes
        window.addEventListener(
            "employeeUpdated",
            loadCurrentEmployee
        );

        return () => {

            window.removeEventListener(
                "profileProgressUpdated",
                loadProgress
            );

            window.removeEventListener(
                "employeeUpdated",
                loadCurrentEmployee
            );

        };

    }, []);

    // =========================================================
    // EMPLOYEE NAME
    // =========================================================

    const employeeName =
        currentEmployee?.name ||
        currentEmployee?.fullName ||
        currentEmployee?.employeeName ||
        "Employee";

    // =========================================================
    // PROFILE CALCULATIONS
    // =========================================================

    const completedCount = PROFILE_SECTIONS.filter(
        (section) =>
            completedSections.includes(section.key)
    ).length;

    const totalSections = PROFILE_SECTIONS.length;

    const remainingCount =
        totalSections - completedCount;

    const completionPercentage =
        totalSections === 0
            ? 0
            : Math.round(
                (completedCount / totalSections) * 100
            );

    // =========================================================
    // UI
    // =========================================================

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-8">

            <div className="mx-auto max-w-6xl">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-gray-800">
                        Employee Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your employee profile and keep your
                        information up to date.
                    </p>

                </div>

                {/* =================================================
                    WELCOME
                ================================================= */}

                <div
                    className="
                        mb-6
                        rounded-xl
                        bg-sky-800
                        p-6
                        text-white
                        shadow-md
                    "
                >

                    <h2 className="text-2xl font-bold">
                        Welcome, {employeeName}
                    </h2>

                    <p className="mt-2 text-sm text-blue-100">
                        Complete your employee profile to make sure
                        all your information is available.
                    </p>

                </div>

                {/* =================================================
                    PROFILE COMPLETION
                ================================================= */}

                <div
                    className="
                        mb-6
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        p-6
                        shadow-sm
                    "
                >

                    <div
                        className="
                            mb-4
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <div>

                            <h2 className="text-lg font-semibold text-gray-800">
                                Profile Completion
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                {completedCount} of {totalSections} sections completed
                            </p>

                        </div>

                        <span className="text-xl font-bold text-sky-800">
                            {completionPercentage}%
                        </span>

                    </div>

                    {/* PROGRESS BAR */}

                    <div
                        className="
                            h-3
                            w-full
                            overflow-hidden
                            rounded-full
                            bg-gray-200
                        "
                    >

                        <div
                            className="
                                h-full
                                rounded-full
                                bg-sky-800
                                transition-all
                                duration-700
                                ease-out
                            "
                            style={{
                                width: `${completionPercentage}%`,
                            }}
                        />

                    </div>

                    <p className="mt-3 text-sm text-gray-500">

                        {completionPercentage === 100
                            ? "Your profile is complete!"
                            : `You have ${remainingCount} section${
                                remainingCount !== 1
                                    ? "s"
                                    : ""
                            } remaining.`
                        }

                    </p>

                </div>

                {/* =================================================
                    STATISTICS
                ================================================= */}

                <div
                    className="
                        mb-6
                        grid
                        grid-cols-1
                        gap-5
                        md:grid-cols-3
                    "
                >

                    {/* COMPLETED */}

                    <div
                        className="
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            p-5
                            shadow-sm
                        "
                    >

                        <div className="flex items-center gap-4">

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-green-100
                                    text-green-600
                                "
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>

                            <div>

                                <p className="text-sm text-gray-500">
                                    Completed
                                </p>

                                <h3 className="text-2xl font-bold text-gray-800">
                                    {completedCount}
                                </h3>

                            </div>

                        </div>

                    </div>

                    {/* REMAINING */}

                    <div
                        className="
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            p-5
                            shadow-sm
                        "
                    >

                        <div className="flex items-center gap-4">

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-yellow-100
                                    text-yellow-600
                                "
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="9"
                                    />

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 7v5l3 2"
                                    />
                                </svg>
                            </div>

                            <div>

                                <p className="text-sm text-gray-500">
                                    Remaining
                                </p>

                                <h3 className="text-2xl font-bold text-gray-800">
                                    {remainingCount}
                                </h3>

                            </div>

                        </div>

                    </div>

                    {/* COMPLETION */}

                    <div
                        className="
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            p-5
                            shadow-sm
                        "
                    >

                        <div className="flex items-center gap-4">

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-blue-100
                                    text-blue-600
                                "
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 19V5"
                                    />

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 5h14l-2 4 2 4H4"
                                    />
                                </svg>
                            </div>

                            <div>

                                <p className="text-sm text-gray-500">
                                    Completion
                                </p>

                                <h3 className="text-2xl font-bold text-gray-800">
                                    {completionPercentage}%
                                </h3>

                            </div>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    PROFILE SECTIONS
                ================================================= */}

                <div
                    className="
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        shadow-sm
                    "
                >

                    <div
                        className="
                            border-b
                            border-gray-200
                            px-6
                            py-5
                        "
                    >

                        <h2 className="text-lg font-semibold text-gray-800">
                            Profile Sections
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Complete or edit your employee profile sections.
                        </p>

                    </div>

                    <div className="divide-y divide-gray-100">

                        {PROFILE_SECTIONS.map((section) => {

                            const isCompleted =
                                completedSections.includes(
                                    section.key
                                );

                            return (
                                <div
                                    key={section.key}
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        px-6
                                        py-4
                                        transition
                                        hover:bg-gray-50
                                    "
                                >

                                    <div className="flex items-center gap-4">

                                        {/* STATUS ICON */}

                                        <div
                                            className={`
                                                flex
                                                h-10
                                                w-10
                                                items-center
                                                justify-center
                                                rounded-full
                                                ${
                                                    isCompleted
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-gray-100 text-gray-400"
                                                }
                                            `}
                                        >

                                            {isCompleted ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <circle
                                                        cx="12"
                                                        cy="12"
                                                        r="9"
                                                    />
                                                </svg>
                                            )}

                                        </div>

                                        <div>

                                            <h3 className="text-sm font-semibold text-gray-800">
                                                {section.name}
                                            </h3>

                                            <p
                                                className={`
                                                    mt-1
                                                    text-xs
                                                    font-medium
                                                    ${
                                                        isCompleted
                                                            ? "text-green-600"
                                                            : "text-gray-400"
                                                    }
                                                `}
                                            >
                                                {isCompleted
                                                    ? "Completed"
                                                    : "Not completed"
                                                }
                                            </p>

                                        </div>

                                    </div>

                                    {/* COMPLETE / EDIT */}

                                    <NavLink
                                        to={section.path}
                                        className={`
                                            rounded-lg
                                            px-4
                                            py-2
                                            text-sm
                                            font-medium
                                            transition
                                            ${
                                                isCompleted
                                                    ? "border border-gray-300 text-gray-600 hover:bg-gray-100"
                                                    : "bg-sky-800 text-white hover:bg-sky-700"
                                            }
                                        `}
                                    >
                                        {isCompleted
                                            ? "Edit"
                                            : "Complete"
                                        }
                                    </NavLink>

                                </div>
                            );

                        })}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Dashboard;