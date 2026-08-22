import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { markSectionCompleted } from "../../utils/profileProgress.js";
import API from "../../utils/api.js";
import { useEmployeeProfile } from "../../context/EmployeeProfileContext";

const Address = () => {
    const navigate = useNavigate();

    const { profile, updateSection } = useEmployeeProfile();

    const defaultAddress = {
        currentAddress: "",
        currentCity: "",
        currentState: "",
        currentPincode: "",
        currentCountry: "India",

        sameAsCurrent: false,

        permanentAddress: "",
        permanentCity: "",
        permanentState: "",
        permanentPincode: "",
        permanentCountry: "India",
    };

    const [address, setAddress] = useState({
        ...defaultAddress,
        ...(profile.address || {}),
    });

    const [errors, setErrors] = useState({});

    // =========================
    // HANDLE CHANGE
    // =========================
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setAddress((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        // Remove error while correcting field
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    // =========================
    // VALIDATE ADDRESS
    // =========================
    const validateForm = () => {
        const newErrors = {};

        // =========================
        // CURRENT ADDRESS
        // =========================
        const currentAddress =
            address.currentAddress?.trim();

        if (!currentAddress) {
            newErrors.currentAddress =
                "Current address is required";
        } else if (currentAddress.length < 5) {
            newErrors.currentAddress =
                "Current address must be at least 5 characters";
        } else if (currentAddress.length > 300) {
            newErrors.currentAddress =
                "Current address cannot exceed 300 characters";
        }

        // =========================
        // CURRENT CITY
        // =========================
        const currentCity =
            address.currentCity?.trim();

        if (!currentCity) {
            newErrors.currentCity =
                "Current city is required";
        } else if (currentCity.length < 2) {
            newErrors.currentCity =
                "City must be at least 2 characters";
        } else if (!/^[A-Za-z\s.-]+$/.test(currentCity)) {
            newErrors.currentCity =
                "City can contain only letters";
        }

        // =========================
        // CURRENT STATE
        // =========================
        const currentState =
            address.currentState?.trim();

        if (!currentState) {
            newErrors.currentState =
                "Current state is required";
        } else if (currentState.length < 2) {
            newErrors.currentState =
                "State must be at least 2 characters";
        } else if (!/^[A-Za-z\s.-]+$/.test(currentState)) {
            newErrors.currentState =
                "State can contain only letters";
        }

        // =========================
        // CURRENT PINCODE
        // =========================
        const currentPincode =
            address.currentPincode?.trim();

        if (!currentPincode) {
            newErrors.currentPincode =
                "Current pincode is required";
        } else if (!/^[1-9][0-9]{5}$/.test(currentPincode)) {
            newErrors.currentPincode =
                "Pincode must be exactly 6 digits";
        }

        // =========================
        // CURRENT COUNTRY
        // =========================
        const currentCountry =
            address.currentCountry?.trim();

        if (!currentCountry) {
            newErrors.currentCountry =
                "Current country is required";
        } else if (currentCountry.length < 2) {
            newErrors.currentCountry =
                "Enter a valid country";
        }

        // =========================
        // PERMANENT ADDRESS
        // Only validate if checkbox
        // is NOT selected
        // =========================
        if (!address.sameAsCurrent) {

            const permanentAddress =
                address.permanentAddress?.trim();

            if (!permanentAddress) {
                newErrors.permanentAddress =
                    "Permanent address is required";
            } else if (permanentAddress.length < 5) {
                newErrors.permanentAddress =
                    "Permanent address must be at least 5 characters";
            } else if (permanentAddress.length > 300) {
                newErrors.permanentAddress =
                    "Permanent address cannot exceed 300 characters";
            }

            // =========================
            // PERMANENT CITY
            // =========================
            const permanentCity =
                address.permanentCity?.trim();

            if (!permanentCity) {
                newErrors.permanentCity =
                    "Permanent city is required";
            } else if (permanentCity.length < 2) {
                newErrors.permanentCity =
                    "City must be at least 2 characters";
            } else if (
                !/^[A-Za-z\s.-]+$/.test(permanentCity)
            ) {
                newErrors.permanentCity =
                    "City can contain only letters";
            }

            // =========================
            // PERMANENT STATE
            // =========================
            const permanentState =
                address.permanentState?.trim();

            if (!permanentState) {
                newErrors.permanentState =
                    "Permanent state is required";
            } else if (permanentState.length < 2) {
                newErrors.permanentState =
                    "State must be at least 2 characters";
            } else if (
                !/^[A-Za-z\s.-]+$/.test(permanentState)
            ) {
                newErrors.permanentState =
                    "State can contain only letters";
            }

            // =========================
            // PERMANENT PINCODE
            // =========================
            const permanentPincode =
                address.permanentPincode?.trim();

            if (!permanentPincode) {
                newErrors.permanentPincode =
                    "Permanent pincode is required";
            } else if (
                !/^[1-9][0-9]{5}$/.test(permanentPincode)
            ) {
                newErrors.permanentPincode =
                    "Pincode must be exactly 6 digits";
            }

            // =========================
            // PERMANENT COUNTRY
            // =========================
            const permanentCountry =
                address.permanentCountry?.trim();

            if (!permanentCountry) {
                newErrors.permanentCountry =
                    "Permanent country is required";
            } else if (permanentCountry.length < 2) {
                newErrors.permanentCountry =
                    "Enter a valid country";
            }
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // =========================
    // SUBMIT
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate first
        const isValid = validateForm();

        if (!isValid) {
            return;
        }

        try {
            const employeeId =
                localStorage.getItem("employeeId");

            if (!employeeId) {
                alert(
                    "Employee ID not found. Please complete Personal Information first."
                );
                return;
            }

            const finalAddress = {
                ...address,

                permanentAddress: address.sameAsCurrent
                    ? address.currentAddress
                    : address.permanentAddress,

                permanentCity: address.sameAsCurrent
                    ? address.currentCity
                    : address.permanentCity,

                permanentState: address.sameAsCurrent
                    ? address.currentState
                    : address.permanentState,

                permanentPincode: address.sameAsCurrent
                    ? address.currentPincode
                    : address.permanentPincode,

                permanentCountry: address.sameAsCurrent
                    ? address.currentCountry
                    : address.permanentCountry,
            };

            // Save address to backend
            const response = await API.put(
                `/employees/${employeeId}/address`,
                finalAddress
            );

            console.log(
                "Address saved:",
                response.data
            );

            // Save address in React Context
            updateSection(
                "address",
                finalAddress
            );

            // Mark section completed
            markSectionCompleted("address");

            // Go to next page
            navigate("/employee/skills");

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
                "Failed to save address details"
            );
        }
    };

    const inputClass =
        "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

    const errorInputClass =
        "w-full rounded-lg border border-red-500 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100";

    const labelClass =
        "mb-2 block text-sm font-medium text-gray-700";

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-8">

            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div className="mb-8">

                    <h2 className="text-2xl font-bold text-gray-800">
                        Address
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Enter your current and permanent address details.
                    </p>

                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="rounded-xl bg-white p-6 shadow-md"
                >

                    {/* =========================
                        CURRENT ADDRESS
                    ========================= */}
                    <div className="mb-8">

                        <h3 className="mb-5 text-lg font-semibold text-gray-800">
                            Current Address
                        </h3>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                            {/* Current Address */}
                            <div className="md:col-span-2">

                                <label
                                    className={labelClass}
                                >
                                    Address
                                </label>

                                <textarea
                                    name="currentAddress"
                                    value={address.currentAddress}
                                    onChange={handleChange}
                                    placeholder="Enter your current address"
                                    rows="3"
                                    maxLength={300}
                                    className={
                                        errors.currentAddress
                                            ? errorInputClass
                                            : inputClass
                                    }
                                />

                                {errors.currentAddress && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.currentAddress}
                                    </p>
                                )}

                            </div>

                            {/* Current City */}
                            <div>

                                <label
                                    className={labelClass}
                                >
                                    City
                                </label>

                                <input
                                    type="text"
                                    name="currentCity"
                                    value={address.currentCity}
                                    onChange={handleChange}
                                    placeholder="Enter city"
                                    maxLength={50}
                                    className={
                                        errors.currentCity
                                            ? errorInputClass
                                            : inputClass
                                    }
                                />

                                {errors.currentCity && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.currentCity}
                                    </p>
                                )}

                            </div>

                            {/* Current State */}
                            <div>

                                <label
                                    className={labelClass}
                                >
                                    State
                                </label>

                                <input
                                    type="text"
                                    name="currentState"
                                    value={address.currentState}
                                    onChange={handleChange}
                                    placeholder="Enter state"
                                    maxLength={50}
                                    className={
                                        errors.currentState
                                            ? errorInputClass
                                            : inputClass
                                    }
                                />

                                {errors.currentState && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.currentState}
                                    </p>
                                )}

                            </div>

                            {/* Current Pincode */}
                            <div>

                                <label
                                    className={labelClass}
                                >
                                    Pincode
                                </label>

                                <input
                                    type="text"
                                    name="currentPincode"
                                    value={address.currentPincode}
                                    onChange={handleChange}
                                    placeholder="Enter 6 digit pincode"
                                    maxLength={6}
                                    inputMode="numeric"
                                    className={
                                        errors.currentPincode
                                            ? errorInputClass
                                            : inputClass
                                    }
                                />

                                {errors.currentPincode && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.currentPincode}
                                    </p>
                                )}

                            </div>

                            {/* Current Country */}
                            <div>

                                <label
                                    className={labelClass}
                                >
                                    Country
                                </label>

                                <input
                                    type="text"
                                    name="currentCountry"
                                    value={address.currentCountry}
                                    onChange={handleChange}
                                    placeholder="Enter country"
                                    maxLength={50}
                                    className={
                                        errors.currentCountry
                                            ? errorInputClass
                                            : inputClass
                                    }
                                />

                                {errors.currentCountry && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.currentCountry}
                                    </p>
                                )}

                            </div>

                        </div>
                    </div>

                    {/* =========================
                        SAME AS CURRENT
                    ========================= */}
                    <div className="mb-8 border-t border-gray-200 pt-6">

                        <label className="flex cursor-pointer items-center gap-3">

                            <input
                                type="checkbox"
                                name="sameAsCurrent"
                                checked={address.sameAsCurrent}
                                onChange={handleChange}
                                className="h-4 w-4"
                            />

                            <span className="text-sm font-medium text-gray-700">
                                Permanent address is same as current address
                            </span>

                        </label>

                    </div>

                    {/* =========================
                        PERMANENT ADDRESS
                    ========================= */}
                    {!address.sameAsCurrent && (
                        <div className="mb-8">

                            <h3 className="mb-5 text-lg font-semibold text-gray-800">
                                Permanent Address
                            </h3>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                                {/* Permanent Address */}
                                <div className="md:col-span-2">

                                    <label
                                        className={labelClass}
                                    >
                                        Address
                                    </label>

                                    <textarea
                                        name="permanentAddress"
                                        value={address.permanentAddress}
                                        onChange={handleChange}
                                        placeholder="Enter your permanent address"
                                        rows="3"
                                        maxLength={300}
                                        className={
                                            errors.permanentAddress
                                                ? errorInputClass
                                                : inputClass
                                        }
                                    />

                                    {errors.permanentAddress && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.permanentAddress}
                                        </p>
                                    )}

                                </div>

                                {/* Permanent City */}
                                <div>

                                    <label
                                        className={labelClass}
                                    >
                                        City
                                    </label>

                                    <input
                                        type="text"
                                        name="permanentCity"
                                        value={address.permanentCity}
                                        onChange={handleChange}
                                        placeholder="Enter city"
                                        maxLength={50}
                                        className={
                                            errors.permanentCity
                                                ? errorInputClass
                                                : inputClass
                                        }
                                    />

                                    {errors.permanentCity && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.permanentCity}
                                        </p>
                                    )}

                                </div>

                                {/* Permanent State */}
                                <div>

                                    <label
                                        className={labelClass}
                                    >
                                        State
                                    </label>

                                    <input
                                        type="text"
                                        name="permanentState"
                                        value={address.permanentState}
                                        onChange={handleChange}
                                        placeholder="Enter state"
                                        maxLength={50}
                                        className={
                                            errors.permanentState
                                                ? errorInputClass
                                                : inputClass
                                        }
                                    />

                                    {errors.permanentState && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.permanentState}
                                        </p>
                                    )}

                                </div>

                                {/* Permanent Pincode */}
                                <div>

                                    <label
                                        className={labelClass}
                                    >
                                        Pincode
                                    </label>

                                    <input
                                        type="text"
                                        name="permanentPincode"
                                        value={address.permanentPincode}
                                        onChange={handleChange}
                                        placeholder="Enter 6 digit pincode"
                                        maxLength={6}
                                        inputMode="numeric"
                                        className={
                                            errors.permanentPincode
                                                ? errorInputClass
                                                : inputClass
                                        }
                                    />

                                    {errors.permanentPincode && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.permanentPincode}
                                        </p>
                                    )}

                                </div>

                                {/* Permanent Country */}
                                <div>

                                    <label
                                        className={labelClass}
                                    >
                                        Country
                                    </label>

                                    <input
                                        type="text"
                                        name="permanentCountry"
                                        value={address.permanentCountry}
                                        onChange={handleChange}
                                        placeholder="Enter country"
                                        maxLength={50}
                                        className={
                                            errors.permanentCountry
                                                ? errorInputClass
                                                : inputClass
                                        }
                                    />

                                    {errors.permanentCountry && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.permanentCountry}
                                        </p>
                                    )}

                                </div>

                            </div>
                        </div>
                    )}

                    {/* Button */}
                    <div className="flex justify-end border-t border-gray-200 pt-6">

                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Save & Next
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
};

export default Address;