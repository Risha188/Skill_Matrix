import {
    createContext,
    useContext,
    useState,
} from "react";

// =========================================================
// INITIAL EMPLOYEE PROFILE
// =========================================================

const INITIAL_PROFILE = {
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
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "",
        pinCode: "",
    },

    skills: [],

    workExperience: [],

    bdmDetails: {
        bdmName: "",
        bdmEmail: "",
        bdmPhone: "",
    },
};

// =========================================================
// CONTEXT
// =========================================================

const EmployeeProfileContext = createContext(null);

// =========================================================
// PROVIDER
// =========================================================

export const EmployeeProfileProvider = ({
    children,
}) => {

    const [profile, setProfile] = useState(
        INITIAL_PROFILE
    );

    // =====================================================
    // UPDATE ENTIRE SECTION
    // =====================================================

    const updateSection = (
        section,
        data
    ) => {

        setProfile((prev) => ({
            ...prev,

            [section]: data,
        }));
    };

    // =====================================================
    // UPDATE PART OF AN OBJECT SECTION
    // =====================================================

    const updateSectionFields = (
        section,
        data
    ) => {

        setProfile((prev) => ({
            ...prev,

            [section]: {
                ...prev[section],
                ...data,
            },
        }));
    };

    // =====================================================
    // ADD SKILL
    // =====================================================

    const addSkill = (skill) => {

        if (!skill) {
            return;
        }

        setProfile((prev) => ({
            ...prev,

            skills: [
                ...prev.skills,
                skill,
            ],
        }));
    };

    // =====================================================
    // REMOVE SKILL
    // =====================================================

    const removeSkill = (index) => {

        setProfile((prev) => ({
            ...prev,

            skills: prev.skills.filter(
                (_, skillIndex) =>
                    skillIndex !== index
            ),
        }));
    };

    // =====================================================
    // UPDATE SKILLS
    // =====================================================

    const updateSkills = (skills) => {

        setProfile((prev) => ({
            ...prev,

            skills: Array.isArray(skills)
                ? skills
                : [],
        }));
    };

    // =====================================================
    // ADD WORK EXPERIENCE
    // =====================================================

    const addWorkExperience = (
        experience
    ) => {

        if (!experience) {
            return;
        }

        setProfile((prev) => ({
            ...prev,

            workExperience: [
                ...prev.workExperience,
                experience,
            ],
        }));
    };

    // =====================================================
    // UPDATE WORK EXPERIENCE
    // =====================================================

    const updateWorkExperience = (
        experiences
    ) => {

        setProfile((prev) => ({
            ...prev,

            workExperience:
                Array.isArray(experiences)
                    ? experiences
                    : [],
        }));
    };

    // =====================================================
    // REMOVE WORK EXPERIENCE
    // =====================================================

    const removeWorkExperience = (
        index
    ) => {

        setProfile((prev) => ({
            ...prev,

            workExperience:
                prev.workExperience.filter(
                    (_, experienceIndex) =>
                        experienceIndex !== index
                ),
        }));
    };

    // =====================================================
    // CLEAR PROFILE
    // =====================================================

    const clearProfile = () => {

        setProfile({
            personalDetails: {
                ...INITIAL_PROFILE.personalDetails,
            },

            education: {
                ...INITIAL_PROFILE.education,
            },

            address: {
                ...INITIAL_PROFILE.address,
            },

            skills: [],

            workExperience: [],

            bdmDetails: {
                ...INITIAL_PROFILE.bdmDetails,
            },
        });
    };

    // =====================================================
    // CONTEXT VALUE
    // =====================================================

    const value = {
        profile,

        updateSection,
        updateSectionFields,

        addSkill,
        removeSkill,
        updateSkills,

        addWorkExperience,
        updateWorkExperience,
        removeWorkExperience,

        clearProfile,
    };

    return (
        <EmployeeProfileContext.Provider
            value={value}
        >
            {children}
        </EmployeeProfileContext.Provider>
    );
};

// =========================================================
// CUSTOM HOOK
// =========================================================

export const useEmployeeProfile = () => {

    const context = useContext(
        EmployeeProfileContext
    );

    if (!context) {
        throw new Error(
            "useEmployeeProfile must be used inside EmployeeProfileProvider"
        );
    }

    return context;
};