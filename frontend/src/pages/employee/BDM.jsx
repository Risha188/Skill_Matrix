import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api.js";
import { markSectionCompleted } from "../../utils/profileProgress.js";
import { useEmployeeProfile } from "../../context/EmployeeProfileContext";

const BDM = () => {
    const navigate = useNavigate();

    const { updateSection } =
        useEmployeeProfile();

    const [bdmData, setBdmData] = useState({
        nonTechnicalSkills: [],
        languagesKnown: "",
        hobbies: "",
        areasOfInterest: "",
        keyStrengths: "",
        additionalInformation: "",
    });

    const [skillInput, setSkillInput] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [errors, setErrors] =
        useState({});

    // ==========================================
    // LOAD EXISTING BDM DATA
    // ==========================================

    useEffect(() => {

        const loadBDMDetails = async () => {

            try {

                const employeeId =
                    localStorage.getItem(
                        "employeeId"
                    );

                if (!employeeId) {
                    console.log(
                        "Employee ID not found"
                    );

                    setLoading(false);
                    return;
                }

                const response =
                    await API.get(
                        `/employees/${employeeId}`
                    );

                console.log(
                    "Employee response:",
                    response.data
                );

                const employee =
                    response.data?.employee ||
                    response.data;

                const bdm =
                    employee?.bdmDetails;

                console.log(
                    "Existing BDM:",
                    bdm
                );

                if (bdm) {

                    setBdmData({
                        nonTechnicalSkills:
                            Array.isArray(
                                bdm.nonTechnicalSkills
                            )
                                ? bdm.nonTechnicalSkills
                                : [],

                        languagesKnown:
                            Array.isArray(
                                bdm.languagesKnown
                            )
                                ? bdm.languagesKnown.join(
                                      ", "
                                  )
                                : bdm.languagesKnown ||
                                  "",

                        hobbies:
                            Array.isArray(
                                bdm.hobbies
                            )
                                ? bdm.hobbies.join(
                                      ", "
                                  )
                                : bdm.hobbies || "",

                        areasOfInterest:
                            Array.isArray(
                                bdm.areasOfInterest
                            )
                                ? bdm.areasOfInterest.join(
                                      ", "
                                  )
                                : bdm.areasOfInterest ||
                                  "",

                        keyStrengths:
                            bdm.keyStrengths || "",

                        additionalInformation:
                            bdm.additionalInformation ||
                            "",
                    });
                }

            } catch (error) {

                console.error(
                    "Error loading BDM:",
                    error.response?.data ||
                        error.message
                );

            } finally {

                setLoading(false);
            }
        };

        loadBDMDetails();

    }, []);

    // ==========================================
    // NORMAL INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setBdmData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error while typing
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    // ==========================================
    // ADD NON-TECHNICAL SKILL
    // ==========================================

    const handleAddSkill = () => {

        const value =
            skillInput.trim();

        if (!value) {

            setErrors((prev) => ({
                ...prev,
                nonTechnicalSkills:
                    "Please enter a skill",
            }));

            return;
        }

        const newSkills = value
            .split(",")
            .map((skill) =>
                skill.trim()
            )
            .filter(Boolean);

        // Validate skill length
        const invalidSkill =
            newSkills.find(
                (skill) =>
                    skill.length < 2 ||
                    skill.length > 50
            );

        if (invalidSkill) {

            setErrors((prev) => ({
                ...prev,
                nonTechnicalSkills:
                    "Each skill must be between 2 and 50 characters",
            }));

            return;
        }

        setBdmData((prev) => {

            const existingSkills =
                prev.nonTechnicalSkills || [];

            const combinedSkills = [
                ...existingSkills,
                ...newSkills,
            ];

            // Remove duplicates ignoring case
            const uniqueSkills = [
                ...new Map(
                    combinedSkills.map(
                        (skill) => [
                            skill
                                .trim()
                                .toLowerCase(),
                            skill.trim(),
                        ]
                    )
                ).values(),
            ];

            return {
                ...prev,
                nonTechnicalSkills:
                    uniqueSkills,
            };
        });

        setSkillInput("");

        setErrors((prev) => ({
            ...prev,
            nonTechnicalSkills: "",
        }));
    };

    // ==========================================
    // ENTER KEY FOR SKILL
    // ==========================================

    const handleSkillKeyDown = (e) => {

        if (e.key === "Enter") {

            e.preventDefault();

            handleAddSkill();
        }
    };

    // ==========================================
    // REMOVE SKILL
    // ==========================================

    const handleRemoveSkill = (
        skillToRemove
    ) => {

        setBdmData((prev) => ({
            ...prev,

            nonTechnicalSkills:
                prev.nonTechnicalSkills.filter(
                    (skill) =>
                        skill !==
                        skillToRemove
                ),
        }));

        setErrors((prev) => ({
            ...prev,
            nonTechnicalSkills: "",
        }));
    };

    // ==========================================
    // CONVERT TEXT TO ARRAY
    // ==========================================

    const convertToArray = (value) => {

        if (Array.isArray(value)) {
            return value;
        }

        return String(value || "")
            .split(",")
            .map((item) =>
                item.trim()
            )
            .filter(Boolean);
    };

    // ==========================================
    // VALIDATION
    // ==========================================

    const validateForm = () => {

        const newErrors = {};

        // ==========================================
        // NON-TECHNICAL SKILLS
        // ==========================================

        let finalSkills = [
            ...(bdmData.nonTechnicalSkills ||
                []),
        ];

        // Include skill currently typed
        if (skillInput.trim()) {

            const typedSkills =
                skillInput
                    .split(",")
                    .map((skill) =>
                        skill.trim()
                    )
                    .filter(Boolean);

            finalSkills = [
                ...finalSkills,
                ...typedSkills,
            ];
        }

        // Remove duplicates
        finalSkills = [
            ...new Map(
                finalSkills.map(
                    (skill) => [
                        skill
                            .trim()
                            .toLowerCase(),
                        skill.trim(),
                    ]
                )
            ).values(),
        ];

        if (finalSkills.length === 0) {

            newErrors.nonTechnicalSkills =
                "Please add at least one non-technical skill";

        } else {

            const invalidSkill =
                finalSkills.find(
                    (skill) =>
                        skill.length < 2 ||
                        skill.length > 50
                );

            if (invalidSkill) {

                newErrors.nonTechnicalSkills =
                    "Each skill must be between 2 and 50 characters";
            }
        }

        // ==========================================
        // LANGUAGES
        // ==========================================

        const languages =
            convertToArray(
                bdmData.languagesKnown
            );

        if (languages.length === 0) {

            newErrors.languagesKnown =
                "Please enter at least one language";

        } else {

            const invalidLanguage =
                languages.find(
                    (language) =>
                        language.length < 2 ||
                        language.length > 50
                );

            if (invalidLanguage) {

                newErrors.languagesKnown =
                    "Each language must be between 2 and 50 characters";
            }
        }

        // ==========================================
        // HOBBIES
        // ==========================================

        const hobbies =
            convertToArray(
                bdmData.hobbies
            );

        if (hobbies.length === 0) {

            newErrors.hobbies =
                "Please enter at least one hobby";

        } else if (
            hobbies.some(
                (hobby) =>
                    hobby.length > 100
            )
        ) {

            newErrors.hobbies =
                "Each hobby cannot exceed 100 characters";
        }

        // ==========================================
        // AREAS OF INTEREST
        // ==========================================

        const areasOfInterest =
            convertToArray(
                bdmData.areasOfInterest
            );

        if (areasOfInterest.length === 0) {

            newErrors.areasOfInterest =
                "Please enter at least one area of interest";

        } else if (
            areasOfInterest.some(
                (area) =>
                    area.length > 100
            )
        ) {

            newErrors.areasOfInterest =
                "Each area of interest cannot exceed 100 characters";
        }

        // ==========================================
        // KEY STRENGTHS
        // ==========================================

        const keyStrengths =
            bdmData.keyStrengths?.trim();

        if (!keyStrengths) {

            newErrors.keyStrengths =
                "Key strengths are required";

        } else if (
            keyStrengths.length < 10
        ) {

            newErrors.keyStrengths =
                "Key strengths must be at least 10 characters";

        } else if (
            keyStrengths.length > 500
        ) {

            newErrors.keyStrengths =
                "Key strengths cannot exceed 500 characters";
        }

        // ==========================================
        // ADDITIONAL INFORMATION
        // ==========================================

        const additionalInformation =
            bdmData.additionalInformation?.trim();

        // Optional field
        if (
            additionalInformation &&
            additionalInformation.length > 1000
        ) {

            newErrors.additionalInformation =
                "Additional information cannot exceed 1000 characters";
        }

        setErrors(newErrors);

        return (
            Object.keys(newErrors).length ===
            0
        );
    };

    // ==========================================
    // SAVE BDM
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (saving) {
            return;
        }

        // Validate first
        const isValid =
            validateForm();

        if (!isValid) {
            return;
        }

        try {

            setSaving(true);

            const employeeId =
                localStorage.getItem(
                    "employeeId"
                );

            if (!employeeId) {

                alert(
                    "Employee ID not found."
                );

                return;
            }

            // ==========================================
            // FINAL SKILLS
            // ==========================================

            let finalSkills = [
                ...(bdmData.nonTechnicalSkills ||
                    []),
            ];

            if (skillInput.trim()) {

                const typedSkills =
                    skillInput
                        .split(",")
                        .map((skill) =>
                            skill.trim()
                        )
                        .filter(Boolean);

                finalSkills = [
                    ...finalSkills,
                    ...typedSkills,
                ];
            }

            // Remove duplicates
            finalSkills = [
                ...new Map(
                    finalSkills.map(
                        (skill) => [
                            skill
                                .trim()
                                .toLowerCase(),
                            skill.trim(),
                        ]
                    )
                ).values(),
            ];

            const payload = {

                nonTechnicalSkills:
                    finalSkills,

                languagesKnown:
                    convertToArray(
                        bdmData.languagesKnown
                    ),

                hobbies:
                    convertToArray(
                        bdmData.hobbies
                    ),

                areasOfInterest:
                    convertToArray(
                        bdmData.areasOfInterest
                    ),

                keyStrengths:
                    bdmData.keyStrengths.trim(),

                additionalInformation:
                    bdmData
                        .additionalInformation
                        .trim(),
            };

            console.log(
                "========== SAVING BDM =========="
            );

            console.log(
                "Employee ID:",
                employeeId
            );

            console.log(
                "Payload:",
                payload
            );

            const response =
                await API.put(
                    `/employees/${employeeId}/bdm`,
                    payload
                );

            if (
                response.data?.success
            ) {

                // Update React context
                updateSection(
                    "bdmDetails",
                    response.data
                        .bdmDetails
                );

                // Mark completed
                markSectionCompleted(
                    "bdm"
                );

                navigate(
                    "/employee/declaration"
                );
            }

        } catch (error) {

            console.error(
                "BDM Save Error:",
                error.response?.data ||
                    error.message
            );

            alert(
                error.response?.data
                    ?.message ||
                "Failed to save BDM details"
            );

        } finally {

            setSaving(false);
        }
    };

    // ==========================================
    // CLEAR
    // ==========================================

    const handleClear = () => {

        setBdmData({
            nonTechnicalSkills: [],
            languagesKnown: "",
            hobbies: "",
            areasOfInterest: "",
            keyStrengths: "",
            additionalInformation: "",
        });

        setSkillInput("");

        setErrors({});
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="flex min-h-[500px] items-center justify-center">

                <p className="text-gray-500">
                    Loading BDM details...
                </p>

            </div>
        );
    }

    // ==========================================
    // UI
    // ==========================================

    const inputClass =
        "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

    const errorInputClass =
        "w-full rounded-lg border border-red-500 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100";

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-8">

            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div className="mb-8">

                    <h1 className="text-2xl font-bold text-gray-800">
                        BDM Details
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Add your non-technical skills,
                        interests and professional qualities.
                    </p>

                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="overflow-hidden rounded-xl bg-white shadow-md"
                >

                    {/* Header */}
                    <div className="border-b border-gray-200 px-6 py-5">

                        <h2 className="text-lg font-semibold text-gray-800">
                            Additional Skills & Professional Qualities
                        </h2>

                    </div>

                    <div className="p-6">

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                            {/* ================================= */}
                            {/* NON TECHNICAL SKILLS */}
                            {/* ================================= */}

                            <div className="md:col-span-2">

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Non-Technical Skills
                                </label>

                                <div className="flex gap-3">

                                    <input
                                        type="text"
                                        value={skillInput}
                                        onChange={(e) =>
                                            setSkillInput(
                                                e.target.value
                                            )
                                        }
                                        onKeyDown={
                                            handleSkillKeyDown
                                        }
                                        placeholder="Communication, Leadership, Teamwork"
                                        maxLength={200}
                                        className={
                                            errors.nonTechnicalSkills
                                                ? errorInputClass
                                                : inputClass
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={
                                            handleAddSkill
                                        }
                                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                                    >
                                        Add Skill
                                    </button>

                                </div>

                                {errors.nonTechnicalSkills && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {
                                            errors.nonTechnicalSkills
                                        }
                                    </p>
                                )}

                                {/* Added Skills */}
                                {bdmData
                                    .nonTechnicalSkills
                                    .length > 0 && (

                                    <div className="mt-4 flex flex-wrap gap-2">

                                        {bdmData
                                            .nonTechnicalSkills
                                            .map(
                                                (
                                                    skill,
                                                    index
                                                ) => (

                                                    <div
                                                        key={`${skill}-${index}`}
                                                        className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm text-blue-700"
                                                    >

                                                        <span>
                                                            {skill}
                                                        </span>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveSkill(
                                                                    skill
                                                                )
                                                            }
                                                            className="font-bold text-red-500 hover:text-red-700"
                                                        >
                                                            ×
                                                        </button>

                                                    </div>
                                                )
                                            )}

                                    </div>
                                )}

                            </div>

                            {/* ================================= */}
                            {/* LANGUAGES */}
                            {/* ================================= */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Languages Known
                                </label>

                                <input
                                    type="text"
                                    name="languagesKnown"
                                    value={
                                        bdmData.languagesKnown
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="English, Hindi, Bengali"
                                    maxLength={200}
                                    className={
                                        errors.languagesKnown
                                            ? errorInputClass
                                            : inputClass
                                    }
                                />

                                {errors.languagesKnown && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {
                                            errors.languagesKnown
                                        }
                                    </p>
                                )}

                                <p className="mt-1 text-xs text-gray-400">
                                    Separate multiple languages with commas.
                                </p>

                            </div>

                            {/* ================================= */}
                            {/* HOBBIES */}
                            {/* ================================= */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Hobbies
                                </label>

                                <input
                                    type="text"
                                    name="hobbies"
                                    value={
                                        bdmData.hobbies
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Cricket, Reading"
                                    maxLength={200}
                                    className={
                                        errors.hobbies
                                            ? errorInputClass
                                            : inputClass
                                    }
                                />

                                {errors.hobbies && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.hobbies}
                                    </p>
                                )}

                            </div>

                            {/* ================================= */}
                            {/* AREAS OF INTEREST */}
                            {/* ================================= */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Areas of Interest
                                </label>

                                <input
                                    type="text"
                                    name="areasOfInterest"
                                    value={
                                        bdmData.areasOfInterest
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Cooking, Management"
                                    maxLength={200}
                                    className={
                                        errors.areasOfInterest
                                            ? errorInputClass
                                            : inputClass
                                    }
                                />

                                {errors.areasOfInterest && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {
                                            errors.areasOfInterest
                                        }
                                    </p>
                                )}

                            </div>

                            {/* ================================= */}
                            {/* KEY STRENGTHS */}
                            {/* ================================= */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Key Strengths
                                </label>

                                <textarea
                                    name="keyStrengths"
                                    rows="4"
                                    value={
                                        bdmData.keyStrengths
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    maxLength={500}
                                    placeholder="Willpower, Leadership..."
                                    className={
                                        errors.keyStrengths
                                            ? `${errorInputClass} resize-none`
                                            : `${inputClass} resize-none`
                                    }
                                />

                                {errors.keyStrengths && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {
                                            errors.keyStrengths
                                        }
                                    </p>
                                )}

                            </div>

                            {/* ================================= */}
                            {/* ADDITIONAL INFORMATION */}
                            {/* ================================= */}

                            <div className="md:col-span-2">

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Additional Information
                                </label>

                                <textarea
                                    name="additionalInformation"
                                    rows="4"
                                    value={
                                        bdmData.additionalInformation
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    maxLength={1000}
                                    placeholder="Anything else you want to mention..."
                                    className={
                                        errors.additionalInformation
                                            ? `${errorInputClass} resize-none`
                                            : `${inputClass} resize-none`
                                    }
                                />

                                {errors.additionalInformation && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {
                                            errors.additionalInformation
                                        }
                                    </p>
                                )}

                            </div>

                        </div>

                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">

                        <button
                            type="button"
                            onClick={handleClear}
                            disabled={saving}
                            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Clear
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving
                                ? "Saving..."
                                : "Save & Next"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
};

export default BDM;