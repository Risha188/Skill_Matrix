import { createContext, useContext, useState } from "react";

const EmployeeProfileContext = createContext();

export const EmployeeProfileProvider = ({ children }) => {

    const [profile, setProfile] = useState({
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

        address: {},

        skills: [],

        workExperience: [],

        bdmDetails: {},

    });

    const updateSection = (section, data) => {

        setProfile((prev) => ({
            ...prev,
            [section]: data,
        }));

    };

    const clearProfile = () => {

        setProfile({
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

            address: {},

            skills: [],

            workExperience: [],

            bdmDetails: {},
        });

    };

    return (
        <EmployeeProfileContext.Provider
            value={{
                profile,
                updateSection,
                clearProfile,
            }}
        >
            {children}
        </EmployeeProfileContext.Provider>
    );
};

export const useEmployeeProfile = () => {

    return useContext(EmployeeProfileContext);

};