import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { markSectionCompleted } from "../../utils/profileProgress";
import { useEmployeeProfile } from "../../context/EmployeeProfileContext";

const PersonalInformation = () => {
    const navigate = useNavigate();

    const { profile, updateSection } = useEmployeeProfile();

    const [formData, setFormData] = useState(profile.personalDetails);

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        //remove error while user is typing
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

     // FORM VALIDATION
    // =========================
    const validateForm = () => {
        const newErrors = {};

        // -------------------------
        // FIRST NAME
        // -------------------------
        const firstName = formData.firstName?.trim();

        if (!firstName) {
            newErrors.firstName = "First name is required";
        } else if (firstName.length < 2) {
            newErrors.firstName = "First name must be at least 2 characters";
        } else if (firstName.length > 50) {
            newErrors.firstName = "First name cannot exceed 50 characters";
        } else if (!/^[A-Za-z\s]+$/.test(firstName)) {
            newErrors.firstName =
                "First name can contain only letters";
        }

        // -------------------------
        // LAST NAME
        // -------------------------
        const lastName = formData.lastName?.trim();

        if (!lastName) {
            newErrors.lastName = "Last name is required";
        } else if (lastName.length < 2) {
            newErrors.lastName = "Last name must be at least 2 characters";
        } else if (lastName.length > 50) {
            newErrors.lastName = "Last name cannot exceed 50 characters";
        } else if (!/^[A-Za-z\s]+$/.test(lastName)) {
            newErrors.lastName =
                "Last name can contain only letters";
        }

        // -------------------------
        // EMAIL
        // -------------------------
        const email = formData.email?.trim();

        if (!email) {
            newErrors.email = "Email address is required";
        } else if (
            !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
        ) {
            newErrors.email = "Enter a valid email address";
        } else if (email.length > 100) {
            newErrors.email = "Email cannot exceed 100 characters";
        }

        // -------------------------
        // PHONE
        // -------------------------
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

        // -------------------------
        // ALTERNATE PHONE
        // -------------------------
        const alternatePhone = formData.alternatePhone?.trim();

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

        // -------------------------
        // DATE OF BIRTH
        // -------------------------
        const dob = formData.dateOfBirth;

        if (!dob) {
            newErrors.dateOfBirth = "Date of birth is required";
        } else {
            const selectedDate = new Date(dob);
            const today = new Date();

            // Remove time
            today.setHours(0, 0, 0, 0);

            if (selectedDate > today) {
                newErrors.dateOfBirth =
                    "Date of birth cannot be in the future";
            }

            // Calculate age
            let age =
                today.getFullYear() -
                selectedDate.getFullYear();

            const monthDifference =
                today.getMonth() -
                selectedDate.getMonth();

            if (
                monthDifference < 0 ||
                (monthDifference === 0 &&
                    today.getDate() < selectedDate.getDate())
            ) {
                age--;
            }

            if (age < 18) {
                newErrors.dateOfBirth =
                    "Employee must be at least 18 years old";
            }

            if (age > 100) {
                newErrors.dateOfBirth =
                    "Please enter a valid date of birth";
            }
        }

        // -------------------------
        // GENDER
        // -------------------------
        if (!formData.gender) {
            newErrors.gender = "Please select gender";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        // Validate before API call
        const isValid = validateForm();

        if (!isValid) {
            return;
        }

        try {
            const response = await API.post(
                "/employees",
                {
                    ...formData,
                }
            );

            console.log("Employee saved:", response.data);

            // Store employee ID
            localStorage.setItem(
                "employeeId",
                response.data.employee.employeeId
            );

            // Store personal details in Context
            updateSection(
                "personalDetails",
                formData
            );

            markSectionCompleted("personal");

            navigate("/employee/education");

        } catch (error) {
            console.error(
                "Error saving employee:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to save personal information"
            );
        }
    };

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

    const inputClass =
        "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

    const errorInputClass =
        "w-full rounded-lg border border-red-500 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100";

    const labelClass =
        "mb-2 block text-sm font-semibold text-gray-700";

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-8">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3">

                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Personal Information
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Enter your basic personal and contact information.
                            </p>
                        </div>

                    </div>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >

                    {/* Form Header */}
                    <div className="border-b border-gray-200 px-6 py-5">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Basic Details
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Please provide accurate information for your employee profile.
                        </p>
                    </div>

                    {/* Form Fields */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">

                            {/* Employee ID */}
                            <div>
                                <label htmlFor="employeeId" className={labelClass}>
                                    Employee ID
                                </label>

                                <input
                                    id="employeeId"
                                    type="text"
                                    name="employeeId"
                                    placeholder="Enter employee ID"
                                    value={formData.employeeId}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>

                            {/* First Name */}
                            <div>
                                <label htmlFor="firstName" className={labelClass}>
                                    First Name
                                </label>

                                <input
                                    id="firstName"
                                    type="text"
                                    name="firstName"
                                    placeholder="Enter first name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                />
                            </div>

                            {/* Last Name */}
                            <div>
                                <label htmlFor="lastName" className={labelClass}>
                                    Last Name
                                </label>

                                <input
                                    id="lastName"
                                    type="text"
                                    name="lastName"
                                    placeholder="Enter last name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className={labelClass}>
                                    Email Address
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Enter email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className={labelClass}>
                                    Phone Number
                                </label>

                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    placeholder="Enter phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                />
                            </div>

                            {/* Alternate Phone */}
                            <div>
                                <label htmlFor="alternatePhone" className={labelClass}>
                                    Alternate Phone
                                </label>

                                <input
                                    id="alternatePhone"
                                    type="tel"
                                    name="alternatePhone"
                                    placeholder="Enter alternate phone"
                                    value={formData.alternatePhone}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label htmlFor="dateOfBirth" className={labelClass}>
                                    Date of Birth
                                </label>

                                <input
                                    id="dateOfBirth"
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>

                            {/* Gender */}
                            <div>
                                <label htmlFor="gender" className={labelClass}>
                                    Gender
                                </label>

                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className={inputClass}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">

                        <button
                            type="button"
                            onClick={handleClear}
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

export default PersonalInformation;