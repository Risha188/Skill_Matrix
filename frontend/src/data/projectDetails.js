const projectDetails = [
    {
        id: 1,
        projectName: "SkillMatrix",
        projectCode: "PRJ001",

        description:
            "SkillMatrix is an employee skill management platform that helps organizations maintain employee profiles, track technical skills, manage employee information, and assign employees to projects.",

        projectOverview:
            "The platform provides separate employee and admin panels for managing employee information, skills, project assignments, and workforce data.",

        skills: [
            "React.js",
            "JavaScript",
            "Tailwind CSS",
            "Node.js",
            "Express.js",
            "MongoDB",
            "REST API",
        ],

        technologies: [
            "React.js",
            "Node.js",
            "Express.js",
            "MongoDB",
            "Tailwind CSS",
        ],

        projectType: "Web Application",
        priority: "High",
        startDate: "18 Aug 2026",
        endDate: "18 Feb 2027",
        status: "Active",
        duration: "6 Months",
        client: "Internal Project",
        repository: "Private Repository",
        environment: "Development",

        // Employees assigned to this project
        employeeIds: [
            "EMP001",
            "EMP002",
            "EMP003",
            "EMP004",
            "EMP005",
            "EMP006",
            "EMP007",
            "EMP008",
            "EMP009",
            "EMP010",
        ],

        objectives: [
            "Manage employee information",
            "Maintain employee skill profiles",
            "Assign employees to projects",
            "Track employee availability",
            "Provide an admin dashboard",
        ],
    },

    {
        id: 2,
        projectName: "Employee Management System",
        projectCode: "PRJ002",

        description:
            "Employee Management System is a centralized platform for managing employee records, profiles, departments, employment status, and organizational information.",

        projectOverview:
            "The system helps HR and administrators maintain employee information and efficiently manage workforce records from a centralized dashboard.",

        skills: [
            "React.js",
            "JavaScript",
            "Tailwind CSS",
            "Node.js",
            "Express.js",
            "MongoDB",
        ],

        technologies: [
            "React.js",
            "Node.js",
            "Express.js",
            "MongoDB",
            "Tailwind CSS",
        ],

        projectType: "Web Application",
        priority: "High",
        startDate: "15 Aug 2026",
        endDate: "15 Jan 2027",
        status: "Active",
        duration: "5 Months",
        client: "Internal Project",
        repository: "Private Repository",
        environment: "Development",

        employeeIds: [
            "EMP002",
            "EMP003",
            "EMP004",
            "EMP005",
            "EMP006",
            "EMP007",
            "EMP008",
        ],

        objectives: [
            "Manage employee records",
            "Create and update employee profiles",
            "Track employee status",
            "Maintain department information",
            "Improve HR data management",
        ],
    },

    {
        id: 3,
        projectName: "Company Website",
        projectCode: "PRJ003",

        description:
            "Company Website is a responsive corporate website designed to showcase company information, services, projects, career opportunities, and contact information.",

        projectOverview:
            "The website provides an online presence for the organization and allows visitors to learn about the company, its services, and career opportunities.",

        skills: [
            "HTML",
            "CSS",
            "JavaScript",
            "React.js",
            "Tailwind CSS",
            "Responsive Design",
        ],

        technologies: [
            "React.js",
            "JavaScript",
            "Tailwind CSS",
            "Vite",
        ],

        projectType: "Corporate Website",
        priority: "Medium",
        startDate: "10 Aug 2026",
        endDate: "10 Nov 2026",
        status: "Completed",
        duration: "3 Months",
        client: "Internal Project",
        repository: "Private Repository",
        environment: "Production",

        employeeIds: [
            "EMP003",
            "EMP004",
            "EMP005",
            "EMP006",
            "EMP007",
        ],

        objectives: [
            "Create a professional company website",
            "Showcase company services",
            "Display company projects",
            "Provide career information",
            "Provide contact information",
        ],
    },

    {
        id: 4,
        projectName: "HR Management Portal",
        projectCode: "PRJ004",

        description:
            "HR Management Portal is an enterprise web application designed to streamline human resource operations including employee management, attendance, leave management, and HR reporting.",

        projectOverview:
            "The portal provides HR administrators with tools to manage employee-related operations and maintain centralized HR records.",

        skills: [
            "React.js",
            "JavaScript",
            "Tailwind CSS",
            "Node.js",
            "Express.js",
            "MongoDB",
            "REST API",
        ],

        technologies: [
            "React.js",
            "Node.js",
            "Express.js",
            "MongoDB",
            "Tailwind CSS",
        ],

        projectType: "Enterprise Application",
        priority: "High",
        startDate: "20 Aug 2026",
        endDate: "20 Apr 2027",
        status: "Active",
        duration: "8 Months",
        client: "Internal Project",
        repository: "Private Repository",
        environment: "Development",

        employeeIds: [
            "EMP001",
            "EMP004",
            "EMP006",
            "EMP008",
        ],

        objectives: [
            "Manage employee records",
            "Manage attendance",
            "Manage employee leave",
            "Generate HR reports",
            "Centralize HR operations",
        ],
    },

    {
        id: 5,
        projectName: "Task Management System",
        projectCode: "PRJ005",

        description:
            "Task Management System is a collaborative platform that allows teams to create, assign, monitor, and manage tasks throughout their project lifecycle.",

        projectOverview:
            "The system helps project teams organize their daily activities, monitor task progress, and improve team productivity.",

        skills: [
            "React.js",
            "JavaScript",
            "Tailwind CSS",
            "Node.js",
            "Express.js",
            "MongoDB",
        ],

        technologies: [
            "React.js",
            "Node.js",
            "Express.js",
            "MongoDB",
            "Tailwind CSS",
        ],

        projectType: "Productivity Application",
        priority: "Medium",
        startDate: "22 Aug 2026",
        endDate: "22 Dec 2026",
        status: "Pending",
        duration: "4 Months",
        client: "Internal Project",
        repository: "Private Repository",
        environment: "Planning",

        employeeIds: [
            "EMP002",
            "EMP005",
            "EMP007",
            "EMP009",
            "EMP010",
        ],

        objectives: [
            "Create and manage tasks",
            "Assign tasks to team members",
            "Track task status",
            "Set task priorities",
            "Monitor project progress",
        ],
    },

    {
        id: 6,
        projectName: "Finance Dashboard",
        projectCode: "PRJ006",

        description:
            "Finance Dashboard is an interactive analytics platform that provides visual insights into financial data, revenue, expenses, transactions, and business performance.",

        projectOverview:
            "The dashboard converts financial data into interactive charts and reports to help users understand financial performance.",

        skills: [
            "React.js",
            "JavaScript",
            "Chart.js",
            "Data Visualization",
            "Tailwind CSS",
            "REST API",
        ],

        technologies: [
            "React.js",
            "Chart.js",
            "JavaScript",
            "Tailwind CSS",
        ],

        projectType: "Analytics Dashboard",
        priority: "High",
        startDate: "25 Aug 2026",
        endDate: "25 Jan 2027",
        status: "Active",
        duration: "5 Months",
        client: "Internal Project",
        repository: "Private Repository",
        environment: "Development",

        employeeIds: [
            "EMP001",
            "EMP003",
            "EMP005",
            "EMP010",
        ],

        objectives: [
            "Display financial data",
            "Create interactive charts",
            "Track revenue",
            "Track expenses",
            "Generate financial insights",
        ],
    },

    {
        id: 7,
        projectName: "Inventory Management System",
        projectCode: "PRJ007",

        description:
            "Inventory Management System helps organizations manage products, stock levels, suppliers, inventory movements, and warehouse operations.",

        projectOverview:
            "The system provides centralized inventory tracking and helps businesses monitor stock availability and product movement.",

        skills: [
            "React.js",
            "JavaScript",
            "Node.js",
            "Express.js",
            "MongoDB",
            "REST API",
        ],

        technologies: [
            "React.js",
            "Node.js",
            "Express.js",
            "MongoDB",
            "Tailwind CSS",
        ],

        projectType: "Management System",
        priority: "High",
        startDate: "28 Aug 2026",
        endDate: "28 Mar 2027",
        status: "Active",
        duration: "7 Months",
        client: "Internal Project",
        repository: "Private Repository",
        environment: "Development",

        employeeIds: [
            "EMP002",
            "EMP004",
            "EMP006",
            "EMP008",
            "EMP010",
        ],

        objectives: [
            "Manage products",
            "Track inventory levels",
            "Manage suppliers",
            "Track stock movements",
            "Monitor warehouse inventory",
        ],
    },

    {
        id: 8,
        projectName: "Customer Support Portal",
        projectCode: "PRJ008",

        description:
            "Customer Support Portal is a web-based platform that enables customers to raise support requests and allows support teams to manage, track, and resolve customer issues.",

        projectOverview:
            "The portal provides a centralized communication platform between customers and support teams.",

        skills: [
            "React.js",
            "JavaScript",
            "Node.js",
            "Express.js",
            "MongoDB",
            "REST API",
        ],

        technologies: [
            "React.js",
            "Node.js",
            "Express.js",
            "MongoDB",
            "Tailwind CSS",
        ],

        projectType: "Customer Support Application",
        priority: "Medium",
        startDate: "01 Sep 2026",
        endDate: "01 Jan 2027",
        status: "Pending",
        duration: "4 Months",
        client: "Internal Project",
        repository: "Private Repository",
        environment: "Planning",

        employeeIds: [
            "EMP001",
            "EMP005",
            "EMP007",
        ],

        objectives: [
            "Allow customers to create tickets",
            "Manage support requests",
            "Track ticket status",
            "Assign support requests",
            "Improve customer communication",
        ],
    },

    {
        id: 9,
        projectName: "Learning Management System",
        projectCode: "PRJ009",

        description:
            "Learning Management System is an online education platform designed to manage courses, learning materials, users, assessments, and educational content.",

        projectOverview:
            "The platform enables organizations to provide structured online learning experiences and manage educational resources.",

        skills: [
            "React.js",
            "JavaScript",
            "Node.js",
            "Express.js",
            "MongoDB",
            "REST API",
            "Tailwind CSS",
        ],

        technologies: [
            "React.js",
            "Node.js",
            "Express.js",
            "MongoDB",
            "Tailwind CSS",
        ],

        projectType: "Education Platform",
        priority: "High",
        startDate: "05 Sep 2026",
        endDate: "05 May 2027",
        status: "Active",
        duration: "8 Months",
        client: "Internal Project",
        repository: "Private Repository",
        environment: "Development",

        employeeIds: [
            "EMP003",
            "EMP004",
            "EMP006",
            "EMP009",
        ],

        objectives: [
            "Create and manage courses",
            "Manage learning materials",
            "Track learner progress",
            "Manage assessments",
            "Provide online learning resources",
        ],
    },

    {
        id: 10,
        projectName: "E-Commerce Platform",
        projectCode: "PRJ010",

        description:
            "E-Commerce Platform is a full-stack online shopping application that allows customers to browse products, search products, manage carts, and place orders.",

        projectOverview:
            "The platform provides customers with a complete online shopping experience and administrators with tools to manage products and orders.",

        skills: [
            "React.js",
            "JavaScript",
            "Node.js",
            "Express.js",
            "MongoDB",
            "REST API",
            "Tailwind CSS",
        ],

        technologies: [
            "React.js",
            "Node.js",
            "Express.js",
            "MongoDB",
            "Tailwind CSS",
        ],

        projectType: "E-Commerce Application",
        priority: "High",
        startDate: "10 Sep 2026",
        endDate: "10 Jun 2027",
        status: "Completed",
        duration: "9 Months",
        client: "Internal Project",
        repository: "Private Repository",
        environment: "Production",

        employeeIds: [
            "EMP002",
            "EMP003",
            "EMP005",
            "EMP008",
            "EMP009",
            "EMP010",
        ],

        objectives: [
            "Manage products",
            "Allow users to search products",
            "Provide shopping cart functionality",
            "Manage customer orders",
            "Provide product management tools",
        ],
    },
];

export default projectDetails;