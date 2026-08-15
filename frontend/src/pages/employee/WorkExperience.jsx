import React,{useState} from "react";
import {useNavigate} from "react-router-dom";
import {markSectionCompleted} from "../../utils/profileProgress.js";

const WorkExperience = () => {
    const navigate = useNavigate();

    const [experience,setExperience] = useState({
        companyName: "",
        jobTitle: "",
        employmentType: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        location: "",
        description: "",
    });

    const handleChange = (e) => {
        const {name,value,type,checked} = e.target;

        setExperience((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Work Experience:",experience);
        markSectionCompleted("experience");
        // Go to Declaration page
        navigate("/employee/bdm");
    };

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-8">
            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Work Experience
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Enter your previous and current employment details.
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="overflow-hidden rounded-xl bg-white shadow-md"
                >

                    {/* Form Header */}
                    <div className="border-b border-gray-200 px-6 py-5">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Employment Details
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Provide accurate information about your work experience.
                        </p>
                    </div>

                    {/* Form Fields */}
                    <div className="p-6">

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                            {/* Company Name */}
                            <div>
                                <label
                                    htmlFor="companyName"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Company Name
                                </label>

                                <input
                                    id="companyName"
                                    type="text"
                                    name="companyName"
                                    placeholder="Enter company name"
                                    value={experience.companyName}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* Job Title */}
                            <div>
                                <label
                                    htmlFor="jobTitle"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Job Title
                                </label>

                                <input
                                    id="jobTitle"
                                    type="text"
                                    name="jobTitle"
                                    placeholder="e.g. Software Engineer"
                                    value={experience.jobTitle}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* Employment Type */}
                            <div>
                                <label
                                    htmlFor="employmentType"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Employment Type
                                </label>

                                <select
                                    id="employmentType"
                                    name="employmentType"
                                    value={experience.employmentType}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="">Select Employment Type</option>
                                    <option value="Full Time">Full Time</option>
                                    <option value="Part Time">Part Time</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Freelance">Freelance</option>
                                </select>
                            </div>

                            {/* Location */}
                            <div>
                                <label
                                    htmlFor="location"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Work Location
                                </label>

                                <input
                                    id="location"
                                    type="text"
                                    name="location"
                                    placeholder="e.g. Kolkata, West Bengal"
                                    value={experience.location}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* Start Date */}
                            <div>
                                <label
                                    htmlFor="startDate"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Start Date
                                </label>

                                <input
                                    id="startDate"
                                    type="date"
                                    name="startDate"
                                    value={experience.startDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* End Date */}
                            <div>
                                <label
                                    htmlFor="endDate"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    End Date
                                </label>

                                <input
                                    id="endDate"
                                    type="date"
                                    name="endDate"
                                    value={experience.endDate}
                                    onChange={handleChange}
                                    disabled={experience.currentlyWorking}
                                    required={!experience.currentlyWorking}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                                />
                            </div>

                            {/* Currently Working */}
                            <div className="md:col-span-2">
                                <label className="flex cursor-pointer items-center gap-3">

                                    <input
                                        type="checkbox"
                                        name="currentlyWorking"
                                        checked={experience.currentlyWorking}
                                        onChange={handleChange}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />

                                    <span className="text-sm font-medium text-gray-700">
                                        I am currently working at this company
                                    </span>

                                </label>
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label
                                    htmlFor="description"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Job Description
                                </label>

                                <textarea
                                    id="description"
                                    name="description"
                                    rows="5"
                                    placeholder="Describe your responsibilities, projects, and achievements..."
                                    value={experience.description}
                                    onChange={handleChange}
                                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">

                        <button
                            type="button"
                            onClick={() =>
                                setExperience({
                                    companyName: "",
                                    jobTitle: "",
                                    employmentType: "",
                                    startDate: "",
                                    endDate: "",
                                    currentlyWorking: false,
                                    location: "",
                                    description: "",
                                })
                            }
                            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                        >
                            Clear
                        </button>

                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Save & Next
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default WorkExperience;