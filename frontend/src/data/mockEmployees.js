const employees = [
    {
        employeeId: "EMP001",

        personalDetails: {
            firstName: "Rahul",
            lastName: "Das",
            email: "rahul@example.com",
            phone: "9876543210"
        },

        qualification: {
            degree: "B.Tech",
            specialization: "Computer Science",
            university: "MAKAUT"
        },

        education: {
            highestQualification: "B.Tech",
            passingYear: "2025"
        },

        address: {
            city: "Kolkata",
            state: "West Bengal",
            country: "India"
        },

        primarySkills: [
            "React.js",
            "JavaScript",
            "Node.js",
            "MongoDB"
        ],

        secondarySkills: [
            "Communication",
            "Teamwork",
            "Problem Solving",
            "Leadership"
        ],

        presentStatus: "Active",

        bdmDetails: {
            bdmName: "John Doe",
            bdmEmail: "john@example.com"
        }
    },

    {
        employeeId: "EMP002",

        personalDetails: {
            firstName: "Priya",
            lastName: "Sharma",
            email: "priya@example.com",
            phone: "9876543211"
        },

        qualification: {
            degree: "B.Tech",
            specialization: "Information Technology",
            university: "MAKAUT"
        },

        education: {
            highestQualification: "B.Tech",
            passingYear: "2024"
        },

        address: {
            city: "Howrah",
            state: "West Bengal",
            country: "India"
        },

        primarySkills: [
            "Python",
            "SQL",
            "Power BI"
        ],

        secondarySkills: [
            "Analytical Thinking",
            "Communication",
            "Time Management",
            "Teamwork"
        ],

        presentStatus: "Active",

        bdmDetails: {
            bdmName: "Jane Doe",
            bdmEmail: "jane@example.com"
        }
    },

    {
        employeeId: "EMP003",

        personalDetails: {
            firstName: "Amit",
            lastName: "Roy",
            email: "amit@example.com",
            phone: "9876543212"
        },

        qualification: {
            degree: "B.Tech",
            specialization: "Computer Science",
            university: "MAKAUT"
        },

        education: {
            highestQualification: "B.Tech",
            passingYear: "2025"
        },

        address: {
            city: "Kolkata",
            state: "West Bengal",
            country: "India"
        },

        primarySkills: [
            "React.js",
            "Node.js",
            "Express.js",
            "MongoDB"
        ],

        secondarySkills: [
            "Leadership",
            "Problem Solving",
            "Teamwork",
            "Adaptability"
        ],

        presentStatus: "Active",

        bdmDetails: {
            bdmName: "Robert Smith",
            bdmEmail: "robert@example.com"
        }
    },

    {
        employeeId: "EMP004",

        personalDetails: {
            firstName: "Sneha",
            lastName: "Paul",
            email: "sneha@example.com",
            phone: "9876543213"
        },

        qualification: {
            degree: "B.Tech",
            specialization: "Information Technology",
            university: "MAKAUT"
        },

        education: {
            highestQualification: "B.Tech",
            passingYear: "2023"
        },

        address: {
            city: "Durgapur",
            state: "West Bengal",
            country: "India"
        },

        primarySkills: [
            "React.js",
            "TypeScript",
            "Tailwind CSS",
            "Next.js"
        ],

        secondarySkills: [
            "Creativity",
            "Communication",
            "Teamwork",
            "Time Management"
        ],

        presentStatus: "Inactive",

        bdmDetails: {
            bdmName: "Michael Brown",
            bdmEmail: "michael@example.com"
        }
    },

    {
        employeeId: "EMP005",

        personalDetails: {
            firstName: "Arjun",
            lastName: "Sen",
            email: "arjun@example.com",
            phone: "9876543214"
        },

        qualification: {
            degree: "B.Tech",
            specialization: "Computer Science",
            university: "MAKAUT"
        },

        education: {
            highestQualification: "B.Tech",
            passingYear: "2024"
        },

        address: {
            city: "Siliguri",
            state: "West Bengal",
            country: "India"
        },

        primarySkills: [
            "Java",
            "Spring Boot",
            "MySQL",
            "REST API"
        ],

        secondarySkills: [
            "Critical Thinking",
            "Communication",
            "Leadership",
            "Teamwork"
        ],

        presentStatus: "Active",

        bdmDetails: {
            bdmName: "David Wilson",
            bdmEmail: "david@example.com"
        }
    },

    {
        employeeId: "EMP006",

        personalDetails: {
            firstName: "Ananya",
            lastName: "Ghosh",
            email: "ananya@example.com",
            phone: "9876543215"
        },

        qualification: {
            degree: "B.Tech",
            specialization: "Electronics and Communication",
            university: "MAKAUT"
        },

        education: {
            highestQualification: "B.Tech",
            passingYear: "2025"
        },

        address: {
            city: "Kolkata",
            state: "West Bengal",
            country: "India"
        },

        primarySkills: [
            "Python",
            "Django",
            "PostgreSQL",
            "REST API"
        ],

        secondarySkills: [
            "Problem Solving",
            "Communication",
            "Adaptability",
            "Teamwork"
        ],

        presentStatus: "Active",

        bdmDetails: {
            bdmName: "Emily Johnson",
            bdmEmail: "emily@example.com"
        }
    },

    {
        employeeId: "EMP007",

        personalDetails: {
            firstName: "Vikram",
            lastName: "Mukherjee",
            email: "vikram@example.com",
            phone: "9876543216"
        },

        qualification: {
            degree: "MCA",
            specialization: "Computer Applications",
            university: "MAKAUT"
        },

        education: {
            highestQualification: "MCA",
            passingYear: "2024"
        },

        address: {
            city: "Howrah",
            state: "West Bengal",
            country: "India"
        },

        primarySkills: [
            "Angular",
            "TypeScript",
            "Firebase",
            "JavaScript"
        ],

        secondarySkills: [
            "Leadership",
            "Decision Making",
            "Teamwork",
            "Communication"
        ],

        presentStatus: "Active",

        bdmDetails: {
            bdmName: "Daniel Miller",
            bdmEmail: "daniel@example.com"
        }
    },

    {
        employeeId: "EMP008",

        personalDetails: {
            firstName: "Riya",
            lastName: "Chatterjee",
            email: "riya@example.com",
            phone: "9876543217"
        },

        qualification: {
            degree: "B.Tech",
            specialization: "Information Technology",
            university: "MAKAUT"
        },

        education: {
            highestQualification: "B.Tech",
            passingYear: "2025"
        },

        address: {
            city: "Kolkata",
            state: "West Bengal",
            country: "India"
        },

        primarySkills: [
            "HTML",
            "CSS",
            "JavaScript",
            "Bootstrap"
        ],

        secondarySkills: [
            "Creativity",
            "Communication",
            "Teamwork",
            "Time Management"
        ],

        presentStatus: "Active",

        bdmDetails: {
            bdmName: "Sophia Anderson",
            bdmEmail: "sophia@example.com"
        }
    },

    {
        employeeId: "EMP009",

        personalDetails: {
            firstName: "Sourav",
            lastName: "Banerjee",
            email: "sourav@example.com",
            phone: "9876543218"
        },

        qualification: {
            degree: "B.Tech",
            specialization: "Computer Science",
            university: "MAKAUT"
        },

        education: {
            highestQualification: "B.Tech",
            passingYear: "2023"
        },

        address: {
            city: "Bardhaman",
            state: "West Bengal",
            country: "India"
        },

        primarySkills: [
            "C++",
            "Python",
            "Data Structures",
            "Algorithms"
        ],

        secondarySkills: [
            "Analytical Thinking",
            "Problem Solving",
            "Research",
            "Communication"
        ],

        presentStatus: "Inactive",

        bdmDetails: {
            bdmName: "William Taylor",
            bdmEmail: "william@example.com"
        }
    },

    {
        employeeId: "EMP010",

        personalDetails: {
            firstName: "Neha",
            lastName: "Agarwal",
            email: "neha@example.com",
            phone: "9876543219"
        },

        qualification: {
            degree: "B.Tech",
            specialization: "Computer Science",
            university: "MAKAUT"
        },

        education: {
            highestQualification: "B.Tech",
            passingYear: "2024"
        },

        address: {
            city: "Kolkata",
            state: "West Bengal",
            country: "India"
        },

        primarySkills: [
            "Vue.js",
            "JavaScript",
            "Node.js",
            "MySQL"
        ],

        secondarySkills: [
            "Communication",
            "Leadership",
            "Problem Solving",
            "Adaptability"
        ],

        presentStatus: "Active",

        bdmDetails: {
            bdmName: "Olivia Thomas",
            bdmEmail: "olivia@example.com"
        }
    }
];

export default employees;