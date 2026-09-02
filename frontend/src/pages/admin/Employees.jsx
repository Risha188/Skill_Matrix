import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    Link,
    useSearchParams,
} from "react-router-dom";

import {
    getEmployeesWithStatus,
    updateEmployeeStatus,
} from "../../data/employeeStatus";

// =========================================================
// CONSTANTS
// =========================================================

const PROJECT_STORAGE_KEY =
    "assignedProjects";

const DEFAULT_ADVANCED_SEARCH = {
    employeeId: "",
    employeeName: "",
    email: "",
    skills: "",
    minExperience: "",
    maxExperience: "",
    projectAssignment: "",
    projectStatus: "",
    qualification: "",
    specialization: "",
    state: "",
    city: "",
};

// =========================================================
// COMMON STYLES
// =========================================================

const INPUT_CLASS =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400";

const SELECT_CLASS =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const LABEL_CLASS =
    "mb-1.5 block text-sm font-medium text-gray-700";

const SECONDARY_BUTTON_CLASS =
    "rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200";

const PRIMARY_BUTTON_CLASS =
    "rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200";

// =========================================================
// HELPERS
// =========================================================

const normalizeValue = (value) => {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .trim()
        .toLowerCase();
};

// ---------------------------------------------------------

const getFirstValue = (
    employee,
    paths = []
) => {
    for (const path of paths) {
        const parts = path.split(".");
        let current = employee;

        for (const part of parts) {
            if (
                current === null ||
                current === undefined
            ) {
                current = undefined;
                break;
            }

            current = current[part];
        }

        if (
            current !== null &&
            current !== undefined &&
            String(current).trim() !== ""
        ) {
            return current;
        }
    }

    return "";
};

// ---------------------------------------------------------

const getSkillsArray = (value) => {
    if (Array.isArray(value)) {
        return value
            .filter(
                (skill) =>
                    skill !== null &&
                    skill !== undefined &&
                    String(skill).trim() !== ""
            )
            .map((skill) =>
                String(skill).trim()
            );
    }

    if (
        value === null ||
        value === undefined
    ) {
        return [];
    }

    return String(value)
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
};

// ---------------------------------------------------------

const getEmployeeSkills = (employee) => {
    const primarySkills =
        getFirstValue(
            employee,
            [
                "primarySkills",
                "skills.primarySkills",
                "skillDetails.primarySkills",
                "professionalDetails.primarySkills",
            ]
        );

    const secondarySkills =
        getFirstValue(
            employee,
            [
                "secondarySkills",
                "skills.secondarySkills",
                "skillDetails.secondarySkills",
                "professionalDetails.secondarySkills",
            ]
        );

    return {
        primary:
            getSkillsArray(
                primarySkills
            ),

        secondary:
            getSkillsArray(
                secondarySkills
            ),
    };
};

// ---------------------------------------------------------

const getExperienceNumber = (
    employee
) => {
    const experience =
        getFirstValue(
            employee,
            [
                "experience",
                "totalExperience",
                "yearsOfExperience",
                "experienceYears",
                "professionalDetails.experience",
                "professionalDetails.totalExperience",
                "employmentDetails.experience",
            ]
        );

    if (
        experience === null ||
        experience === undefined ||
        experience === ""
    ) {
        return 0;
    }

    const parsed =
        Number(
            String(experience).match(
                /-?\d+(\.\d+)?/
            )?.[0]
        );

    return Number.isNaN(parsed)
        ? 0
        : parsed;
};

// ---------------------------------------------------------

const getStoredProjects = () => {
    try {
        const stored =
            localStorage.getItem(
                PROJECT_STORAGE_KEY
            );

        if (!stored) {
            return [];
        }

        const parsed =
            JSON.parse(stored);

        return Array.isArray(parsed)
            ? parsed
            : [];
    } catch (error) {
        console.error(
            "Unable to load assigned projects:",
            error
        );

        return [];
    }
};

// ---------------------------------------------------------

const getEmployeeName = (
    employee
) => {
    const directName =
        getFirstValue(
            employee,
            [
                "name",
                "fullName",
                "employeeName",
                "personalDetails.name",
                "personalDetails.fullName",
                "personalInfo.name",
                "personalInfo.fullName",
            ]
        );

    if (directName) {
        return String(
            directName
        );
    }

    const firstName =
        getFirstValue(
            employee,
            [
                "firstName",
                "personalDetails.firstName",
                "personalInfo.firstName",
            ]
        );

    const lastName =
        getFirstValue(
            employee,
            [
                "lastName",
                "personalDetails.lastName",
                "personalInfo.lastName",
            ]
        );

    return `${firstName || ""} ${
        lastName || ""
    }`.trim();
};

// ---------------------------------------------------------

const getEmployeeEmail = (
    employee
) => {
    return getFirstValue(
        employee,
        [
            "email",
            "personalDetails.email",
            "personalInfo.email",
            "contactDetails.email",
        ]
    );
};

// ---------------------------------------------------------

const getEmployeePhone = (
    employee
) => {
    return getFirstValue(
        employee,
        [
            "phone",
            "mobile",
            "phoneNumber",
            "personalDetails.phone",
            "personalDetails.mobile",
            "personalInfo.phone",
            "contactDetails.phone",
        ]
    );
};

// ---------------------------------------------------------

const getEmployeeQualification = (
    employee
) => {
    return getFirstValue(
        employee,
        [
            "qualification",
            "highestQualification",
            "education.qualification",
            "educationDetails.qualification",
            "academicDetails.qualification",
        ]
    );
};

// ---------------------------------------------------------

const getEmployeeSpecialization = (
    employee
) => {
    return getFirstValue(
        employee,
        [
            "specialization",
            "education.specialization",
            "educationDetails.specialization",
            "academicDetails.specialization",
        ]
    );
};

// ---------------------------------------------------------

const getEmployeeState = (
    employee
) => {
    return getFirstValue(
        employee,
        [
            "state",
            "address.state",
            "addressDetails.state",
            "personalDetails.state",
            "personalDetails.address.state",
            "personalInfo.state",
            "personalInfo.address.state",
        ]
    );
};

// ---------------------------------------------------------

const getEmployeeCity = (
    employee
) => {
    return getFirstValue(
        employee,
        [
            "city",
            "address.city",
            "addressDetails.city",
            "personalDetails.city",
            "personalDetails.address.city",
            "personalInfo.city",
            "personalInfo.address.city",
        ]
    );
};

// ---------------------------------------------------------

const getEmployeeProjects = (
    employee,
    assignedProjects
) => {
    const employeeId =
        employee.employeeId;

    if (!employeeId) {
        return [];
    }

    return assignedProjects.filter(
        (project) =>
            Array.isArray(
                project.employeeIds
            ) &&
            project.employeeIds.includes(
                employeeId
            )
    );
};

// ---------------------------------------------------------

const getProjectStatus = (
    project
) => {
    const today =
        new Date();

    const startDate =
        project.startDate
            ? new Date(
                  project.startDate
              )
            : null;

    const endDate =
        project.endDate
            ? new Date(
                  project.endDate
              )
            : null;

    if (
        endDate &&
        !Number.isNaN(
            endDate.getTime()
        ) &&
        today > endDate
    ) {
        return "completed";
    }

    if (
        startDate &&
        !Number.isNaN(
            startDate.getTime()
        ) &&
        today < startDate
    ) {
        return "pending";
    }

    if (
        startDate &&
        !Number.isNaN(
            startDate.getTime()
        ) &&
        (
            !endDate ||
            Number.isNaN(
                endDate.getTime()
            ) ||
            today <= endDate
        )
    ) {
        return "active";
    }

    return normalizeValue(
        project.status
    );
};

// =========================================================
// SMALL UI COMPONENTS
// =========================================================

const Field = ({
    label,
    htmlFor,
    children,
}) => {
    return (
        <div>
            <label
                htmlFor={htmlFor}
                className={LABEL_CLASS}
            >
                {label}
            </label>

            {children}
        </div>
    );
};

// ---------------------------------------------------------

const SearchSection = ({
    title,
    description,
    children,
}) => {
    return (
        <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-800">
                    {title}
                </h3>

                {description && (
                    <p className="mt-1 text-xs text-gray-500">
                        {description}
                    </p>
                )}
            </div>

            {children}
        </div>
    );
};

// ---------------------------------------------------------

const StatCard = ({
    title,
    value,
    description,
    type,
    active,
    onClick,
}) => {
    const typeClasses = {
        total: {
            border:
                "border-blue-200",
            value:
                "text-blue-700",
            bg:
                "bg-blue-50",
        },

        active: {
            border:
                "border-green-200",
            value:
                "text-green-700",
            bg:
                "bg-green-50",
        },

        inactive: {
            border:
                "border-red-200",
            value:
                "text-red-700",
            bg:
                "bg-red-50",
        },
    };

    const styles =
        typeClasses[type];

    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full rounded-xl border bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                active
                    ? `${styles.border} shadow-sm`
                    : "border-gray-200"
            }`}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-gray-500">
                        {title}
                    </p>

                    <p
                        className={`mt-2 text-3xl font-bold ${styles.value}`}
                    >
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        {description}
                    </p>
                </div>

                <div
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium ${styles.bg} ${styles.value}`}
                >
                    View
                </div>
            </div>
        </button>
    );
};

// =========================================================
// EMPLOYEES COMPONENT
// =========================================================

const Employees = () => {
    // =====================================================
    // ROUTER
    // =====================================================

    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();

    // =====================================================
    // REFS
    // =====================================================

    const employeeResultsRef =
        useRef(null);

    // =====================================================
    // STATE
    // =====================================================

    /*
     * Quick search text.
     * This is only applied after clicking
     * the Quick Search button.
     */
    const [
        searchInput,
        setSearchInput,
    ] = useState("");

    const [
        search,
        setSearch,
    ] = useState("");

    /*
     * Advanced search form values.
     * These are only applied after clicking
     * the Advanced Search button.
     */
    const [
        advancedSearchInput,
        setAdvancedSearchInput,
    ] = useState({
        ...DEFAULT_ADVANCED_SEARCH,
    });

    const [
        advancedSearch,
        setAdvancedSearch,
    ] = useState({
        ...DEFAULT_ADVANCED_SEARCH,
    });

    const [
        employeeList,
        setEmployeeList,
    ] = useState([]);

    const [
        assignedProjects,
        setAssignedProjects,
    ] = useState([]);

    // =====================================================
    // LOAD EMPLOYEES
    // =====================================================

    useEffect(() => {
        const employees =
            getEmployeesWithStatus();

        setEmployeeList(
            Array.isArray(employees)
                ? employees
                : []
        );
    }, []);

    // =====================================================
    // LOAD PROJECTS
    // =====================================================

    useEffect(() => {
        const loadProjects = () => {
            setAssignedProjects(
                getStoredProjects()
            );
        };

        loadProjects();

        window.addEventListener(
            "storage",
            loadProjects
        );

        return () => {
            window.removeEventListener(
                "storage",
                loadProjects
            );
        };
    }, []);

    // =====================================================
    // STATUS FILTER
    // =====================================================

    const statusFilter =
        searchParams.get("status");

    // =====================================================
    // COUNTS
    // =====================================================

    const totalEmployees =
        employeeList.length;

    const activeEmployees =
        employeeList.filter(
            (employee) =>
                normalizeValue(
                    employee.presentStatus
                ) === "active"
        ).length;

    const inactiveEmployees =
        totalEmployees -
        activeEmployees;

    // =====================================================
    // ADVANCED SEARCH INPUT
    // =====================================================

    const updateAdvancedSearchInput = (
        field,
        value
    ) => {
        setAdvancedSearchInput(
            (previous) => ({
                ...previous,
                [field]: value,
            })
        );
    };

    // =====================================================
    // ADVANCED FILTER COUNT
    // =====================================================

    const activeAdvancedFilterCount =
        Object.values(
            advancedSearch
        ).filter(
            (value) =>
                String(value).trim() !== ""
        ).length;

    const hasAdvancedSearch =
        activeAdvancedFilterCount > 0;

    // =====================================================
    // SEARCH RESULT NAVIGATION
    // =====================================================

    const scrollToEmployeeResults = () => {
        setTimeout(() => {
            employeeResultsRef.current?.scrollIntoView(
                {
                    behavior: "smooth",
                    block: "start",
                }
            );
        }, 80);
    };

    // =====================================================
    // QUICK SEARCH BUTTON
    // =====================================================

    const handleQuickSearch = () => {
        setSearch(
            searchInput.trim()
        );

        scrollToEmployeeResults();
    };

    // =====================================================
    // QUICK SEARCH CLEAR
    // =====================================================

    const clearSearch = () => {
        setSearchInput("");
        setSearch("");
        scrollToEmployeeResults();
    };

    // =====================================================
    // ADVANCED SEARCH BUTTON
    // =====================================================

    const handleAdvancedSearch = () => {
        if (
            advancedSearchInput.minExperience !==
                "" &&
            advancedSearchInput.maxExperience !==
                "" &&
            Number(
                advancedSearchInput.minExperience
            ) >
                Number(
                    advancedSearchInput.maxExperience
                )
        ) {
            return;
        }

        setAdvancedSearch({
            ...advancedSearchInput,
        });

        scrollToEmployeeResults();
    };

    // =====================================================
    // CLEAR ADVANCED SEARCH
    // =====================================================

    const clearAdvancedSearch = () => {
        const resetValues = {
            ...DEFAULT_ADVANCED_SEARCH,
        };

        setAdvancedSearchInput(
            resetValues
        );

        setAdvancedSearch(
            resetValues
        );
    };

    // =====================================================
    // PROJECT STATUS
    // =====================================================

    const getProjectsForEmployee = (
        employee
    ) => {
        return getEmployeeProjects(
            employee,
            assignedProjects
        );
    };

    // =====================================================
    // FILTERED EMPLOYEES
    // =====================================================

    const filteredEmployees =
        useMemo(() => {
            const quickSearch =
                normalizeValue(search);

            const requiredSkills =
                getSkillsArray(
                    advancedSearch.skills
                ).map(
                    normalizeValue
                );

            const minExperience =
                advancedSearch.minExperience !==
                ""
                    ? Number(
                          advancedSearch.minExperience
                      )
                    : null;

            const maxExperience =
                advancedSearch.maxExperience !==
                ""
                    ? Number(
                          advancedSearch.maxExperience
                      )
                    : null;

            return employeeList.filter(
                (employee) => {
                    // =================================
                    // QUICK SEARCH
                    // =================================

                    if (quickSearch) {
                        const {
                            primary,
                            secondary,
                        } =
                            getEmployeeSkills(
                                employee
                            );

                        const searchableValues =
                            [
                                getEmployeeName(
                                    employee
                                ),
                                employee.employeeId,
                                getEmployeeEmail(
                                    employee
                                ),
                                getEmployeePhone(
                                    employee
                                ),
                                ...primary,
                                ...secondary,
                            ];

                        const matchesQuickSearch =
                            searchableValues.some(
                                (value) =>
                                    normalizeValue(
                                        value
                                    ).includes(
                                        quickSearch
                                    )
                            );

                        if (
                            !matchesQuickSearch
                        ) {
                            return false;
                        }
                    }

                    // =================================
                    // STATUS
                    // =================================

                    if (
                        statusFilter ===
                            "active" &&
                        normalizeValue(
                            employee.presentStatus
                        ) !== "active"
                    ) {
                        return false;
                    }

                    if (
                        statusFilter ===
                            "inactive" &&
                        normalizeValue(
                            employee.presentStatus
                        ) === "active"
                    ) {
                        return false;
                    }

                    // =================================
                    // EMPLOYEE ID
                    // =================================

                    if (
                        advancedSearch.employeeId &&
                        !normalizeValue(
                            employee.employeeId
                        ).includes(
                            normalizeValue(
                                advancedSearch.employeeId
                            )
                        )
                    ) {
                        return false;
                    }

                    // =================================
                    // EMPLOYEE NAME
                    // =================================

                    if (
                        advancedSearch.employeeName &&
                        !normalizeValue(
                            getEmployeeName(
                                employee
                            )
                        ).includes(
                            normalizeValue(
                                advancedSearch.employeeName
                            )
                        )
                    ) {
                        return false;
                    }

                    // =================================
                    // EMAIL
                    // =================================

                    if (
                        advancedSearch.email &&
                        !normalizeValue(
                            getEmployeeEmail(
                                employee
                            )
                        ).includes(
                            normalizeValue(
                                advancedSearch.email
                            )
                        )
                    ) {
                        return false;
                    }

                    // =================================
                    // SKILLS
                    // =================================

                    if (
                        requiredSkills.length >
                        0
                    ) {
                        const {
                            primary,
                            secondary,
                        } =
                            getEmployeeSkills(
                                employee
                            );

                        const employeeSkills =
                            [
                                ...primary,
                                ...secondary,
                            ].map(
                                normalizeValue
                            );

                        const hasMatchingSkill =
                            requiredSkills.some(
                                (
                                    requiredSkill
                                ) =>
                                    employeeSkills.some(
                                        (
                                            employeeSkill
                                        ) =>
                                            employeeSkill.includes(
                                                requiredSkill
                                            ) ||
                                            requiredSkill.includes(
                                                employeeSkill
                                            )
                                    )
                            );

                        if (
                            !hasMatchingSkill
                        ) {
                            return false;
                        }
                    }

                    // =================================
                    // EXPERIENCE
                    // =================================

                    const experience =
                        getExperienceNumber(
                            employee
                        );

                    if (
                        minExperience !==
                            null &&
                        !Number.isNaN(
                            minExperience
                        ) &&
                        experience <
                            minExperience
                    ) {
                        return false;
                    }

                    if (
                        maxExperience !==
                            null &&
                        !Number.isNaN(
                            maxExperience
                        ) &&
                        experience >
                            maxExperience
                    ) {
                        return false;
                    }

                    // =================================
                    // PROJECT ASSIGNMENT
                    // =================================

                    const employeeProjects =
                        getProjectsForEmployee(
                            employee
                        );

                    if (
                        advancedSearch.projectAssignment ===
                        "assigned"
                    ) {
                        if (
                            employeeProjects.length ===
                            0
                        ) {
                            return false;
                        }
                    }

                    if (
                        advancedSearch.projectAssignment ===
                        "unassigned"
                    ) {
                        if (
                            employeeProjects.length >
                            0
                        ) {
                            return false;
                        }
                    }

                    // =================================
                    // PROJECT STATUS
                    // =================================

                    if (
                        advancedSearch.projectStatus
                    ) {
                        const hasProjectWithStatus =
                            employeeProjects.some(
                                (project) =>
                                    getProjectStatus(
                                        project
                                    ) ===
                                    normalizeValue(
                                        advancedSearch.projectStatus
                                    )
                            );

                        if (
                            !hasProjectWithStatus
                        ) {
                            return false;
                        }
                    }

                    // =================================
                    // QUALIFICATION
                    // =================================

                    if (
                        advancedSearch.qualification
                    ) {
                        const qualification =
                            normalizeValue(
                                getEmployeeQualification(
                                    employee
                                )
                            );

                        if (
                            !qualification.includes(
                                normalizeValue(
                                    advancedSearch.qualification
                                )
                            )
                        ) {
                            return false;
                        }
                    }

                    // =================================
                    // SPECIALIZATION
                    // =================================

                    if (
                        advancedSearch.specialization
                    ) {
                        const specialization =
                            normalizeValue(
                                getEmployeeSpecialization(
                                    employee
                                )
                            );

                        if (
                            !specialization.includes(
                                normalizeValue(
                                    advancedSearch.specialization
                                )
                            )
                        ) {
                            return false;
                        }
                    }

                    // =================================
                    // STATE
                    // =================================

                    if (
                        advancedSearch.state
                    ) {
                        const state =
                            normalizeValue(
                                getEmployeeState(
                                    employee
                                )
                            );

                        if (
                            !state.includes(
                                normalizeValue(
                                    advancedSearch.state
                                )
                            )
                        ) {
                            return false;
                        }
                    }

                    // =================================
                    // CITY
                    // =================================

                    if (
                        advancedSearch.city
                    ) {
                        const city =
                            normalizeValue(
                                getEmployeeCity(
                                    employee
                                )
                            );

                        if (
                            !city.includes(
                                normalizeValue(
                                    advancedSearch.city
                                )
                            )
                        ) {
                            return false;
                        }
                    }

                    return true;
                }
            );
        }, [
            employeeList,
            search,
            advancedSearch,
            statusFilter,
            assignedProjects,
        ]);

    // =====================================================
    // STATUS CHANGE
    // =====================================================

    const handleStatusChange = (
        employeeId,
        newStatus
    ) => {
        const updatedStatuses =
            updateEmployeeStatus(
                employeeId,
                newStatus
            );

        const updatedEmployees =
            employeeList.map(
                (employee) => ({
                    ...employee,

                    presentStatus:
                        updatedStatuses[
                            employee.employeeId
                        ] ||
                        employee.presentStatus,
                })
            );

        setEmployeeList(
            updatedEmployees
        );
    };

    // =====================================================
    // STATUS NAVIGATION
    // =====================================================

    const showAllEmployees = () => {
        setSearchParams({});

        scrollToEmployeeResults();
    };

    const showActiveEmployees = () => {
        setSearchParams({
            status: "active",
        });

        scrollToEmployeeResults();
    };

    const showInactiveEmployees = () => {
        setSearchParams({
            status: "inactive",
        });

        scrollToEmployeeResults();
    };

    // =====================================================
    // RESET ALL
    // =====================================================

    const resetAllFilters = () => {
        setSearchInput("");
        setSearch("");

        const resetValues = {
            ...DEFAULT_ADVANCED_SEARCH,
        };

        setAdvancedSearchInput(
            resetValues
        );

        setAdvancedSearch(
            resetValues
        );

        setSearchParams({});

        scrollToEmployeeResults();
    };

    // =====================================================
    // STATUS CLASSES
    // =====================================================

    const getStatusClasses = (
        status
    ) => {
        const normalized =
            normalizeValue(status);

        if (
            normalized === "active"
        ) {
            return "bg-green-50 text-green-700 border-green-200";
        }

        if (
            normalized === "inactive"
        ) {
            return "bg-red-50 text-red-700 border-red-200";
        }

        return "bg-gray-50 text-gray-600 border-gray-200";
    };

    // =====================================================
    // ACTIVE FILTER SUMMARY
    // =====================================================

    const activeFilterItems = [];

    if (search.trim()) {
        activeFilterItems.push(
            `Quick Search: "${search.trim()}"`
        );
    }

    if (statusFilter) {
        activeFilterItems.push(
            `Status: ${
                statusFilter ===
                "active"
                    ? "Active"
                    : "Inactive"
            }`
        );
    }

    if (
        advancedSearch.employeeId
    ) {
        activeFilterItems.push(
            `Employee ID: ${advancedSearch.employeeId}`
        );
    }

    if (
        advancedSearch.employeeName
    ) {
        activeFilterItems.push(
            `Name: ${advancedSearch.employeeName}`
        );
    }

    if (advancedSearch.email) {
        activeFilterItems.push(
            `Email: ${advancedSearch.email}`
        );
    }

    if (advancedSearch.skills) {
        activeFilterItems.push(
            `Skills: ${advancedSearch.skills}`
        );
    }

    if (
        advancedSearch.minExperience
    ) {
        activeFilterItems.push(
            `Min Experience: ${advancedSearch.minExperience} years`
        );
    }

    if (
        advancedSearch.maxExperience
    ) {
        activeFilterItems.push(
            `Max Experience: ${advancedSearch.maxExperience} years`
        );
    }

    if (
        advancedSearch.projectAssignment
    ) {
        activeFilterItems.push(
            `Project: ${
                advancedSearch.projectAssignment ===
                "assigned"
                    ? "Assigned"
                    : "Unassigned"
            }`
        );
    }

    if (
        advancedSearch.projectStatus
    ) {
        activeFilterItems.push(
            `Project Status: ${advancedSearch.projectStatus}`
        );
    }

    if (
        advancedSearch.qualification
    ) {
        activeFilterItems.push(
            `Qualification: ${advancedSearch.qualification}`
        );
    }

    if (
        advancedSearch.specialization
    ) {
        activeFilterItems.push(
            `Specialization: ${advancedSearch.specialization}`
        );
    }

    if (advancedSearch.state) {
        activeFilterItems.push(
            `State: ${advancedSearch.state}`
        );
    }

    if (advancedSearch.city) {
        activeFilterItems.push(
            `City: ${advancedSearch.city}`
        );
    }

    // =====================================================
    // INVALID EXPERIENCE RANGE
    // =====================================================

    const invalidExperienceRange =
        advancedSearchInput.minExperience !==
            "" &&
        advancedSearchInput.maxExperience !==
            "" &&
        Number(
            advancedSearchInput.minExperience
        ) >
            Number(
                advancedSearchInput.maxExperience
            );

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-[1600px] space-y-6">

                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-blue-600">
                            Employee Management
                        </p>

                        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            Employees
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm text-gray-500">
                            View, search and manage
                            employee information,
                            availability and project
                            assignments.
                        </p>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Current Results
                        </p>

                        <p className="mt-1 text-lg font-semibold text-gray-800">
                            {
                                filteredEmployees.length
                            }{" "}
                            <span className="text-sm font-normal text-gray-500">
                                of{" "}
                                {
                                    totalEmployees
                                }
                            </span>
                        </p>
                    </div>
                </div>

                {/* =================================================
                    SUMMARY CARDS
                ================================================= */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard
                        title="Total Employees"
                        value={
                            totalEmployees
                        }
                        description="All registered employees"
                        type="total"
                        active={
                            !statusFilter
                        }
                        onClick={
                            showAllEmployees
                        }
                    />

                    <StatCard
                        title="Active Employees"
                        value={
                            activeEmployees
                        }
                        description="Currently active employees"
                        type="active"
                        active={
                            statusFilter ===
                            "active"
                        }
                        onClick={
                            showActiveEmployees
                        }
                    />

                    <StatCard
                        title="Inactive Employees"
                        value={
                            inactiveEmployees
                        }
                        description="Currently inactive employees"
                        type="inactive"
                        active={
                            statusFilter ===
                            "inactive"
                        }
                        onClick={
                            showInactiveEmployees
                        }
                    />
                </div>

                {/* =================================================
                    STATUS FILTER MESSAGE
                ================================================= */}

                {statusFilter && (
                    <div className="flex flex-col gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-blue-900">
                                {statusFilter ===
                                "active"
                                    ? "Showing active employees"
                                    : "Showing inactive employees"}
                            </p>

                            <p className="mt-0.5 text-xs text-blue-700">
                                Use the summary cards
                                above to change the
                                employee status filter.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={
                                showAllEmployees
                            }
                            className="self-start rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 sm:self-auto"
                        >
                            Show All
                        </button>
                    </div>
                )}

                {/* =================================================
                    QUICK SEARCH
                ================================================= */}

                <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 px-5 py-4 sm:px-6">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-base font-semibold text-gray-900">
                                    Quick Search
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Search by employee ID,
                                    name, email, phone or
                                    skill.
                                </p>
                            </div>

                            {searchInput && (
                                <button
                                    type="button"
                                    onClick={
                                        clearSearch
                                    }
                                    className={SECONDARY_BUTTON_CLASS}
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="px-5 py-5 sm:px-6">
                        <div className="flex flex-col gap-3 lg:flex-row">
                            <div className="flex-1">
                                <label
                                    htmlFor="quickEmployeeSearch"
                                    className="sr-only"
                                >
                                    Search employees
                                </label>

                                <input
                                    id="quickEmployeeSearch"
                                    type="text"
                                    value={
                                        searchInput
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setSearchInput(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    onKeyDown={(
                                        event
                                    ) => {
                                        if (
                                            event.key ===
                                            "Enter"
                                        ) {
                                            handleQuickSearch();
                                        }
                                    }}
                                    placeholder="Search by employee ID, name, email, phone or skill..."
                                    className={INPUT_CLASS}
                                />
                            </div>

                            <button
                                type="button"
                                onClick={
                                    handleQuickSearch
                                }
                                className={PRIMARY_BUTTON_CLASS}
                            >
                                Quick Search
                            </button>
                        </div>
                    </div>
                </section>

                {/* =================================================
                    ADVANCED SEARCH
                ================================================= */}

                <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 px-5 py-4 sm:px-6">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-base font-semibold text-gray-900">
                                        Advanced Search
                                    </h2>

                                    {activeAdvancedFilterCount >
                                        0 && (
                                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                            {
                                                activeAdvancedFilterCount
                                            }{" "}
                                            filters applied
                                        </span>
                                    )}
                                </div>

                                <p className="mt-1 text-sm text-gray-500">
                                    Search using employee,
                                    skill, experience,
                                    project, education
                                    and location details.
                                </p>
                            </div>

                            {Object.values(
                                advancedSearchInput
                            ).some(
                                (value) =>
                                    String(
                                        value
                                    ).trim() !== ""
                            ) && (
                                <button
                                    type="button"
                                    onClick={
                                        clearAdvancedSearch
                                    }
                                    className={SECONDARY_BUTTON_CLASS}
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4 p-5 sm:p-6">

                        {/* =========================================
                            EMPLOYEE INFORMATION
                        ========================================= */}

                        <SearchSection
                            title="Employee Information"
                            description="Search using basic employee details."
                        >
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <Field
                                    label="Employee ID"
                                    htmlFor="advancedEmployeeId"
                                >
                                    <input
                                        id="advancedEmployeeId"
                                        type="text"
                                        value={
                                            advancedSearchInput.employeeId
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateAdvancedSearchInput(
                                                "employeeId",
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="e.g. EMP001"
                                        className={INPUT_CLASS}
                                    />
                                </Field>

                                <Field
                                    label="Employee Name"
                                    htmlFor="advancedEmployeeName"
                                >
                                    <input
                                        id="advancedEmployeeName"
                                        type="text"
                                        value={
                                            advancedSearchInput.employeeName
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateAdvancedSearchInput(
                                                "employeeName",
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="Enter employee name"
                                        className={INPUT_CLASS}
                                    />
                                </Field>

                                <Field
                                    label="Email"
                                    htmlFor="advancedEmployeeEmail"
                                >
                                    <input
                                        id="advancedEmployeeEmail"
                                        type="email"
                                        value={
                                            advancedSearchInput.email
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateAdvancedSearchInput(
                                                "email",
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="Enter email address"
                                        className={INPUT_CLASS}
                                    />
                                </Field>
                            </div>
                        </SearchSection>

                        {/* =========================================
                            SKILLS
                        ========================================= */}

                        <SearchSection
                            title="Skills"
                            description="Search employees based on their primary or secondary skills."
                        >
                            <Field
                                label="Skills"
                                htmlFor="advancedSkills"
                            >
                                <input
                                    id="advancedSkills"
                                    type="text"
                                    value={
                                        advancedSearchInput.skills
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateAdvancedSearchInput(
                                            "skills",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="e.g. React, Node.js, MongoDB"
                                    className={INPUT_CLASS}
                                />

                                <p className="mt-1.5 text-xs text-gray-500">
                                    Separate multiple
                                    skills with commas.
                                </p>
                            </Field>
                        </SearchSection>

                        {/* =========================================
                            EXPERIENCE
                        ========================================= */}

                        {/* <SearchSection
                            title="Experience"
                            description="Filter employees by years of experience."
                        >
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Field
                                    label="Minimum Experience"
                                    htmlFor="minExperience"
                                >
                                    <div className="relative">
                                        <input
                                            id="minExperience"
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={
                                                advancedSearchInput.minExperience
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateAdvancedSearchInput(
                                                    "minExperience",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="e.g. 2"
                                            className={`${INPUT_CLASS} pr-20`}
                                        />

                                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                                            years
                                        </span>
                                    </div>
                                </Field>

                                <Field
                                    label="Maximum Experience"
                                    htmlFor="maxExperience"
                                >
                                    <div className="relative">
                                        <input
                                            id="maxExperience"
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={
                                                advancedSearchInput.maxExperience
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateAdvancedSearchInput(
                                                    "maxExperience",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="e.g. 10"
                                            className={`${INPUT_CLASS} pr-20`}
                                        />

                                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                                            years
                                        </span>
                                    </div>
                                </Field>
                            </div>

                            {invalidExperienceRange && (
                                <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                                    Minimum experience
                                    cannot be greater
                                    than maximum
                                    experience.
                                </p>
                            )}
                        </SearchSection> */}

                        {/* =========================================
                            PROJECT
                        ========================================= */}

                        <SearchSection
                            title="Project"
                            description="Filter employees according to project assignment."
                        >
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Field
                                    label="Project Assignment"
                                    htmlFor="advancedProjectAssignment"
                                >
                                    <select
                                        id="advancedProjectAssignment"
                                        value={
                                            advancedSearchInput.projectAssignment
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateAdvancedSearchInput(
                                                "projectAssignment",
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className={SELECT_CLASS}
                                    >
                                        <option value="">
                                            All Employees
                                        </option>

                                        <option value="assigned">
                                            Assigned to Project
                                        </option>

                                        <option value="unassigned">
                                            Not Assigned
                                        </option>
                                    </select>
                                </Field>

                                <Field
                                    label="Project Status"
                                    htmlFor="advancedProjectStatus"
                                >
                                    <select
                                        id="advancedProjectStatus"
                                        value={
                                            advancedSearchInput.projectStatus
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateAdvancedSearchInput(
                                                "projectStatus",
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className={SELECT_CLASS}
                                    >
                                        <option value="">
                                            All Project Statuses
                                        </option>

                                        <option value="pending">
                                            Pending
                                        </option>

                                        <option value="active">
                                            Active
                                        </option>

                                        <option value="completed">
                                            Completed
                                        </option>
                                    </select>
                                </Field>
                            </div>
                        </SearchSection>

                        {/* =========================================
                            EDUCATION
                        ========================================= */}

                        <SearchSection
                            title="Education"
                            description="Search employees by qualification and specialization."
                        >
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Field
                                    label="Qualification"
                                    htmlFor="advancedQualification"
                                >
                                    <input
                                        id="advancedQualification"
                                        type="text"
                                        value={
                                            advancedSearchInput.qualification
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateAdvancedSearchInput(
                                                "qualification",
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="e.g. B.Tech, MCA, M.Tech"
                                        className={INPUT_CLASS}
                                    />
                                </Field>

                                <Field
                                    label="Specialization"
                                    htmlFor="advancedSpecialization"
                                >
                                    <input
                                        id="advancedSpecialization"
                                        type="text"
                                        value={
                                            advancedSearchInput.specialization
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateAdvancedSearchInput(
                                                "specialization",
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="e.g. Computer Science"
                                        className={INPUT_CLASS}
                                    />
                                </Field>
                            </div>
                        </SearchSection>

                        {/* =========================================
                            LOCATION
                        ========================================= */}

                        <SearchSection
                            title="Location"
                            description="Search employees by state or city."
                        >
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Field
                                    label="State"
                                    htmlFor="advancedState"
                                >
                                    <input
                                        id="advancedState"
                                        type="text"
                                        value={
                                            advancedSearchInput.state
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateAdvancedSearchInput(
                                                "state",
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="Enter state"
                                        className={INPUT_CLASS}
                                    />
                                </Field>

                                <Field
                                    label="City"
                                    htmlFor="advancedCity"
                                >
                                    <input
                                        id="advancedCity"
                                        type="text"
                                        value={
                                            advancedSearchInput.city
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateAdvancedSearchInput(
                                                "city",
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="Enter city"
                                        className={INPUT_CLASS}
                                    />
                                </Field>
                            </div>
                        </SearchSection>
                    </div>

                    {/* =============================================
                        ADVANCED SEARCH FOOTER
                    ============================================= */}

                    <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-700">
                                Enter your filters and
                                click Advanced Search
                                to view matching
                                employees.
                            </p>

                            <p className="mt-0.5 text-xs text-gray-500">
                                Your search is not applied
                                until you click the
                                button.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                            {Object.values(
                                advancedSearchInput
                            ).some(
                                (value) =>
                                    String(
                                        value
                                    ).trim() !== ""
                            ) && (
                                <button
                                    type="button"
                                    onClick={
                                        clearAdvancedSearch
                                    }
                                    className={SECONDARY_BUTTON_CLASS}
                                >
                                    Reset
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={
                                    handleAdvancedSearch
                                }
                                disabled={
                                    invalidExperienceRange
                                }
                                className={`${
                                    invalidExperienceRange
                                        ? "cursor-not-allowed bg-gray-300"
                                        : ""
                                } ${PRIMARY_BUTTON_CLASS}`}
                            >
                                Advanced Search
                            </button>
                        </div>
                    </div>
                </section>

                {/* =================================================
                    ACTIVE FILTER SUMMARY
                ================================================= */}

                {activeFilterItems.length >
                    0 && (
                    <section className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 sm:p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-sm font-semibold text-blue-900">
                                        Active Filters
                                    </h2>

                                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-blue-700">
                                        {
                                            activeFilterItems.length
                                        }
                                    </span>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {activeFilterItems.map(
                                        (
                                            filter,
                                            index
                                        ) => (
                                            <span
                                                key={`${filter}-${index}`}
                                                className="rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-800"
                                            >
                                                {
                                                    filter
                                                }
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    resetAllFilters
                                }
                                className="self-start rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                            >
                                Reset All Filters
                            </button>
                        </div>
                    </section>
                )}

                {/* =================================================
                    EMPLOYEE DIRECTORY
                ================================================= */}

                <section
                    ref={
                        employeeResultsRef
                    }
                    id="employee-results"
                    className="scroll-mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                    <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">
                                Employee Directory
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                {
                                    filteredEmployees.length
                                }{" "}
                                employee
                                {filteredEmployees.length !==
                                1
                                    ? "s"
                                    : ""}{" "}
                                displayed
                            </p>
                        </div>

                        {(search ||
                            statusFilter ||
                            hasAdvancedSearch) && (
                            <button
                                type="button"
                                onClick={
                                    resetAllFilters
                                }
                                className={SECONDARY_BUTTON_CLASS}
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>

                    {filteredEmployees.length >
                    0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-[1100px] w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Employee ID
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Employee
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Email
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Primary Skills
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Secondary Skills
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Status
                                        </th>

                                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {filteredEmployees.map(
                                        (
                                            employee
                                        ) => {
                                            const {
                                                primary,
                                                secondary,
                                            } =
                                                getEmployeeSkills(
                                                    employee
                                                );

                                            const employeeName =
                                                getEmployeeName(
                                                    employee
                                                );

                                            const email =
                                                getEmployeeEmail(
                                                    employee
                                                );

                                            const isActive =
                                                normalizeValue(
                                                    employee.presentStatus
                                                ) ===
                                                "active";

                                            return (
                                                <tr
                                                    key={
                                                        employee.employeeId
                                                    }
                                                    className="transition hover:bg-gray-50"
                                                >
                                                    {/* EMPLOYEE ID */}

                                                    <td className="px-5 py-4 align-top">
                                                        <Link
                                                            to={`/admin/employees/${employee.employeeId}`}
                                                            className="font-semibold text-blue-600 transition hover:text-blue-800 hover:underline"
                                                        >
                                                            {
                                                                employee.employeeId
                                                            }
                                                        </Link>
                                                    </td>

                                                    {/* NAME */}

                                                    <td className="px-5 py-4 align-top">
                                                        <div>
                                                            <p className="font-semibold text-gray-900">
                                                                {employeeName ||
                                                                    "N/A"}
                                                            </p>

                                                            {getEmployeePhone(
                                                                employee
                                                            ) && (
                                                                <p className="mt-1 text-xs text-gray-500">
                                                                    {
                                                                        getEmployeePhone(
                                                                            employee
                                                                        )
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* EMAIL */}

                                                    <td className="max-w-[240px] px-5 py-4 align-top">
                                                        <p
                                                            className="break-words text-sm text-gray-600"
                                                            title={
                                                                email ||
                                                                ""
                                                            }
                                                        >
                                                            {email ||
                                                                "N/A"}
                                                        </p>
                                                    </td>

                                                    {/* PRIMARY SKILLS */}

                                                    <td className="max-w-[260px] px-5 py-4 align-top">
                                                        {primary.length >
                                                        0 ? (
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {primary.map(
                                                                    (
                                                                        skill,
                                                                        index
                                                                    ) => (
                                                                        <span
                                                                            key={`${skill}-${index}`}
                                                                            className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                                                                        >
                                                                            {
                                                                                skill
                                                                            }
                                                                        </span>
                                                                    )
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-gray-400">
                                                                Not
                                                                available
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* SECONDARY SKILLS */}

                                                    <td className="max-w-[260px] px-5 py-4 align-top">
                                                        {secondary.length >
                                                        0 ? (
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {secondary.map(
                                                                    (
                                                                        skill,
                                                                        index
                                                                    ) => (
                                                                        <span
                                                                            key={`${skill}-${index}`}
                                                                            className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                                                                        >
                                                                            {
                                                                                skill
                                                                            }
                                                                        </span>
                                                                    )
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-gray-400">
                                                                Not
                                                                available
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* STATUS */}

                                                    <td className="px-5 py-4 align-top">
                                                        <span
                                                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                                                                employee.presentStatus
                                                            )}`}
                                                        >
                                                            {normalizeValue(
                                                                employee.presentStatus
                                                            ) ||
                                                                "Unknown"}
                                                        </span>
                                                    </td>

                                                    {/* ACTION */}

                                                    <td className="px-5 py-4 text-right align-top">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    employee.employeeId,
                                                                    isActive
                                                                        ? "Inactive"
                                                                        : "Active"
                                                                )
                                                            }
                                                            className={`rounded-lg border px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 ${
                                                                isActive
                                                                    ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 focus:ring-red-100"
                                                                    : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 focus:ring-green-100"
                                                            }`}
                                                        >
                                                            {isActive
                                                                ? "Deactivate"
                                                                : "Activate"}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        /* =========================================
                           EMPTY STATE
                        ========================================= */

                        <div className="px-6 py-16 text-center">
                            <div className="mx-auto max-w-md">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                                    <span className="text-lg font-semibold text-gray-400">
                                        0
                                    </span>
                                </div>

                                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                                    No employees found
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    No employees match
                                    your current search
                                    and filter criteria.
                                    Try changing your
                                    search terms or
                                    clearing some filters.
                                </p>

                                <div className="mt-5">
                                    <button
                                        type="button"
                                        onClick={
                                            resetAllFilters
                                        }
                                        className={PRIMARY_BUTTON_CLASS}
                                    >
                                        Reset All Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* =================================================
                        TABLE FOOTER
                    ================================================= */}

                    {filteredEmployees.length >
                        0 && (
                        <div className="border-t border-gray-200 bg-gray-50 px-5 py-3 sm:px-6">
                            <div className="flex flex-col gap-1 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                                <p>
                                    Showing{" "}
                                    <span className="font-semibold text-gray-700">
                                        {
                                            filteredEmployees.length
                                        }
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-semibold text-gray-700">
                                        {
                                            totalEmployees
                                        }
                                    </span>{" "}
                                    employees
                                </p>

                                <p>
                                    Employee status can
                                    be updated directly
                                    from this table.
                                </p>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Employees;