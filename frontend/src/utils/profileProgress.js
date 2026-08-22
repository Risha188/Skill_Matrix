export const PROFILE_SECTIONS = [
    {
        name: "Personal Information",
        key: "personal",
        path: "/employee/personal",
    },
    {
        name: "Education",
        key: "education",
        path: "/employee/education",
    },
    {
        name: "Address",
        key: "address",
        path: "/employee/address",
    },
    {
        name: "Skills",
        key: "skills",
        path: "/employee/skills",
    },
    {
        name: "Work Experience",
        key: "experience",
        path: "/employee/experience",
    },
    {
        name: "BDM Details",
        key: "bdm",
        path: "/employee/bdm",
    }
]

export const getCompletedSections = ()=>{
    return JSON.parse(localStorage.getItem("completedProfileSections")) || [];
};

export const markSectionCompleted = (sectionKey)=>{
    const completedSections = getCompletedSections();
    
    if(!completedSections.includes(sectionKey)){
        completedSections.push(sectionKey);
    }
    
    localStorage.setItem("completedProfileSections",JSON.stringify(completedSections));
}