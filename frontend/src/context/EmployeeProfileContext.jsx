import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import API from "../utils/api.js";

const EmployeeProfileContext = createContext(null);

// ==========================================================
// EMPTY PROFILE
// ==========================================================

const EMPTY_PROFILE = {
    personalDetails: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        alternatePhone: "",
        dateOfBirth: "",
        gender: "",
    },

    education: {
        highestQualification: "",
        course: "",
        specialization: "",
        university: "",
        college: "",
        passingYear: "",
        percentage: "",
        cgpa: "",
    },

    address: {
        current: {},
        permanent: {},
        sameAsCurrent: false,
    },

    skills: [],

    workExperience: [],

    isFresher: false,

    bdmDetails: {
        nonTechnicalSkills: [],
        languagesKnown: [],
        hobbies: [],
        areasOfInterest: [],
        keyStrengths: "",
        additionalInformation: "",
    },

    profileCompleted: false,
};

// ==========================================================
// NORMALIZE EMPLOYEE DATA
// ==========================================================

const normalizeProfile = (employee) => {
    if (!employee) {
        return {
            ...EMPTY_PROFILE,

            personalDetails: {
                ...EMPTY_PROFILE.personalDetails,
            },

            education: {
                ...EMPTY_PROFILE.education,
            },

            address: {
                ...EMPTY_PROFILE.address,
                current: {},
                permanent: {},
            },

            skills: [],

            workExperience: [],

            bdmDetails: {
                ...EMPTY_PROFILE.bdmDetails,
                nonTechnicalSkills: [],
                languagesKnown: [],
                hobbies: [],
                areasOfInterest: [],
            },
        };
    }

    // ======================================================
    // PERSONAL DETAILS
    // ======================================================

    const personalDetails = {
        ...EMPTY_PROFILE.personalDetails,
        ...(employee.personalDetails || {}),
    };

    // Email is stored at employee.email by backend
    if (!personalDetails.email && employee.email) {
        personalDetails.email = employee.email;
    }

    // ======================================================
    // EDUCATION
    // ======================================================

    let education = {
        ...EMPTY_PROFILE.education,
    };

    if (Array.isArray(employee.education)) {
        education = {
            ...education,
            ...(employee.education[0] || {}),
        };
    } else if (
        employee.education &&
        typeof employee.education === "object"
    ) {
        education = {
            ...education,
            ...employee.education,
        };
    }

    // ======================================================
    // ADDRESS
    // ======================================================

    const address = {
        ...EMPTY_PROFILE.address,
        ...(employee.address || {}),

        current: {
            ...(employee.address?.current || {}),
        },

        permanent: {
            ...(employee.address?.permanent || {}),
        },
    };

    // ======================================================
    // SKILLS
    // ======================================================

    const skills = Array.isArray(employee.skills)
        ? employee.skills
        : [];

    // ======================================================
    // WORK EXPERIENCE
    // ======================================================

    const workExperience = Array.isArray(
        employee.workExperience
    )
        ? employee.workExperience
        : [];

    // ======================================================
    // BDM DETAILS
    // ======================================================

    const bdmDetails = {
        ...EMPTY_PROFILE.bdmDetails,
        ...(employee.bdmDetails || {}),

        nonTechnicalSkills: Array.isArray(
            employee.bdmDetails?.nonTechnicalSkills
        )
            ? employee.bdmDetails.nonTechnicalSkills
            : [],

        languagesKnown: Array.isArray(
            employee.bdmDetails?.languagesKnown
        )
            ? employee.bdmDetails.languagesKnown
            : [],

        hobbies: Array.isArray(
            employee.bdmDetails?.hobbies
        )
            ? employee.bdmDetails.hobbies
            : [],

        areasOfInterest: Array.isArray(
            employee.bdmDetails?.areasOfInterest
        )
            ? employee.bdmDetails.areasOfInterest
            : [],
    };

    // ======================================================
    // FINAL PROFILE
    // ======================================================

    return {
        ...employee,

        personalDetails,

        education,

        address,

        skills,

        workExperience,

        isFresher:
            employee.isFresher === true,

        bdmDetails,

        profileCompleted:
            employee.profileCompleted === true,
    };
};

// ==========================================================
// PROVIDER
// ==========================================================

export const EmployeeProfileProvider = ({
    children,
}) => {
    const [profile, setProfile] =
        useState(EMPTY_PROFILE);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    // ======================================================
    // GET EMPLOYEE ID
    // ======================================================

    const getEmployeeId = () => {
        // IMPORTANT:
        // Employee ID must belong to the current browser tab.
        // Do NOT use localStorage here.

        return (
            sessionStorage.getItem("employeeId") ||
            sessionStorage.getItem("employeeID")
        );
    };

    // ======================================================
    // GET EMPLOYEE TOKEN
    // ======================================================

    const getEmployeeToken = () => {
        return sessionStorage.getItem(
            "employeeToken"
        );
    };

    // ======================================================
    // LOAD PROFILE FROM MONGODB
    // ======================================================

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const employeeId =
                getEmployeeId();

            const employeeToken =
                getEmployeeToken();

            console.log(
                "================================="
            );

            console.log(
                "LOADING EMPLOYEE PROFILE"
            );

            console.log(
                "Employee ID:",
                employeeId
            );

            console.log(
                "Employee Token:",
                employeeToken
                    ? "Available"
                    : "Missing"
            );

            console.log(
                "================================="
            );

            // ==================================================
            // CHECK LOGIN
            // ==================================================

            if (!employeeToken) {
                setProfile({
                    ...EMPTY_PROFILE,

                    personalDetails: {
                        ...EMPTY_PROFILE.personalDetails,
                    },

                    education: {
                        ...EMPTY_PROFILE.education,
                    },

                    address: {
                        ...EMPTY_PROFILE.address,
                        current: {},
                        permanent: {},
                    },

                    bdmDetails: {
                        ...EMPTY_PROFILE.bdmDetails,
                        nonTechnicalSkills: [],
                        languagesKnown: [],
                        hobbies: [],
                        areasOfInterest: [],
                    },
                });

                setError(
                    "Employee session not found. Please login again."
                );

                return;
            }

            // ==================================================
            // CHECK EMPLOYEE ID
            // ==================================================

            if (!employeeId) {
                setProfile({
                    ...EMPTY_PROFILE,

                    personalDetails: {
                        ...EMPTY_PROFILE.personalDetails,
                    },

                    education: {
                        ...EMPTY_PROFILE.education,
                    },

                    address: {
                        ...EMPTY_PROFILE.address,
                        current: {},
                        permanent: {},
                    },

                    bdmDetails: {
                        ...EMPTY_PROFILE.bdmDetails,
                        nonTechnicalSkills: [],
                        languagesKnown: [],
                        hobbies: [],
                        areasOfInterest: [],
                    },
                });

                setError(
                    "Employee ID not found. Please login again."
                );

                return;
            }

            // ==================================================
            // BACKEND ENDPOINT
            // GET /api/employees/:employeeId
            // ==================================================

            const response = await API.get(
                `/employees/${encodeURIComponent(
                    employeeId
                )}`
            );

            console.log(
                "EMPLOYEE PROFILE API RESPONSE:",
                response.data
            );

            // ==================================================
            // BACKEND RESPONSE
            // { success: true, employee: {...} }
            // ==================================================

            const employee =
                response.data?.employee;

            if (!employee) {
                throw new Error(
                    response.data?.message ||
                    "Employee data not found."
                );
            }

            // ==================================================
            // NORMALIZE
            // ==================================================

            const normalizedProfile =
                normalizeProfile(employee);

            console.log(
                "EMPLOYEE PROFILE LOADED:",
                normalizedProfile
            );

            setProfile(
                normalizedProfile
            );

        } catch (err) {

            console.error(
                "================================="
            );

            console.error(
                "EMPLOYEE PROFILE LOAD ERROR"
            );

            console.error(
                "STATUS:",
                err.response?.status
            );

            console.error(
                "DATA:",
                err.response?.data
            );

            console.error(
                "ERROR:",
                err
            );

            console.error(
                "================================="
            );

            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to load employee profile"
            );

        } finally {
            setLoading(false);
        }
    };

    // ======================================================
    // LOAD PROFILE WHEN EMPLOYEE PANEL OPENS
    // ======================================================

    useEffect(() => {
        loadProfile();
    }, []);

    // ======================================================
    // UPDATE SECTION
    // ======================================================

    const updateSection = (
        section,
        data
    ) => {
        setProfile((prev) => ({
            ...prev,
            [section]: data,
        }));
    };

    // ======================================================
    // UPDATE MULTIPLE PROFILE VALUES
    // ======================================================

    const updateProfile = (data) => {
        setProfile((prev) => ({
            ...prev,
            ...data,
        }));
    };

    // ======================================================
    // REFRESH PROFILE FROM MONGODB
    // ======================================================

    const refreshProfile = async () => {
        await loadProfile();
    };

    // ======================================================
    // CLEAR PROFILE
    // ======================================================

    const clearProfile = () => {
        setProfile({
            ...EMPTY_PROFILE,

            personalDetails: {
                ...EMPTY_PROFILE.personalDetails,
            },

            education: {
                ...EMPTY_PROFILE.education,
            },

            address: {
                ...EMPTY_PROFILE.address,
                current: {},
                permanent: {},
            },

            skills: [],

            workExperience: [],

            bdmDetails: {
                ...EMPTY_PROFILE.bdmDetails,
                nonTechnicalSkills: [],
                languagesKnown: [],
                hobbies: [],
                areasOfInterest: [],
            },
        });

        setError("");
    };

    // ======================================================
    // CONTEXT
    // ======================================================

    return (
        <EmployeeProfileContext.Provider
            value={{
                profile,
                loading,
                error,

                updateSection,
                updateProfile,

                refreshProfile,
                clearProfile,
            }}
        >
            {children}
        </EmployeeProfileContext.Provider>
    );
};

// ==========================================================
// HOOK
// ==========================================================

export const useEmployeeProfile = () => {
    const context =
        useContext(
            EmployeeProfileContext
        );

    if (!context) {
        throw new Error(
            "useEmployeeProfile must be used inside EmployeeProfileProvider"
        );
    }

    return context;
};