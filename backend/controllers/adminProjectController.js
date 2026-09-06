const mongoose = require("mongoose");

const Project = require("../model/project");
const Employee = require("../model/Employee");
const ProjectAssignment = require("../model/projectAssignment");


// ======================================================
// CALCULATE PROJECT STATUS
// ======================================================

const calculateProjectStatus = (
    startDate,
    endDate
) => {

    if (!startDate || !endDate) {
        return "pending";
    }

    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    const start = new Date(
        startDate
    );

    start.setHours(
        0,
        0,
        0,
        0
    );

    const end = new Date(
        endDate
    );

    end.setHours(
        23,
        59,
        59,
        999
    );

    if (
        Number.isNaN(
            start.getTime()
        ) ||
        Number.isNaN(
            end.getTime()
        )
    ) {
        return "pending";
    }

    if (end < today) {
        return "completed";
    }

    if (start > today) {
        return "pending";
    }

    return "active";
};


// ======================================================
// CREATE PROJECT
// POST /api/admin/projects
// ======================================================

const createProject = async (
    req,
    res
) => {

    let createdProject = null;

    try {

        console.log("");
        console.log(
            "========================================"
        );
        console.log(
            "===== CREATE PROJECT REQUEST ====="
        );
        console.log(
            "========================================"
        );

        console.log(
            "REQUEST BODY:"
        );

        console.log(
            JSON.stringify(
                req.body,
                null,
                2
            )
        );

        console.log(
            "AUTHENTICATED USER:"
        );

        console.log(
            req.user
        );


        // ==================================================
        // GET REQUEST DATA
        // ==================================================

        const {
            projectId,
            projectCode,
            name,
            projectName,
            description,
            client,
            projectType,
            priority,
            startDate,
            endDate,
            technologyStack,
            objectives,
            employeeIds
        } = req.body;


        // ==================================================
        // PROJECT NAME
        // ==================================================

        const finalProjectName =
            String(
                name ||
                projectName ||
                ""
            ).trim();


        if (!finalProjectName) {

            return res.status(400).json({
                success: false,
                message:
                    "Project name is required"
            });
        }


        // ==================================================
        // PROJECT CODE
        // ==================================================

        const finalProjectId =
            String(
                projectId ||
                projectCode ||
                ""
            )
                .trim()
                .toUpperCase();


        if (!finalProjectId) {

            return res.status(400).json({
                success: false,
                message:
                    "Project code is required"
            });
        }


        // ==================================================
        // START DATE
        // ==================================================

        if (!startDate) {

            return res.status(400).json({
                success: false,
                message:
                    "Start date is required"
            });
        }


        // ==================================================
        // END DATE
        // ==================================================

        if (!endDate) {

            return res.status(400).json({
                success: false,
                message:
                    "End date is required"
            });
        }


        // ==================================================
        // CONVERT DATES
        // ==================================================

        const start =
            new Date(startDate);

        const end =
            new Date(endDate);


        if (
            Number.isNaN(
                start.getTime()
            ) ||
            Number.isNaN(
                end.getTime()
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid project dates"
            });
        }


        // ==================================================
        // DATE VALIDATION
        // ==================================================

        if (end < start) {

            return res.status(400).json({
                success: false,
                message:
                    "End date cannot be before start date"
            });
        }


        // ==================================================
        // PROJECT STATUS
        // ==================================================

        const finalStatus =
            calculateProjectStatus(
                start,
                end
            );


        console.log(
            "PROJECT STATUS:",
            finalStatus
        );


        // ==================================================
        // EMPLOYEE IDS VALIDATION
        // ==================================================

        if (
            !Array.isArray(
                employeeIds
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "employeeIds must be an array"
            });
        }


        if (
            employeeIds.length < 2
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Select at least 2 employees"
            });
        }


        // ==================================================
        // CLEAN EMPLOYEE IDS
        // ==================================================

        const uniqueEmployeeIds = [
            ...new Set(
                employeeIds
                    .map(
                        (id) =>
                            String(id).trim()
                    )
                    .filter(Boolean)
            )
        ];


        if (
            uniqueEmployeeIds.length < 2
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Select at least 2 different employees"
            });
        }


        console.log(
            "SELECTED EMPLOYEES:",
            uniqueEmployeeIds
        );


        // ==================================================
        // DUPLICATE PROJECT CHECK
        // ==================================================

        const existingProject =
            await Project.findOne({
                projectId:
                    finalProjectId
            });


        if (existingProject) {

            return res.status(409).json({
                success: false,
                message:
                    "Project code already exists"
            });
        }


        // ==================================================
        // FIND EMPLOYEES
        // SUPPORT:
        // 1. MongoDB _id
        // 2. employeeId
        // ==================================================

        const objectIds = [];

        const employeeCodes = [];


        uniqueEmployeeIds.forEach(
            (id) => {

                if (
                    mongoose.Types.ObjectId.isValid(
                        id
                    )
                ) {

                    objectIds.push(
                        new mongoose.Types.ObjectId(
                            id
                        )
                    );
                }


                employeeCodes.push(
                    String(id)
                        .trim()
                        .toUpperCase()
                );
            }
        );


        const employeeQuery = {
            $or: []
        };


        if (
            objectIds.length > 0
        ) {

            employeeQuery.$or.push({
                _id: {
                    $in: objectIds
                }
            });
        }


        if (
            employeeCodes.length > 0
        ) {

            employeeQuery.$or.push({
                employeeId: {
                    $in: employeeCodes
                }
            });
        }


        const employees =
            await Employee.find(
                employeeQuery
            );


        console.log(
            "FOUND EMPLOYEES:",
            employees.length
        );


        // ==================================================
        // EMPLOYEE COUNT VALIDATION
        // ==================================================

        if (
            employees.length < 2
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "At least 2 valid employees are required"
            });
        }


        // ==================================================
        // CHECK MISSING EMPLOYEES
        // ==================================================

        const foundIds = new Set();


        employees.forEach(
            (employee) => {

                foundIds.add(
                    String(
                        employee._id
                    )
                );


                if (
                    employee.employeeId
                ) {

                    foundIds.add(
                        String(
                            employee.employeeId
                        )
                            .trim()
                            .toUpperCase()
                    );
                }
            }
        );


        const missingEmployees =
            uniqueEmployeeIds.filter(
                (id) => {

                    const value =
                        String(id)
                            .trim()
                            .toUpperCase();

                    return (
                        !foundIds.has(
                            String(id)
                        ) &&
                        !foundIds.has(
                            value
                        )
                    );
                }
            );


        if (
            missingEmployees.length > 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "One or more employees were not found",
                missingEmployees
            });
        }


        // ==================================================
        // ADMIN / CREATED BY
        // ==================================================

        const createdBy =
            req.user?._id ||
            req.user?.id ||
            req.user?.userId;


        if (!createdBy) {

            return res.status(401).json({
                success: false,
                message:
                    "Authenticated admin user not found"
            });
        }


        if (
            !mongoose.Types.ObjectId.isValid(
                createdBy
            )
        ) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid authenticated admin ID"
            });
        }


        // ==================================================
        // PRIORITY
        // ==================================================

        let finalPriority =
            String(
                priority ||
                "medium"
            )
                .trim()
                .toLowerCase();


        const allowedPriorities = [
            "low",
            "medium",
            "high",
            "critical"
        ];


        if (
            !allowedPriorities.includes(
                finalPriority
            )
        ) {

            finalPriority =
                "medium";
        }


        // ==================================================
        // TECHNOLOGY STACK
        // ==================================================

        let finalTechnologyStack = [];


        if (
            Array.isArray(
                technologyStack
            )
        ) {

            finalTechnologyStack =
                technologyStack
                    .map(
                        (technology) =>
                            String(
                                technology
                            ).trim()
                    )
                    .filter(Boolean);

        } else if (
            typeof technologyStack ===
            "string"
        ) {

            finalTechnologyStack =
                technologyStack
                    .split(",")
                    .map(
                        (technology) =>
                            technology.trim()
                    )
                    .filter(Boolean);
        }


        finalTechnologyStack = [
            ...new Set(
                finalTechnologyStack
            )
        ];


        // ==================================================
        // OBJECTIVES
        // ==================================================

        let finalObjectives = [];


        if (
            Array.isArray(
                objectives
            )
        ) {

            finalObjectives =
                objectives
                    .map(
                        (objective) =>
                            String(
                                objective
                            ).trim()
                    )
                    .filter(Boolean);

        } else if (
            typeof objectives ===
            "string"
        ) {

            finalObjectives =
                objectives
                    .split("\n")
                    .map(
                        (objective) =>
                            objective.trim()
                    )
                    .filter(Boolean);
        }


        // ==================================================
        // EMPLOYEE CODES FOR PROJECT
        // ==================================================

        const projectEmployeeIds =
            employees
                .map(
                    (employee) =>
                        employee.employeeId
                            ? String(
                                employee.employeeId
                            ).trim()
                            : null
                )
                .filter(Boolean);


        if (
            projectEmployeeIds.length < 2
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Employees must have valid employee IDs"
            });
        }


        // ==================================================
        // CREATE PROJECT
        // ==================================================

        console.log(
            "CREATING PROJECT..."
        );


        createdProject =
            await Project.create({

                projectId:
                    finalProjectId,

                name:
                    finalProjectName,

                description:
                    String(
                        description ||
                        ""
                    ).trim(),

                client:
                    String(
                        client ||
                        ""
                    ).trim(),

                projectType:
                    String(
                        projectType ||
                        ""
                    ).trim(),

                priority:
                    finalPriority,

                startDate:
                    start,

                endDate:
                    end,

                status:
                    finalStatus,

                technologyStack:
                    finalTechnologyStack,

                objectives:
                    finalObjectives,

                employeeIds:
                    projectEmployeeIds,

                createdBy:
                    new mongoose.Types.ObjectId(
                        createdBy
                    )
            });


        console.log(
            "PROJECT CREATED:",
            createdProject._id
        );


        // ==================================================
        // CREATE PROJECT ASSIGNMENTS
        // ==================================================

        const assignments =
            employees.map(
                (employee) => ({

                    projectId:
                        createdProject._id,

                    employeeId:
                        employee._id,

                    assignedBy:
                        new mongoose.Types.ObjectId(
                            createdBy
                        ),

                    role: "",

                    allocation: 100,

                    status:
                        "active"
                })
            );


        console.log(
            "CREATING ASSIGNMENTS:",
            assignments.length
        );


        try {

            await ProjectAssignment.insertMany(
                assignments,
                {
                    ordered: true
                }
            );

        } catch (
            assignmentError
        ) {

            console.error(
                "ASSIGNMENT ERROR:",
                assignmentError
            );


            // ==================================================
            // ROLLBACK PROJECT
            // ==================================================

            await Project.findByIdAndDelete(
                createdProject._id
            );


            createdProject = null;

            throw assignmentError;
        }


        // ==================================================
        // GET CREATED PROJECT
        // ==================================================

        const populatedProject =
            await Project.findById(
                createdProject._id
            ).populate(
                "createdBy",
                "name email"
            );


        // ==================================================
        // SUCCESS
        // ==================================================

        console.log(
            "========================================"
        );

        console.log(
            "===== PROJECT CREATED SUCCESSFULLY ====="
        );

        console.log(
            "PROJECT:",
            finalProjectId
        );

        console.log(
            "EMPLOYEES:",
            employees.length
        );

        console.log(
            "========================================"
        );


        return res.status(201).json({

            success: true,

            message:
                "Project created successfully",

            project:
                populatedProject,

            employees:
                employees.map(
                    (employee) => ({

                        _id:
                            employee._id,

                        employeeId:
                            employee.employeeId,

                        name:
                            `${employee.personalDetails?.firstName || ""} ${
                                employee.personalDetails?.lastName || ""
                            }`.trim(),

                        email:
                            employee.email
                    })
                )
        });


    } catch (error) {

        // ==================================================
        // ERROR LOGGING
        // ==================================================

        console.error("");
        console.error(
            "========================================"
        );

        console.error(
            "❌ CREATE PROJECT ERROR"
        );

        console.error(
            "========================================"
        );

        console.error(
            "ERROR NAME:",
            error.name
        );

        console.error(
            "ERROR MESSAGE:",
            error.message
        );

        console.error(
            "ERROR CODE:",
            error.code
        );

        console.error(
            "FULL ERROR:",
            error
        );

        console.error(
            "========================================"
        );


        // ==================================================
        // ROLLBACK IF PROJECT EXISTS
        // ==================================================

        if (
            createdProject?._id
        ) {

            try {

                await ProjectAssignment.deleteMany({
                    projectId:
                        createdProject._id
                });


                await Project.findByIdAndDelete(
                    createdProject._id
                );

            } catch (
                rollbackError
            ) {

                console.error(
                    "ROLLBACK ERROR:",
                    rollbackError
                );
            }
        }


        // ==================================================
        // DUPLICATE KEY
        // ==================================================

        if (
            error.code === 11000
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "Project code already exists",

                error:
                    error.keyValue || {}
            });
        }


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
                            item.message
                    })
                );


            return res.status(400).json({

                success: false,

                message:
                    "Project validation failed",

                errors:
                    validationErrors,

                error:
                    error.message
            });
        }


        // ==================================================
        // CAST ERROR
        // ==================================================

        if (
            error.name ===
            "CastError"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid project or employee data",

                error:
                    error.message
            });
        }


        // ==================================================
        // GENERAL ERROR
        // ==================================================

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to create project",

            error:
                error.message
        });
    }
};


// ======================================================
// GET ALL PROJECTS
// GET /api/admin/projects
// ======================================================

const getAllProjects = async (
    req,
    res
) => {

    try {

        const projects =
            await Project.find()
                .populate(
                    "createdBy",
                    "name email"
                )
                .sort({
                    createdAt: -1
                });


        const updatedProjects =
            projects.map(
                (project) => {

                    const projectObject =
                        project.toObject();


                    return {

                        ...projectObject,

                        status:
                            calculateProjectStatus(
                                projectObject.startDate,
                                projectObject.endDate
                            )
                    };
                }
            );


        return res.status(200).json({

            success: true,

            count:
                updatedProjects.length,

            projects:
                updatedProjects
        });


    } catch (error) {

        console.error(
            "GET ALL PROJECTS ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch projects",

            error:
                error.message
        });
    }
};


// ======================================================
// GET PROJECT DETAILS
// GET /api/admin/projects/:projectId
// ======================================================

const getProjectDetails = async (
    req,
    res
) => {

    try {

        const {
            projectId
        } = req.params;


        const cleanProjectId =
            String(
                projectId || ""
            )
                .trim()
                .toUpperCase();


        if (!cleanProjectId) {

            return res.status(400).json({

                success: false,

                message:
                    "Project ID is required"
            });
        }


        const project =
            await Project.findOne({

                projectId:
                    cleanProjectId

            }).populate(
                "createdBy",
                "name email"
            );


        if (!project) {

            return res.status(404).json({

                success: false,

                message:
                    "Project not found"
            });
        }


        const assignments =
            await ProjectAssignment.find({

                projectId:
                    project._id,

                status: {
                    $ne:
                        "removed"
                }

            })
                .populate(
                    "employeeId"
                )
                .populate(
                    "assignedBy",
                    "name email"
                );


        const projectObject =
            project.toObject();


        projectObject.status =
            calculateProjectStatus(
                projectObject.startDate,
                projectObject.endDate
            );


        return res.status(200).json({

            success: true,

            project:
                projectObject,

            assignments
        });


    } catch (error) {

        console.error(
            "GET PROJECT DETAILS ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch project details",

            error:
                error.message
        });
    }
};


// ======================================================
// DELETE PROJECT
// DELETE /api/admin/projects/:projectId
// ======================================================

const deleteProject = async (
    req,
    res
) => {

    try {

        const {
            projectId
        } = req.params;


        const cleanProjectId =
            String(
                projectId || ""
            )
                .trim()
                .toUpperCase();


        if (!cleanProjectId) {

            return res.status(400).json({

                success: false,

                message:
                    "Project ID is required"
            });
        }


        const project =
            await Project.findOne({

                projectId:
                    cleanProjectId

            });


        if (!project) {

            return res.status(404).json({

                success: false,

                message:
                    "Project not found"
            });
        }


        // ==================================================
        // DELETE ASSIGNMENTS
        // ==================================================

        await ProjectAssignment.deleteMany({

            projectId:
                project._id

        });


        // ==================================================
        // DELETE PROJECT
        // ==================================================

        await Project.findByIdAndDelete(
            project._id
        );


        return res.status(200).json({

            success: true,

            message:
                "Project deleted successfully"
        });


    } catch (error) {

        console.error(
            "DELETE PROJECT ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to delete project",

            error:
                error.message
        });
    }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {

    createProject,

    getAllProjects,

    getProjectDetails,

    deleteProject

};