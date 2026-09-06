import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { markSectionCompleted } from "../../utils/profileProgress";
import { useEmployeeProfile } from "../../context/EmployeeProfileContext";
import API from "../../utils/api";

const PersonalInformation = () => {
    const navigate = useNavigate();

    const { profile, updateSection } = useEmployeeProfile();

    const [formData, setFormData] = useState({
        firstName: profile?.personalDetails?.firstName || "",
        lastName: profile?.personalDetails?.lastName || "",
        email: profile?.personalDetails?.email || "",
        phone: profile?.personalDetails?.phone || "",
        alternatePhone: profile?.personalDetails?.alternatePhone || "",
        dateOfBirth: profile?.personalDetails?.dateOfBirth || "",
        gender: profile?.personalDetails?.gender || "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // =========================================================
    // HANDLE INPUT CHANGE
    // =========================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    // =========================================================
    // FORM VALIDATION
    // =========================================================

    const validateForm = () => {
        const newErrors = {};

        // FIRST NAME
        const firstName = formData.firstName?.trim();

        if (!firstName) {
            newErrors.firstName = "First name is required";
        } else if (firstName.length < 2) {
            newErrors.firstName =
                "First name must be at least 2 characters";
        } else if (firstName.length > 50) {
            newErrors.firstName =
                "First name cannot exceed 50 characters";
        } else if (!/^[A-Za-z\s]+$/.test(firstName)) {
            newErrors.firstName =
                "First name can contain only letters";
        }

        // LAST NAME
        const lastName = formData.lastName?.trim();

        if (!lastName) {
            newErrors.lastName = "Last name is required";
        } else if (lastName.length < 2) {
            newErrors.lastName =
                "Last name must be at least 2 characters";
        } else if (lastName.length > 50) {
            newErrors.lastName =
                "Last name cannot exceed 50 characters";
        } else if (!/^[A-Za-z\s]+$/.test(lastName)) {
            newErrors.lastName =
                "Last name can contain only letters";
        }

        // EMAIL
        const email = formData.email?.trim().toLowerCase();

        if (!email) {
            newErrors.email = "Email address is required";
        } else if (
            !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
        ) {
            newErrors.email = "Enter a valid email address";
        } else if (email.length > 100) {
            newErrors.email =
                "Email cannot exceed 100 characters";
        }

        // PHONE
        const phone = formData.phone?.trim();

        if (!phone) {
            newErrors.phone = "Phone number is required";
        } else if (!/^[0-9]{10}$/.test(phone)) {
            newErrors.phone =
                "Phone number must contain exactly 10 digits";
        } else if (!/^[6-9]/.test(phone)) {
            newErrors.phone =
                "Enter a valid Indian mobile number";
        }

        // ALTERNATE PHONE
        const alternatePhone =
            formData.alternatePhone?.trim();

        if (alternatePhone) {
            if (!/^[0-9]{10}$/.test(alternatePhone)) {
                newErrors.alternatePhone =
                    "Alternate phone must contain exactly 10 digits";
            } else if (!/^[6-9]/.test(alternatePhone)) {
                newErrors.alternatePhone =
                    "Enter a valid Indian mobile number";
            } else if (alternatePhone === phone) {
                newErrors.alternatePhone =
                    "Alternate phone cannot be the same as phone number";
            }
        }

        // DATE OF BIRTH
        const dob = formData.dateOfBirth;

        if (!dob) {
            newErrors.dateOfBirth =
                "Date of birth is required";
        } else {
            const selectedDate = new Date(`${dob}T00:00:00`);
            const today = new Date();

            today.setHours(0, 0, 0, 0);

            if (selectedDate > today) {
                newErrors.dateOfBirth =
                    "Date of birth cannot be in the future";
            } else {
                let age =
                    today.getFullYear() -
                    selectedDate.getFullYear();

                const monthDifference =
                    today.getMonth() -
                    selectedDate.getMonth();

                if (
                    monthDifference < 0 ||
                    (
                        monthDifference === 0 &&
                        today.getDate() <
                            selectedDate.getDate()
                    )
                ) {
                    age--;
                }

               

                if (age > 100) {
                    newErrors.dateOfBirth =
                        "Please enter a valid date of birth";
                }
            }
        }

        // GENDER
        if (!formData.gender) {
            newErrors.gender =
                "Please select gender";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // =========================================================
    // SAVE PERSONAL INFORMATION
    // =========================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const payload = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.trim(),
                alternatePhone:
                    formData.alternatePhone?.trim() || "",
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
            };

            // IMPORTANT:
            // Employee ID belongs to the current logged-in browser tab.
            // Do NOT use a stale localStorage employee ID.
            const employeeId =
                sessionStorage.getItem("employeeId") ||
                sessionStorage.getItem("employeeUserId") ||
                "";

            console.log(
                "Saving personal information for employee:",
                employeeId
            );

            let response;

            // -------------------------------------------------
            // UPDATE EXISTING EMPLOYEE
            // -------------------------------------------------
            if (employeeId) {
                response = await API.put(
                    `/employees/${encodeURIComponent(employeeId)}/personal`,
                    payload
                );
            } else {
                // -------------------------------------------------
                // CREATE PROFILE ONLY WHEN THIS USER HAS NO PROFILE
                // -------------------------------------------------
                response = await API.post(
                    "/employees",
                    payload
                );
            }

            console.log(
                "Personal information saved:",
                response.data
            );

            const savedEmployeeId =
                response.data?.employee?.employeeId;

            if (savedEmployeeId) {
                sessionStorage.setItem(
                    "employeeId",
                    savedEmployeeId
                );
            }

            // Keep employee profile context in sync.
            updateSection(
                "personalDetails",
                payload
            );

            // This is only UI progress; the dashboard calculates
            // completion from the actual MongoDB profile.
            markSectionCompleted("personal");

            navigate("/employee/education");
        } catch (error) {
            console.error(
                "Error saving personal information:",
                error
            );

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Failed to save personal information";

            alert(message);
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // CLEAR FORM
    // =========================================================

    const handleClear = () => {
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            alternatePhone: "",
            dateOfBirth: "",
            gender: "",
        });

        setErrors({});
    };

    // =========================================================
    // STYLES
    // =========================================================

    const inputClass =
        "w-full min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

    const errorInputClass =
        "w-full min-w-0 rounded-lg border border-red-500 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100";

    const labelClass =
        "mb-2 block text-sm font-semibold text-gray-700";

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-gray-50 px-3 py-5 sm:px-4 sm:py-6 md:px-6 md:py-8">

            <div className="mx-auto w-full max-w-5xl">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="mb-6">

                    <div className="flex items-center gap-3">

                        <div>
                            <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
                                Personal Information
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Enter your basic personal and
                                contact information.
                            </p>
                        </div>

                    </div>

                </div>

                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >

                    {/* FORM HEADER */}

                    <div className="border-b border-gray-200 px-6 py-5">

                        <h2 className="text-base font-semibold text-gray-800 sm:text-lg">
                            Basic Details
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Please provide accurate information
                            for your employee profile.
                        </p>

                    </div>

                    {/* =================================================
                        FORM FIELDS
                    ================================================= */}

                    <div className="p-6">

                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:gap-x-8 sm:gap-y-6 md:grid-cols-2">

                            {/* FIRST NAME */}

                            <div>

                                <label
                                    htmlFor="firstName"
                                    className={labelClass}
                                >
                                    First Name
                                </label>

                                <input
                                    id="firstName"
                                    type="text"
                                    name="firstName"
                                    placeholder="Enter first name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={
                                        errors.firstName
                                            ? errorInputClass
                                            : inputClass
                                    }
                                />

                                {errors.firstName && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.firstName}
                                    </p>
                                )}

                            </div>

                            {/* LAST NAME */}

                            <div>

                                <label
                                    htmlFor="lastName"
                                    className={labelClass}
                                >
                                    Last Name
                                </label>

                                <input
                                    id="lastName"
                                    type="text"
                                    name="lastName"
                                    placeholder="Enter last name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={
                                        errors.lastName
                                            ? errorInputClass
                                            : inputClass
                                    }
                                />

                                {errors.lastName && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.lastName}
                                    </p>
                                )}

                            </div>

                            {/* EMAIL */}

                            <div>

                                <label
                                    htmlFor="email"
                                    className={labelClass}
                                >
                                    Email Address
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Enter email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={
                                        errors.email
                                            ? errorInputClass
                                            : inputClass
                                    }
                                />

                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.email}
                                    </p>
                                )}

                            </div>

                            {/* PHONE */}

                            <div>

                                <label
                                    htmlFor="phone"
                                    className={labelClass}
                                >
                                    Phone Number
                                </label>

                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    maxLength="10"
                                    placeholder="Enter phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={
                                        errors.phone
                                            ? errorInputClass
                                            : inputClass
                                    }
                                />

                                {errors.phone && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.phone}
                                    </p>
                                )}

                            </div>

                            {/* ALTERNATE PHONE */}

                            <div>

                                <label
                                    htmlFor="alternatePhone"
                                    className={labelClass}
                                >
                                    Alternate Phone
                                </label>

                                <input
                                    id="alternatePhone"
                                    type="tel"
                                    name="alternatePhone"
                                    maxLength="10"
                                    placeholder="Enter alternate phone"
                                    value={formData.alternatePhone}
                                    onChange={handleChange}
                                    className={
                                        errors.alternatePhone
                                            ? errorInputClass
                                            : inputClass
                                    }
                                />

                                {errors.alternatePhone && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.alternatePhone}
                                    </p>
                                )}

                            </div>

                            {/* DATE OF BIRTH */}

                            <div>

                                <label
                                    htmlFor="dateOfBirth"
                                    className={labelClass}
                                >
                                    Date of Birth
                                </label>

                                <input
                                    id="dateOfBirth"
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    className={
                                        errors.dateOfBirth
                                            ? errorInputClass
                                            : inputClass
                                    }
                                />

                                {errors.dateOfBirth && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.dateOfBirth}
                                    </p>
                                )}

                            </div>

                            {/* GENDER */}

                            <div>

                                <label
                                    htmlFor="gender"
                                    className={labelClass}
                                >
                                    Gender
                                </label>

                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className={
                                        errors.gender
                                            ? errorInputClass
                                            : inputClass
                                    }
                                >
                                    <option value="">
                                        Select Gender
                                    </option>

                                    <option value="Male">
                                        Male
                                    </option>

                                    <option value="Female">
                                        Female
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>

                                </select>

                                {errors.gender && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.gender}
                                    </p>
                                )}

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        ACTION BUTTONS
                    ================================================= */}

                    <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">

                        <button
                            type="button"
                            onClick={handleClear}
                            disabled={loading}
                            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Clear
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white sm:w-auto shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading
                                ? "Saving..."
                                : "Save & Next"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default PersonalInformation;