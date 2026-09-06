const mongoose = require("mongoose");

const Project = require("../model/Project");
const ProjectAssignment = require("../model/ProjectAssignment");
const Employee = require("../model/Employee");

// ======================================================
// HELPER: FIND PROJECT BY MONGO ID OR PROJECT CODE
// ======================================================

const findProject = async (id) => {
    if (!id) {
        return null;
    }

    let project = null;

    // MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
        project = await Project.findById(id);
    }

    // Project code such as PRJ001
    if (!project) {
        project = await Project.findOne({
            projectId: String(id).trim().toUpperCase(),
        });
    }

    return project;
};

// ======================================================
// HELPER: GET LOGGED-IN USER ID
// ======================================================

const getUserId = (req) => {
    return (
        req.user?.id ||
        req.user?._id ||
        req.user?.userId ||
        null
    );
};

// ======================================================
// HELPER: FIND EMPLOYEES BY MONGO ID OR EMPLOYEE CODE
// Accepts a mixed array of Mongo _id strings and/or
// human-readable employee codes (e.g. "EMP001") and
// resolves both against the Employee collection.
// ======================================================

const findEmployeesByMixedIds = async (rawIds) => {
    const cleanedIds = [
        ...new Set(
            (rawIds || [])
                .map((val) => String(val).trim())
                .filter(Boolean)
        ),
    ];

    const objectIds = [];
    const employeeCodes = [];

    cleanedIds.forEach((val) => {
        if (mongoose.Types.ObjectId.isValid(val)) {
            objectIds.push(new mongoose.Types.ObjectId(val));
        } else {
            employeeCodes.push(val.toUpperCase());
        }
    });

    const orConditions = [];

    if (objectIds.length > 0) {
        orConditions.push({ _id: { $in: objectIds } });
    }

    if (employeeCodes.length > 0) {
        orConditions.push({ employeeId: { $in: employeeCodes } });
    }

    const employees =
        orConditions.length > 0
            ? await Employee.find({ $or: orConditions })
            : [];

    const foundValues = employees.flatMap((employee) =>
        [
            String(employee._id),
            employee.employeeId
                ? String(employee.employeeId).toUpperCase()
                : null,
        ].filter(Boolean)
    );

    const missingIds = cleanedIds.filter((val) => {
        const asObjectId = mongoose.Types.ObjectId.isValid(val)
            ? val
            : val.toUpperCase();
        return !foundValues.includes(String(asObjectId));
    });

    return { cleanedIds, employees, missingIds };
};

// ======================================================
// CREATE PROJECT
// POST /api/projects
// ======================================================

const createProject = async (req, res) => {
    try {
        const {
            projectId,
            projectCode,
            projectName,
            name,
            description,
            client,
            projectType,
            priority,
            startDate,
            endDate,
            status,
            technologyStack,
            technologies,
            objectives,
            employeeIds,
        } = req.body;

        // ==================================================
        // PROJECT ID
        // ==================================================

        const finalProjectId = String(
            projectId ||
            projectCode ||
            ""
        )
            .trim()
            .toUpperCase();

        if (!finalProjectId) {
            return res.status(400).json({
                success: false,
                message: "Project ID / Project Code is required",
            });
        }

        // ==================================================
        // PROJECT NAME
        // ==================================================

        const finalProjectName = String(
            name ||
            projectName ||
            ""
        ).trim();

        if (!finalProjectName) {
            return res.status(400).json({
                success: false,
                message: "Project name is required",
            });
        }

        // ==================================================
        // DATES
        // ==================================================

        if (!startDate) {
            return res.status(400).json({
                success: false,
                message: "Start date is required",
            });
        }

        if (!endDate) {
            return res.status(400).json({
                success: false,
                message: "End date is required",
            });
        }

        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);

        if (Number.isNaN(parsedStartDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid start date",
            });
        }

        if (Number.isNaN(parsedEndDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid end date",
            });
        }

        if (parsedEndDate < parsedStartDate) {
            return res.status(400).json({
                success: false,
                message: "End date cannot be before start date",
            });
        }

        // ==================================================
        // EMPLOYEES
        // ==================================================

        if (!Array.isArray(employeeIds)) {
            return res.status(400).json({
                success: false,
                message: "employeeIds must be an array",
            });
        }

        // FIX: accept both Mongo _id and employee code (e.g. "EMP001")
        const {
            cleanedIds: uniqueEmployeeIds,
            employees,
            missingIds: missingEmployeeIds,
        } = await findEmployeesByMixedIds(employeeIds);

        if (uniqueEmployeeIds.length < 2) {
            return res.status(400).json({
                success: false,
                message:
                    "A minimum of 2 employees is required for a project",
            });
        }

        if (missingEmployeeIds.length > 0) {
            return res.status(404).json({
                success: false,
                message:
                    "One or more employees were not found",
                missingEmployeeIds,
            });
        }

        // ==================================================
        // CHECK PROJECT CODE DUPLICATE
        // ==================================================

        const existingProject = await Project.findOne({
            projectId: finalProjectId,
        });

        if (existingProject) {
            return res.status(409).json({
                success: false,
                message: "Project ID already exists",
            });
        }

        // ==================================================
        // LOGGED-IN USER
        // ==================================================

        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User identity not found",
            });
        }

        // ==================================================
        // PRIORITY
        // ==================================================

        const finalPriority = String(
            priority || ""
        )
            .trim()
            .toLowerCase();

        const validPriorities = [
            "",
            "low",
            "medium",
            "high",
            "critical",
        ];

        if (!validPriorities.includes(finalPriority)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project priority",
            });
        }

        // ==================================================
        // STATUS
        // ==================================================

        const finalStatus = String(
            status || "pending"
        )
            .trim()
            .toLowerCase();

        const validStatuses = [
            "pending",
            "active",
            "completed",
            "cancelled",
        ];

        if (!validStatuses.includes(finalStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project status",
            });
        }

        // ==================================================
        // TECHNOLOGY STACK
        // ==================================================

        const finalTechnologyStack =
            Array.isArray(technologyStack)
                ? technologyStack
                      .map((item) =>
                          String(item).trim()
                      )
                      .filter(Boolean)
                : typeof technologyStack === "string"
                ? technologyStack
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean)
                : Array.isArray(technologies)
                ? technologies
                      .map((item) =>
                          String(item).trim()
                      )
                      .filter(Boolean)
                : [];

        // ==================================================
        // OBJECTIVES
        // ==================================================

        const finalObjectives =
            Array.isArray(objectives)
                ? objectives
                      .map((item) =>
                          String(item).trim()
                      )
                      .filter(Boolean)
                : typeof objectives === "string"
                ? objectives
                      .split("\n")
                      .map((item) => item.trim())
                      .filter(Boolean)
                : [];

        // ==================================================
        // CREATE PROJECT
        // ==================================================

        const project = await Project.create({
            projectId: finalProjectId,

            name: finalProjectName,

            description: String(
                description || ""
            ).trim(),

            client: String(
                client || ""
            ).trim(),

            projectType: String(
                projectType || ""
            ).trim(),

            priority: finalPriority,

            startDate: parsedStartDate,

            endDate: parsedEndDate,

            status: finalStatus,

            technologyStack:
                finalTechnologyStack,

            objectives:
                finalObjectives,

            createdBy: userId,
        });

        // ==================================================
        // CREATE PROJECT ASSIGNMENTS
        // ==================================================

        const assignments =
            employees.map((employee) => ({
                projectId: project._id,

                employeeId: employee._id,

                assignedBy: userId,

                role: "",

                allocation: 100,

                status: "active",

                assignedDate: new Date(),
            }));

        try {
            await ProjectAssignment.insertMany(
                assignments,
                { ordered: true }
            );
        } catch (assignmentError) {
            // roll back the project if assignment creation fails
            await Project.findByIdAndDelete(project._id);
            throw assignmentError;
        }

        // ==================================================
        // RESPONSE TEAM
        // ==================================================

        const team = employees.map(
            (employee) => {
                const firstName =
                    employee.personalDetails
                        ?.firstName ||
                    employee.firstName ||
                    "";

                const lastName =
                    employee.personalDetails
                        ?.lastName ||
                    employee.lastName ||
                    "";

                return {
                    employeeId:
                        employee.employeeId,

                    name:
                        `${firstName} ${lastName}`.trim() ||
                        employee.name ||
                        "Unknown Employee",

                    email:
                        employee.email || "",

                    role: "",

                    allocation: 100,

                    status: "active",
                };
            }
        );

        // ==================================================
        // SUCCESS
        // ==================================================

        return res.status(201).json({
            success: true,

            message:
                "Project created successfully",

            project: {
                _id: project._id,

                projectId:
                    project.projectId,

                name:
                    project.name,

                description:
                    project.description,

                client:
                    project.client,

                projectType:
                    project.projectType,

                priority:
                    project.priority,

                startDate:
                    project.startDate,

                endDate:
                    project.endDate,

                status:
                    project.status,

                technologyStack:
                    project.technologyStack,

                objectives:
                    project.objectives,

                createdBy:
                    project.createdBy,
            },

            teamMemberCount:
                team.length,

            team,
        });
    } catch (error) {
        console.error(
            "❌ Create Project Error:",
            error
        );

        // ==================================================
        // MONGOOSE VALIDATION ERROR
        // ==================================================

        if (
            error.name ===
            "ValidationError"
        ) {
            const validationErrors =
                Object.values(
                    error.errors || {}
                ).map(
                    (item) => ({
                        field:
                            item.path,

                        message:
                            item.message,
                    })
                );

            return res.status(400).json({
                success: false,

                message:
                    "Project validation failed",

                errors:
                    validationErrors,

                error:
                    error.message,
            });
        }

        // ==================================================
        // DUPLICATE KEY ERROR
        // ==================================================

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,

                message:
                    "Project ID already exists",

                error:
                    error.message,
            });
        }

        return res.status(500).json({
            success: false,

            message:
                "Failed to create project",

            error:
                error.message,
        });
    }
};

// ======================================================
// GET ALL PROJECTS
// GET /api/projects
// ======================================================

const getProjects = async (
    req,
    res
) => {
    try {
        const {
            search,
            status,
        } = req.query;

        const filter = {};

        // ==================================================
        // STATUS FILTER
        // ==================================================

        if (status) {
            filter.status = String(
                status
            )
                .trim()
                .toLowerCase();
        }

        // ==================================================
        // SEARCH
        // ==================================================

        if (
            search &&
            search.trim()
        ) {
            const searchValue =
                search.trim();

            filter.$or = [
                {
                    projectId: {
                        $regex:
                            searchValue,

                        $options: "i",
                    },
                },

                {
                    name: {
                        $regex:
                            searchValue,

                        $options: "i",
                    },
                },

                {
                    client: {
                        $regex:
                            searchValue,

                        $options: "i",
                    },
                },
            ];
        }

        // ==================================================
        // GET PROJECTS
        // ==================================================

        const projects =
            await Project.find(filter)
                .populate(
                    "createdBy",
                    "fullName email role"
                )
                .sort({
                    createdAt: -1,
                })
                .lean();

        // ==================================================
        // GET TEAM COUNTS
        // ==================================================

        const projectsWithTeams =
            await Promise.all(
                projects.map(
                    async (project) => {
                        const assignments =
                            await ProjectAssignment.find(
                                {
                                    projectId:
                                        project._id,

                                    status:
                                        "active",
                                }
                            )
                                .populate(
                                    "employeeId"
                                )
                                .lean();

                        return {
                            ...project,

                            employees:
                                assignments,

                            employeeIds:
                                assignments.map(
                                    (
                                        assignment
                                    ) =>
                                        assignment
                                            .employeeId
                                            ?.employeeId ||
                                        assignment
                                            .employeeId
                                            ?._id
                                ),

                            teamMemberCount:
                                assignments.length,
                        };
                    }
                )
            );

        return res.status(200).json({
            success: true,

            count:
                projectsWithTeams.length,

            projects:
                projectsWithTeams,
        });
    } catch (error) {
        console.error(
            "❌ Get Projects Error:",
            error
        );

        return res.status(500).json({
            success: false,

            message:
                "Failed to fetch projects",

            error:
                error.message,
        });
    }
};

// ======================================================
// GET SINGLE PROJECT
// GET /api/projects/:id
// ======================================================

const getProjectById = async (
    req,
    res
) => {
    try {
        const { id } =
            req.params;

        const project =
            await findProject(id);

        if (!project) {
            return res.status(404).json({
                success: false,

                message:
                    "Project not found",
            });
        }

        // ==================================================
        // GET ASSIGNMENTS
        // ==================================================

        const assignments =
            await ProjectAssignment.find(
                {
                    projectId:
                        project._id,

                    status: {
                        $ne: "removed",
                    },
                }
            )
                .populate(
                    "employeeId"
                )
                .populate(
                    "assignedBy",
                    "fullName email role"
                )
                .sort({
                    assignedDate: 1,
                })
                .lean();

        // ==================================================
        // EMPLOYEE IDS
        // ==================================================

        const employeeIds =
            assignments
                .map(
                    (assignment) =>
                        assignment
                            .employeeId
                            ?.employeeId ||
                        assignment
                            .employeeId
                            ?._id
                )
                .filter(Boolean);

        return res.status(200).json({
            success: true,

            project: {
                ...project.toObject(),

                employees:
                    assignments,

                employeeIds,

                teamMemberCount:
                    assignments.length,
            },

            assignments,

            employees:
                assignments,

            teamMemberCount:
                assignments.length,
        });
    } catch (error) {
        console.error(
            "❌ Get Project Error:",
            error
        );

        return res.status(500).json({
            success: false,

            message:
                "Failed to fetch project",

            error:
                error.message,
        });
    }
};

// ======================================================
// ALIAS
// ======================================================
// Your projectRoutes.js imports getProjectById.
// Keep getProjectDetails available too in case another
// controller/route still uses that name.
// ======================================================

const getProjectDetails =
    getProjectById;

// ======================================================
// UPDATE PROJECT
// PUT /api/projects/:id
// ======================================================

const updateProject = async (
    req,
    res
) => {
    try {
        const { id } =
            req.params;

        const project =
            await findProject(id);

        if (!project) {
            return res.status(404).json({
                success: false,

                message:
                    "Project not found",
            });
        }

        const {
            projectId,
            projectCode,
            projectName,
            name,
            description,
            client,
            projectType,
            priority,
            startDate,
            endDate,
            status,
            technologyStack,
            technologies,
            objectives,
        } = req.body;

        // ==================================================
        // PROJECT CODE
        // ==================================================

        const requestedProjectId =
            projectId ||
            projectCode;

        if (
            requestedProjectId !==
            undefined
        ) {
            const newProjectId =
                String(
                    requestedProjectId
                )
                    .trim()
                    .toUpperCase();

            if (!newProjectId) {
                return res.status(400).json({
                    success: false,

                    message:
                        "Project ID cannot be empty",
                });
            }

            const duplicate =
                await Project.findOne({
                    projectId:
                        newProjectId,

                    _id: {
                        $ne:
                            project._id,
                    },
                });

            if (duplicate) {
                return res.status(409).json({
                    success: false,

                    message:
                        "Project ID already exists",
                });
            }

            project.projectId =
                newProjectId;
        }

        // ==================================================
        // NAME
        // ==================================================

        const requestedName =
            name ||
            projectName;

        if (
            requestedName !==
            undefined
        ) {
            const finalName =
                String(
                    requestedName
                ).trim();

            if (!finalName) {
                return res.status(400).json({
                    success: false,

                    message:
                        "Project name cannot be empty",
                });
            }

            project.name =
                finalName;
        }

        // ==================================================
        // DESCRIPTION
        // ==================================================

        if (
            description !==
            undefined
        ) {
            project.description =
                String(
                    description
                ).trim();
        }

        // ==================================================
        // CLIENT
        // ==================================================

        if (
            client !==
            undefined
        ) {
            project.client =
                String(
                    client
                ).trim();
        }

        // ==================================================
        // PROJECT TYPE
        // ==================================================

        if (
            projectType !==
            undefined
        ) {
            project.projectType =
                String(
                    projectType
                ).trim();
        }

        // ==================================================
        // PRIORITY
        // ==================================================

        if (
            priority !==
            undefined
        ) {
            const finalPriority =
                String(
                    priority
                )
                    .trim()
                    .toLowerCase();

            const validPriorities =
                [
                    "",
                    "low",
                    "medium",
                    "high",
                    "critical",
                ];

            if (
                !validPriorities.includes(
                    finalPriority
                )
            ) {
                return res.status(400).json({
                    success: false,

                    message:
                        "Invalid project priority",
                });
            }

            project.priority =
                finalPriority;
        }

        // ==================================================
        // STATUS
        // ==================================================

        if (
            status !==
            undefined
        ) {
            const finalStatus =
                String(
                    status
                )
                    .trim()
                    .toLowerCase();

            const validStatuses =
                [
                    "pending",
                    "active",
                    "completed",
                    "cancelled",
                ];

            if (
                !validStatuses.includes(
                    finalStatus
                )
            ) {
                return res.status(400).json({
                    success: false,

                    message:
                        "Invalid project status",
                });
            }

            project.status =
                finalStatus;
        }

        // ==================================================
        // START DATE
        // ==================================================

        if (
            startDate !==
            undefined
        ) {
            const newStartDate =
                new Date(
                    startDate
                );

            if (
                Number.isNaN(
                    newStartDate.getTime()
                )
            ) {
                return res.status(400).json({
                    success: false,

                    message:
                        "Invalid start date",
                });
            }

            project.startDate =
                newStartDate;
        }

        // ==================================================
        // END DATE
        // ==================================================

        if (
            endDate !==
            undefined
        ) {
            const newEndDate =
                new Date(
                    endDate
                );

            if (
                Number.isNaN(
                    newEndDate.getTime()
                )
            ) {
                return res.status(400).json({
                    success: false,

                    message:
                        "Invalid end date",
                });
            }

            project.endDate =
                newEndDate;
        }

        // ==================================================
        // DATE VALIDATION
        // ==================================================

        if (
            project.startDate &&
            project.endDate &&
            project.endDate <
                project.startDate
        ) {
            return res.status(400).json({
                success: false,

                message:
                    "End date cannot be before start date",
            });
        }

        // ==================================================
        // TECHNOLOGY STACK
        // ==================================================

        const requestedTechnologyStack =
            technologyStack !==
            undefined
                ? technologyStack
                : technologies;

        if (
            requestedTechnologyStack !==
            undefined
        ) {
            if (
                !Array.isArray(
                    requestedTechnologyStack
                )
            ) {
                return res.status(400).json({
                    success: false,

                    message:
                        "technologyStack must be an array",
                });
            }

            project.technologyStack =
                requestedTechnologyStack
                    .map((item) =>
                        String(
                            item
                        ).trim()
                    )
                    .filter(Boolean);
        }

        // ==================================================
        // OBJECTIVES
        // ==================================================

        if (
            objectives !==
            undefined
        ) {
            if (
                !Array.isArray(
                    objectives
                )
            ) {
                return res.status(400).json({
                    success: false,

                    message:
                        "objectives must be an array",
                });
            }

            project.objectives =
                objectives
                    .map((item) =>
                        String(
                            item
                        ).trim()
                    )
                    .filter(Boolean);
        }

        // ==================================================
        // SAVE
        // ==================================================

        await project.save();

        const updatedProject =
            await Project.findById(
                project._id
            )
                .populate(
                    "createdBy",
                    "fullName email role"
                )
                .lean();

        return res.status(200).json({
            success: true,

            message:
                "Project updated successfully",

            project:
                updatedProject,
        });
    } catch (error) {
        console.error(
            "❌ Update Project Error:",
            error
        );

        if (
            error.name ===
            "ValidationError"
        ) {
            return res.status(400).json({
                success: false,

                message:
                    "Project validation failed",

                error:
                    error.message,
            });
        }

        return res.status(500).json({
            success: false,

            message:
                "Failed to update project",

            error:
                error.message,
        });
    }
};

// ======================================================
// DELETE PROJECT
// DELETE /api/projects/:id
// ======================================================

const deleteProject = async (
    req,
    res
) => {
    try {
        const { id } =
            req.params;

        const project =
            await findProject(id);

        if (!project) {
            return res.status(404).json({
                success: false,

                message:
                    "Project not found",
            });
        }

        // Delete assignments first
        await ProjectAssignment.deleteMany(
            {
                projectId:
                    project._id,
            }
        );

        // Delete project
        await Project.deleteOne({
            _id:
                project._id,
        });

        return res.status(200).json({
            success: true,

            message:
                "Project deleted successfully",
        });
    } catch (error) {
        console.error(
            "❌ Delete Project Error:",
            error
        );

        return res.status(500).json({
            success: false,

            message:
                "Failed to delete project",

            error:
                error.message,
        });
    }
};

// ======================================================
// GET PROJECT EMPLOYEES
// GET /api/projects/:id/employees
// ======================================================

const getProjectEmployees =
    async (req, res) => {
        try {
            const { id } =
                req.params;

            const project =
                await findProject(id);

            if (!project) {
                return res.status(404).json({
                    success: false,

                    message:
                        "Project not found",
                });
            }

            const assignments =
                await ProjectAssignment
                    .find({
                        projectId:
                            project._id,

                        status: {
                            $ne:
                                "removed",
                        },
                    })
                    .populate(
                        "employeeId"
                    )
                    .populate(
                        "assignedBy",
                        "fullName email role"
                    )
                    .sort({
                        assignedDate:
                            1,
                    })
                    .lean();

            return res.status(200).json({
                success: true,

                project: {
                    _id:
                        project._id,

                    projectId:
                        project.projectId,

                    name:
                        project.name,
                },

                employees:
                    assignments,

                assignments,

                count:
                    assignments.length,

                teamMemberCount:
                    assignments.length,
            });
        } catch (error) {
            console.error(
                "❌ Get Project Employees Error:",
                error
            );

            return res.status(500).json({
                success: false,

                message:
                    "Failed to fetch project employees",

                error:
                    error.message,
            });
        }
    };

// ======================================================
// REASSIGN PROJECT EMPLOYEES
// PUT /api/projects/:id/team
// ======================================================

const reassignProjectEmployees =
    async (req, res) => {
        try {
            const { id } =
                req.params;

            const {
                employeeIds,
            } = req.body;

            if (
                !Array.isArray(
                    employeeIds
                )
            ) {
                return res.status(400).json({
                    success: false,

                    message:
                        "employeeIds must be an array",
                });
            }

            // FIX: accept both Mongo _id and employee code
            const {
                cleanedIds: uniqueEmployeeIds,
                employees,
                missingIds: missingEmployeeIds,
            } = await findEmployeesByMixedIds(employeeIds);

            if (
                uniqueEmployeeIds.length <
                2
            ) {
                return res.status(400).json({
                    success: false,

                    message:
                        "A minimum of 2 employees is required",
                });
            }

            if (missingEmployeeIds.length > 0) {
                return res.status(404).json({
                    success: false,

                    message:
                        "Some employees were not found",

                    missingEmployeeIds,
                });
            }

            // ==================================================
            // FIND PROJECT
            // ==================================================

            const project =
                await findProject(id);

            if (!project) {
                return res.status(404).json({
                    success: false,

                    message:
                        "Project not found",
                });
            }

            // ==================================================
            // ADMIN
            // ==================================================

            const userId =
                getUserId(req);

            if (!userId) {
                return res.status(401).json({
                    success: false,

                    message:
                        "User identity not found",
                });
            }

            // ==================================================
            // EXISTING ASSIGNMENTS
            // ==================================================

            const existingAssignments =
                await ProjectAssignment.find(
                    {
                        projectId:
                            project._id,
                    }
                );

            // ==================================================
            // ACTIVATE / CREATE NEW TEAM
            // ==================================================

            for (
                const employee of
                employees
            ) {
                const existingAssignment =
                    existingAssignments.find(
                        (
                            assignment
                        ) =>
                            String(
                                assignment.employeeId
                            ) ===
                            String(
                                employee._id
                            )
                    );

                if (
                    existingAssignment
                ) {
                    existingAssignment.status =
                        "active";

                    existingAssignment.assignedBy =
                        userId;

                    existingAssignment.allocation =
                        100;

                    existingAssignment.assignedDate =
                        new Date();

                    await existingAssignment.save();
                } else {
                    await ProjectAssignment.create(
                        {
                            projectId:
                                project._id,

                            employeeId:
                                employee._id,

                            assignedBy:
                                userId,

                            role: "",

                            allocation:
                                100,

                            status:
                                "active",

                            assignedDate:
                                new Date(),
                        }
                    );
                }
            }

            // ==================================================
            // REMOVE EMPLOYEES NOT IN NEW TEAM
            // ==================================================

            await ProjectAssignment.updateMany(
                {
                    projectId:
                        project._id,

                    employeeId: {
                        $nin:
                            employees.map(
                                (
                                    employee
                                ) =>
                                    employee._id
                            ),
                    },
                },
                {
                    $set: {
                        status:
                            "removed",
                    },
                }
            );

            // ==================================================
            // GET FINAL TEAM
            // ==================================================

            const finalAssignments =
                await ProjectAssignment
                    .find({
                        projectId:
                            project._id,

                        status:
                            "active",
                    })
                    .populate(
                        "employeeId"
                    )
                    .populate(
                        "assignedBy",
                        "fullName email role"
                    )
                    .sort({
                        assignedDate:
                            1,
                    })
                    .lean();

            // ==================================================
            // RESPONSE
            // ==================================================

            return res.status(200).json({
                success: true,

                message:
                    "Project employees reassigned successfully",

                project: {
                    _id:
                        project._id,

                    projectId:
                        project.projectId,

                    name:
                        project.name,
                },

                employees:
                    finalAssignments,

                assignments:
                    finalAssignments,

                teamMemberCount:
                    finalAssignments.length,
            });
        } catch (error) {
            console.error(
                "❌ Reassign Project Employees Error:",
                error
            );

            return res.status(500).json({
                success: false,

                message:
                    "Failed to reassign project employees",

                error:
                    error.message,
            });
        }
    };

// ======================================================
// EXPORT
// ======================================================

module.exports = {
    createProject,

    getProjects,

    getProjectById,

    // Alias for compatibility
    getProjectDetails,

    updateProject,

    deleteProject,

    getProjectEmployees,

    reassignProjectEmployees,
};