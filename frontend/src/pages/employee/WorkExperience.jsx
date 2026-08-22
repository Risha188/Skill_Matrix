import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { markSectionCompleted } from "../../utils/profileProgress.js";
import API from "../../utils/api.js";
import { useEmployeeProfile } from "../../context/EmployeeProfileContext";

const emptyExperience = {
    companyName: "",
    jobTitle: "",
    employmentType: "",
    workLocation: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    jobDescription: "",
};

const WorkExperience = () => {

    const navigate = useNavigate();

    const { profile, updateSection } =
        useEmployeeProfile();

    const [isFresher, setIsFresher] = useState(
        profile.isFresher ?? false
    );

    const [workExperience, setWorkExperience] =
        useState(
            profile.workExperience?.length
                ? profile.workExperience
                : [{ ...emptyExperience }]
        );

    const [errors, setErrors] = useState([]);

    // ==========================================
    // CHANGE EXPERIENCE FIELD
    // ==========================================

    const handleChange = (index, e) => {

        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setWorkExperience((prev) =>
            prev.map((experience, i) =>
                i === index
                    ? {
                          ...experience,
                          [name]:
                              type === "checkbox"
                                  ? checked
                                  : value,
                      }
                    : experience
            )
        );

        // Clear field error
        setErrors((prev) => {

            const updatedErrors = [...prev];

            if (updatedErrors[index]) {
                updatedErrors[index] = {
                    ...updatedErrors[index],
                    [name]: "",
                };
            }

            return updatedErrors;
        });
    };

    // ==========================================
    // ADD ANOTHER EXPERIENCE
    // ==========================================

    const addExperience = () => {

        setWorkExperience((prev) => [
            ...prev,
            { ...emptyExperience },
        ]);

        setErrors((prev) => [
            ...prev,
            {},
        ]);
    };

    // ==========================================
    // REMOVE EXPERIENCE
    // ==========================================

    const removeExperience = (index) => {

        if (workExperience.length === 1) {
            return;
        }

        setWorkExperience((prev) =>
            prev.filter((_, i) => i !== index)
        );

        setErrors((prev) =>
            prev.filter(
                (_, i) => i !== index
            )
        );
    };

    // ==========================================
    // FRESHER CHANGE
    // ==========================================

    const handleFresherChange = (e) => {

        const value =
            e.target.value === "true";

        setIsFresher(value);

        setErrors([]);

        if (value) {

            setWorkExperience([]);

        } else {

            setWorkExperience([
                { ...emptyExperience },
            ]);
        }
    };

    // ==========================================
    // VALIDATION
    // ==========================================

    const validateForm = () => {

        // Fresher doesn't need experience validation
        if (isFresher) {
            setErrors([]);
            return true;
        }

        const newErrors =
            workExperience.map(() => ({}));

        // At least one experience
        if (workExperience.length === 0) {

            alert(
                "Please add at least one work experience."
            );

            return false;
        }

        workExperience.forEach(
            (experience, index) => {

                // =================================
                // COMPANY NAME
                // =================================

                const companyName =
                    experience.companyName?.trim();

                if (!companyName) {

                    newErrors[index].companyName =
                        "Company name is required";

                } else if (
                    companyName.length < 2
                ) {

                    newErrors[index].companyName =
                        "Company name must be at least 2 characters";

                } else if (
                    companyName.length > 100
                ) {

                    newErrors[index].companyName =
                        "Company name cannot exceed 100 characters";

                }

                // =================================
                // JOB TITLE
                // =================================

                const jobTitle =
                    experience.jobTitle?.trim();

                if (!jobTitle) {

                    newErrors[index].jobTitle =
                        "Job title is required";

                } else if (
                    jobTitle.length < 2
                ) {

                    newErrors[index].jobTitle =
                        "Job title must be at least 2 characters";

                } else if (
                    jobTitle.length > 100
                ) {

                    newErrors[index].jobTitle =
                        "Job title cannot exceed 100 characters";

                }

                // =================================
                // EMPLOYMENT TYPE
                // =================================

                if (!experience.employmentType) {

                    newErrors[index].employmentType =
                        "Please select employment type";
                }

                // =================================
                // WORK LOCATION
                // =================================

                const workLocation =
                    experience.workLocation?.trim();

                if (!workLocation) {

                    newErrors[index].workLocation =
                        "Work location is required";

                } else if (
                    workLocation.length < 2
                ) {

                    newErrors[index].workLocation =
                        "Work location must be at least 2 characters";

                } else if (
                    workLocation.length > 100
                ) {

                    newErrors[index].workLocation =
                        "Work location cannot exceed 100 characters";
                }

                // =================================
                // START DATE
                // =================================

                if (!experience.startDate) {

                    newErrors[index].startDate =
                        "Start date is required";

                } else {

                    const startDate =
                        new Date(
                            experience.startDate
                        );

                    const today =
                        new Date();

                    today.setHours(
                        0,
                        0,
                        0,
                        0
                    );

                    if (startDate > today) {

                        newErrors[index].startDate =
                            "Start date cannot be in the future";
                    }
                }

                // =================================
                // END DATE
                // =================================

                if (
                    !experience.currentlyWorking
                ) {

                    if (!experience.endDate) {

                        newErrors[index].endDate =
                            "End date is required";

                    } else {

                        const startDate =
                            new Date(
                                experience.startDate
                            );

                        const endDate =
                            new Date(
                                experience.endDate
                            );

                        const today =
                            new Date();

                        today.setHours(
                            0,
                            0,
                            0,
                            0
                        );

                        if (
                            experience.startDate &&
                            endDate < startDate
                        ) {

                            newErrors[index].endDate =
                                "End date cannot be before start date";

                        } else if (
                            endDate > today
                        ) {

                            newErrors[index].endDate =
                                "End date cannot be in the future";
                        }
                    }

                }

                // =================================
                // JOB DESCRIPTION
                // =================================

                const jobDescription =
                    experience.jobDescription?.trim();

                if (!jobDescription) {

                    newErrors[index].jobDescription =
                        "Job description is required";

                } else if (
                    jobDescription.length < 10
                ) {

                    newErrors[index].jobDescription =
                        "Job description must be at least 10 characters";

                } else if (
                    jobDescription.length > 1000
                ) {

                    newErrors[index].jobDescription =
                        "Job description cannot exceed 1000 characters";
                }
            }
        );

        setErrors(newErrors);

        const hasErrors =
            newErrors.some(
                (error) =>
                    Object.keys(error).length > 0
            );

        return !hasErrors;
    };

    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        // Validate
        const isValid =
            validateForm();

        if (!isValid) {
            return;
        }

        try {

            const employeeId =
                localStorage.getItem(
                    "employeeId"
                );

            if (!employeeId) {

                alert(
                    "Employee ID not found. Please complete Personal Information first."
                );

                return;
            }

            const finalExperience =
                isFresher
                    ? []
                    : workExperience;

            // ==========================================
            // SAVE TO MONGODB
            // ==========================================

            const response =
                await API.put(
                    `/employees/${employeeId}/work-experience`,
                    {
                        isFresher,
                        workExperience:
                            finalExperience,
                    }
                );

            console.log(
                "Work Experience saved:",
                response.data
            );

            // ==========================================
            // SAVE TO CONTEXT
            // ==========================================

            updateSection(
                "isFresher",
                isFresher
            );

            updateSection(
                "workExperience",
                finalExperience
            );

            // ==========================================
            // MARK COMPLETED
            // ==========================================

            markSectionCompleted(
                "experience"
            );

            // ==========================================
            // NEXT PAGE
            // ==========================================

            navigate(
                "/employee/bdm"
            );

        } catch (error) {

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );

            console.error(
                "FULL ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to save work experience"
            );
        }
    };

    const inputClass =
        "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

    const errorInputClass =
        "w-full rounded-lg border border-red-500 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100";

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-8">

            <div className="mx-auto max-w-5xl">

                {/* HEADER */}

                <div className="mb-8">

                    <h2 className="text-2xl font-bold text-gray-800">
                        Work Experience
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Tell us about your previous and current employment.
                    </p>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    {/* FRESHER / EXPERIENCED */}

                    <div className="rounded-xl bg-white p-6 shadow-md">

                        <h3 className="mb-4 text-lg font-semibold text-gray-800">
                            Employment Status
                        </h3>

                        <div className="flex gap-8">

                            <label className="flex items-center gap-2">

                                <input
                                    type="radio"
                                    name="employeeType"
                                    value="true"
                                    checked={
                                        isFresher === true
                                    }
                                    onChange={
                                        handleFresherChange
                                    }
                                    className="h-4 w-4"
                                />

                                <span className="text-sm text-gray-700">
                                    I am a Fresher
                                </span>

                            </label>

                            <label className="flex items-center gap-2">

                                <input
                                    type="radio"
                                    name="employeeType"
                                    value="false"
                                    checked={
                                        isFresher === false
                                    }
                                    onChange={
                                        handleFresherChange
                                    }
                                    className="h-4 w-4"
                                />

                                <span className="text-sm text-gray-700">
                                    I have Work Experience
                                </span>

                            </label>

                        </div>

                    </div>

                    {/* FRESHER MESSAGE */}

                    {isFresher && (

                        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">

                            <h3 className="font-semibold text-blue-800">
                                No Work Experience Required
                            </h3>

                            <p className="mt-2 text-sm text-blue-700">
                                Since you selected Fresher, you don't need
                                to provide previous employment details.
                            </p>

                        </div>

                    )}

                    {/* EXPERIENCE */}

                    {!isFresher && (

                        <>

                            {workExperience.map(
                                (experience, index) => (

                                    <div
                                        key={index}
                                        className="rounded-xl bg-white p-6 shadow-md"
                                    >

                                        <div className="mb-6 flex items-center justify-between">

                                            <h3 className="text-lg font-semibold text-gray-800">
                                                Experience {index + 1}
                                            </h3>

                                            {workExperience.length > 1 && (

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeExperience(
                                                            index
                                                        )
                                                    }
                                                    className="text-sm font-medium text-red-600 hover:text-red-700"
                                                >
                                                    Remove
                                                </button>

                                            )}

                                        </div>

                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                                            {/* COMPANY */}

                                            <div>

                                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                                    Company Name
                                                </label>

                                                <input
                                                    type="text"
                                                    name="companyName"
                                                    value={
                                                        experience.companyName
                                                    }
                                                    onChange={(e) =>
                                                        handleChange(
                                                            index,
                                                            e
                                                        )
                                                    }
                                                    maxLength={100}
                                                    placeholder="Enter company name"
                                                    className={
                                                        errors[index]?.companyName
                                                            ? errorInputClass
                                                            : inputClass
                                                    }
                                                />

                                                {errors[index]?.companyName && (
                                                    <p className="mt-1 text-sm text-red-500">
                                                        {
                                                            errors[index]
                                                                .companyName
                                                        }
                                                    </p>
                                                )}

                                            </div>

                                            {/* JOB TITLE */}

                                            <div>

                                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                                    Job Title
                                                </label>

                                                <input
                                                    type="text"
                                                    name="jobTitle"
                                                    value={
                                                        experience.jobTitle
                                                    }
                                                    onChange={(e) =>
                                                        handleChange(
                                                            index,
                                                            e
                                                        )
                                                    }
                                                    maxLength={100}
                                                    placeholder="e.g. Software Engineer"
                                                    className={
                                                        errors[index]?.jobTitle
                                                            ? errorInputClass
                                                            : inputClass
                                                    }
                                                />

                                                {errors[index]?.jobTitle && (
                                                    <p className="mt-1 text-sm text-red-500">
                                                        {
                                                            errors[index]
                                                                .jobTitle
                                                        }
                                                    </p>
                                                )}

                                            </div>

                                            {/* EMPLOYMENT TYPE */}

                                            <div>

                                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                                    Employment Type
                                                </label>

                                                <select
                                                    name="employmentType"
                                                    value={
                                                        experience.employmentType
                                                    }
                                                    onChange={(e) =>
                                                        handleChange(
                                                            index,
                                                            e
                                                        )
                                                    }
                                                    className={
                                                        errors[index]?.employmentType
                                                            ? errorInputClass
                                                            : inputClass
                                                    }
                                                >

                                                    <option value="">
                                                        Select Type
                                                    </option>

                                                    <option value="Full Time">
                                                        Full Time
                                                    </option>

                                                    <option value="Part Time">
                                                        Part Time
                                                    </option>

                                                    <option value="Internship">
                                                        Internship
                                                    </option>

                                                    <option value="Contract">
                                                        Contract
                                                    </option>

                                                </select>

                                                {errors[index]?.employmentType && (
                                                    <p className="mt-1 text-sm text-red-500">
                                                        {
                                                            errors[index]
                                                                .employmentType
                                                        }
                                                    </p>
                                                )}

                                            </div>

                                            {/* LOCATION */}

                                            <div>

                                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                                    Work Location
                                                </label>

                                                <input
                                                    type="text"
                                                    name="workLocation"
                                                    value={
                                                        experience.workLocation
                                                    }
                                                    onChange={(e) =>
                                                        handleChange(
                                                            index,
                                                            e
                                                        )
                                                    }
                                                    maxLength={100}
                                                    placeholder="e.g. Kolkata"
                                                    className={
                                                        errors[index]?.workLocation
                                                            ? errorInputClass
                                                            : inputClass
                                                    }
                                                />

                                                {errors[index]?.workLocation && (
                                                    <p className="mt-1 text-sm text-red-500">
                                                        {
                                                            errors[index]
                                                                .workLocation
                                                        }
                                                    </p>
                                                )}

                                            </div>

                                            {/* START DATE */}

                                            <div>

                                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                                    Start Date
                                                </label>

                                                <input
                                                    type="date"
                                                    name="startDate"
                                                    value={
                                                        experience.startDate
                                                    }
                                                    onChange={(e) =>
                                                        handleChange(
                                                            index,
                                                            e
                                                        )
                                                    }
                                                    max={
                                                        new Date()
                                                            .toISOString()
                                                            .split("T")[0]
                                                    }
                                                    className={
                                                        errors[index]?.startDate
                                                            ? errorInputClass
                                                            : inputClass
                                                    }
                                                />

                                                {errors[index]?.startDate && (
                                                    <p className="mt-1 text-sm text-red-500">
                                                        {
                                                            errors[index]
                                                                .startDate
                                                        }
                                                    </p>
                                                )}

                                            </div>

                                            {/* CURRENTLY WORKING */}

                                            <div className="flex items-end">

                                                <label className="flex items-center gap-2 pb-3">

                                                    <input
                                                        type="checkbox"
                                                        name="currentlyWorking"
                                                        checked={
                                                            experience.currentlyWorking
                                                        }
                                                        onChange={(e) =>
                                                            handleChange(
                                                                index,
                                                                e
                                                            )
                                                        }
                                                        className="h-4 w-4"
                                                    />

                                                    <span className="text-sm text-gray-700">
                                                        I currently work here
                                                    </span>

                                                </label>

                                            </div>

                                            {/* END DATE */}

                                            {!experience.currentlyWorking && (

                                                <div>

                                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                                        End Date
                                                    </label>

                                                    <input
                                                        type="date"
                                                        name="endDate"
                                                        value={
                                                            experience.endDate
                                                        }
                                                        onChange={(e) =>
                                                            handleChange(
                                                                index,
                                                                e
                                                            )
                                                        }
                                                        max={
                                                            new Date()
                                                                .toISOString()
                                                                .split("T")[0]
                                                        }
                                                        className={
                                                            errors[index]?.endDate
                                                                ? errorInputClass
                                                                : inputClass
                                                        }
                                                    />

                                                    {errors[index]?.endDate && (
                                                        <p className="mt-1 text-sm text-red-500">
                                                            {
                                                                errors[index]
                                                                    .endDate
                                                            }
                                                        </p>
                                                    )}

                                                </div>

                                            )}

                                            {/* DESCRIPTION */}

                                            <div className="md:col-span-2">

                                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                                    Job Description
                                                </label>

                                                <textarea
                                                    name="jobDescription"
                                                    rows="5"
                                                    value={
                                                        experience.jobDescription
                                                    }
                                                    onChange={(e) =>
                                                        handleChange(
                                                            index,
                                                            e
                                                        )
                                                    }
                                                    maxLength={1000}
                                                    placeholder="Describe your responsibilities, projects and achievements..."
                                                    className={
                                                        errors[index]?.jobDescription
                                                            ? `${errorInputClass} resize-none`
                                                            : `${inputClass} resize-none`
                                                    }
                                                />

                                                {errors[index]?.jobDescription && (
                                                    <p className="mt-1 text-sm text-red-500">
                                                        {
                                                            errors[index]
                                                                .jobDescription
                                                        }
                                                    </p>
                                                )}

                                            </div>

                                        </div>

                                    </div>
                                )
                            )}

                            {/* ADD EXPERIENCE */}

                            <button
                                type="button"
                                onClick={addExperience}
                                className="rounded-lg border border-blue-600 px-5 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                            >
                                + Add Another Experience
                            </button>

                        </>

                    )}

                    {/* BUTTON */}

                    <div className="flex justify-end">

                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
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