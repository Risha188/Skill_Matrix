import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
    PROFILE_SECTIONS,
    getCompletedSections
} from "../../utils/profileProgress.js";

const Dashboard = () => {

    const [completedSections, setCompletedSections] = useState([]);

    // Load completed sections
    const loadProgress = () => {
        const completed = getCompletedSections();
        setCompletedSections(completed);
    };

    useEffect(() => {

        loadProgress();

        // Update dashboard when another page completes a section
        window.addEventListener(
            "profileProgressUpdated",
            loadProgress
        );

        return () => {
            window.removeEventListener(
                "profileProgressUpdated",
                loadProgress
            );
        };

    }, []);

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

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-8">

            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-gray-800">
                        Employee Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your employee profile and keep your
                        information up to date.
                    </p>

                </div>

                {/* Welcome */}
                <div className="mb-6 rounded-xl bg-blue-500 p-6 text-white shadow-md">

                    <h2 className="text-2xl font-bold">
                        Welcome, Parna Das 👋
                    </h2>

                    <p className="mt-2 text-sm text-blue-100">
                        Complete your employee profile to make sure
                        all your information is available.
                    </p>

                </div>

                {/* Profile Completion */}
                <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                    <div className="mb-4 flex items-center justify-between">

                        <div>

                            <h2 className="text-lg font-semibold text-gray-800">
                                Profile Completion
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                {completedCount} of {totalSections} sections completed
                            </p>

                        </div>

                        <span className="text-xl font-bold text-blue-600">
                            {completionPercentage}%
                        </span>

                    </div>

                    {/* Dynamic Progress Bar */}
                    <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">

                        <div
                            className="h-full rounded-full bg-blue-600 transition-all duration-700 ease-out"
                            style={{
                                width: `${completionPercentage}%`
                            }}
                        />

                    </div>

                    <p className="mt-3 text-sm text-gray-500">

                        {completionPercentage === 100
                            ? "Your profile is complete! 🎉"
                            : `You have ${remainingCount} section${
                                remainingCount !== 1 ? "s" : ""
                              } remaining.`
                        }

                    </p>

                </div>

                {/* Statistics */}
                <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">

                    {/* Completed */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center gap-4">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-xl">
                                ✓
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

                    {/* Remaining */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center gap-4">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-xl">
                                ⏳
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

                    {/* Completion */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center gap-4">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
                                📊
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

                {/* Profile Sections */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

                    <div className="border-b border-gray-200 px-6 py-5">

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
                                completedSections.includes(section.key);

                            return (

                                <div
                                    key={section.key}
                                    className="flex items-center justify-between px-6 py-4 transition hover:bg-gray-50"
                                >

                                    <div className="flex items-center gap-4">

                                        {/* Status Icon */}
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                                isCompleted
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-gray-100 text-gray-400"
                                            }`}
                                        >
                                            {isCompleted ? "✓" : "○"}
                                        </div>

                                        <div>

                                            <h3 className="text-sm font-semibold text-gray-800">
                                                {section.name}
                                            </h3>

                                            <p
                                                className={`mt-1 text-xs font-medium ${
                                                    isCompleted
                                                        ? "text-green-600"
                                                        : "text-gray-400"
                                                }`}
                                            >
                                                {isCompleted
                                                    ? "Completed"
                                                    : "Not completed"
                                                }
                                            </p>

                                        </div>

                                    </div>

                                    {/* Complete / Edit */}
                                    <NavLink
                                        to={section.path}
                                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                            isCompleted
                                                ? "border border-gray-300 text-gray-600 hover:bg-gray-100"
                                                : "bg-blue-600 text-white hover:bg-blue-700"
                                        }`}
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