export const PROFILE_SECTIONS = [
    {
        key: "personal",
        name: "Personal Information",
        path: "/employee/personal"
    },

    {
        key: "education",
        name: "Education",
        path: "/employee/education"
    },

    {
        key: "address",
        name: "Address",
        path: "/employee/address"
    },

    {
        key: "skills",
        name: "Skills",
        path: "/employee/skills"
    },

    {
        key: "experience",
        name: "Work Experience",
        path: "/employee/experience"
    },

    {
        key: "bdm",
        name: "BDM Details",
        path: "/employee/bdm"
    },

    {
        key: "declaration",
        name: "Declaration",
        path: "/employee/declaration"
    }
];


// ==========================================
// GET COMPLETED SECTIONS
// ==========================================

export const getCompletedSections = () => {

    try {

        const completed =
            sessionStorage.getItem(
                "completedSections"
            );

        if (!completed) {
            return [];
        }

        return JSON.parse(completed);

    } catch (error) {

        console.error(
            "Error reading completed sections:",
            error
        );

        return [];
    }
};


// ==========================================
// MARK SECTION COMPLETED
// ==========================================

export const markSectionCompleted = (
    sectionKey
) => {

    const completed =
        getCompletedSections();

    if (!completed.includes(sectionKey)) {

        completed.push(sectionKey);

        sessionStorage.setItem(
            "completedSections",
            JSON.stringify(completed)
        );
    }

    window.dispatchEvent(
        new Event(
            "profileProgressUpdated"
        )
    );
};


// ==========================================
// REMOVE SECTION COMPLETION
// ==========================================

export const removeSectionCompleted = (
    sectionKey
) => {

    const completed =
        getCompletedSections();

    const updated =
        completed.filter(
            (key) => key !== sectionKey
        );

    sessionStorage.setItem(
        "completedSections",
        JSON.stringify(updated)
    );

    window.dispatchEvent(
        new Event(
            "profileProgressUpdated"
        )
    );
};


// ==========================================
// CLEAR ALL PROGRESS
// ==========================================

export const clearCompletedSections = () => {

    sessionStorage.removeItem(
        "completedSections"
    );

    window.dispatchEvent(
        new Event(
            "profileProgressUpdated"
        )
    );
};


// ==========================================
// GET PROGRESS PERCENTAGE
// ==========================================

export const getProfileProgress = () => {

    const completed =
        getCompletedSections();

    const total =
        PROFILE_SECTIONS.length;

    if (total === 0) {
        return 0;
    }

    return Math.round(
        (completed.length / total) * 100
    );
};