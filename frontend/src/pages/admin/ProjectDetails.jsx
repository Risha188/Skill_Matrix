import { useNavigate, useParams } from "react-router-dom";
import projectDetails from "../../data/projectDetails";

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // =========================================================
    // FIND PROJECT
    // =========================================================

    const project = projectDetails.find(
        (item) => String(item.id) === String(id)
    );

    // =========================================================
    // PROJECT NOT FOUND
    // =========================================================

    if (!project) {
        return (
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="mx-auto max-w-5xl">
                    <div className="rounded-xl bg-white p-10 text-center shadow-sm">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.8}
                                stroke="currentColor"
                                className="h-8 w-8 text-red-500"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v3.75m0 3h.008v.008H12V15.75ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>
                        </div>

                        <h2 className="mt-5 text-xl font-semibold text-gray-800">
                            Project Not Found
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            The project you are looking for does not
                            exist or may have been removed.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            Go Back
                        </button>

                    </div>
                </div>
            </div>
        );
    }

    // =========================================================
    // STATUS STYLE
    // =========================================================

    const getStatusStyle = (status) => {
        switch (status) {
            case "Active":
                return "bg-green-100 text-green-700";

            case "Pending":
                return "bg-yellow-100 text-yellow-700";

            case "Completed":
                return "bg-blue-100 text-blue-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // =========================================================
    // RETURN
    // =========================================================

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="mx-auto max-w-6xl">

                {/* =================================================
                    BACK BUTTON
                ================================================= */}

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-blue-600"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                        className="h-5 w-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5 8.25 12l7.5-7.5"
                        />
                    </svg>

                    Back to Assigned Projects
                </button>

                {/* =================================================
                    PROJECT HEADER
                ================================================= */}

                <div className="rounded-xl bg-white shadow-sm">

                    <div className="p-6 sm:p-8">

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                            {/* PROJECT TITLE */}

                            <div>

                                <div className="flex flex-wrap items-center gap-3">

                                    <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                                        {project.projectName}
                                    </h1>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                            project.status
                                        )}`}
                                    >
                                        {project.status}
                                    </span>

                                </div>

                                <p className="mt-2 text-sm font-medium text-gray-400">
                                    Project Code:{" "}
                                    <span className="text-gray-600">
                                        {project.projectCode}
                                    </span>
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        PROJECT QUICK INFORMATION
                    ================================================= */}

                    <div className="grid grid-cols-1 border-t sm:grid-cols-2 lg:grid-cols-4">

                        {/* START DATE */}

                        <div className="border-b p-5 sm:border-r lg:border-b-0">

                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Start Date
                            </p>

                            <p className="mt-2 text-sm font-semibold text-gray-800">
                                {project.startDate || "Not specified"}
                            </p>

                        </div>

                        {/* CLIENT */}

                        <div className="border-b p-5 lg:border-r lg:border-b-0">

                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Client
                            </p>

                            <p className="mt-2 text-sm font-semibold text-gray-800">
                                {project.client || "Not specified"}
                            </p>

                        </div>

                        {/* PROJECT TYPE */}

                        <div className="border-b p-5 sm:border-r lg:border-b-0">

                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Project Type
                            </p>

                            <p className="mt-2 text-sm font-semibold text-gray-800">
                                {project.projectType ||
                                    "Not specified"}
                            </p>

                        </div>

                        {/* PRIORITY */}

                        <div className="p-5">

                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Priority
                            </p>

                            <p className="mt-2 text-sm font-semibold text-gray-800">
                                {project.priority || "Not specified"}
                            </p>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* =================================================
                        LEFT / MAIN CONTENT
                    ================================================= */}

                    <div className="space-y-6 lg:col-span-2">

                        {/* PROJECT DESCRIPTION */}

                        <section className="rounded-xl bg-white p-6 shadow-sm">

                            <div className="mb-4">

                                <h2 className="text-lg font-semibold text-gray-800">
                                    Project Description
                                </h2>

                                <div className="mt-2 h-1 w-10 rounded-full bg-blue-600" />

                            </div>

                            <p className="text-sm leading-7 text-gray-600">
                                {project.description ||
                                    "No project description has been provided."}
                            </p>

                        </section>

                        {/* PROJECT OBJECTIVES */}

                        <section className="rounded-xl bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-semibold text-gray-800">
                                Project Objectives
                            </h2>

                            <div className="mt-2 h-1 w-10 rounded-full bg-blue-600" />

                            {project.objectives?.length > 0 ? (

                                <div className="mt-5 space-y-3">

                                    {project.objectives.map(
                                        (objective, index) => (

                                            <div
                                                key={index}
                                                className="flex items-start gap-3"
                                            >

                                                <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100">

                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={2}
                                                        stroke="currentColor"
                                                        className="h-3 w-3 text-blue-600"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="m5 12 4 4L19 6"
                                                        />
                                                    </svg>

                                                </div>

                                                <p className="text-sm leading-6 text-gray-600">
                                                    {objective}
                                                </p>

                                            </div>

                                        )
                                    )}

                                </div>

                            ) : (

                                <p className="mt-4 text-sm text-gray-500">
                                    No objectives have been specified.
                                </p>

                            )}

                        </section>

                    </div>

                    {/* =================================================
                        RIGHT SIDEBAR
                    ================================================= */}

                    <div className="space-y-6">

                        {/* TECHNOLOGY STACK */}

                        <section className="rounded-xl bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-semibold text-gray-800">
                                Technology Stack
                            </h2>

                            <div className="mt-2 h-1 w-10 rounded-full bg-blue-600" />

                            {project.technologies?.length > 0 ? (

                                <div className="mt-5 flex flex-wrap gap-2">

                                    {project.technologies.map(
                                        (technology, index) => (

                                            <span
                                                key={index}
                                                className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700"
                                            >
                                                {technology}
                                            </span>

                                        )
                                    )}

                                </div>

                            ) : (

                                <p className="mt-4 text-sm text-gray-500">
                                    No technologies specified.
                                </p>

                            )}

                        </section>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ProjectDetails;