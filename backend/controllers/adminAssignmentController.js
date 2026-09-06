const mongoose = require("mongoose");

const Project = require("../model/Project");
const ProjectAssignment = require("../model/ProjectAssignment");
const Employee = require("../model/Employee");
const User = require("../model/User");


// ======================================================
// GET ASSIGNED PROJECTS
// GET /api/admin/assigned-projects
// ======================================================

// ======================================================
// GET ASSIGNED PROJECTS
// GET /api/admin/assigned-projects
// ======================================================

const getAssignedProjects = async (req, res) => {
    try {
        const { search, status } = req.query;

        // ==============================================
        // PROJECT FILTER
        // ==============================================

        const projectFilter = {};

        if (status) {
            projectFilter.status = status;
        }

        if (search && search.trim()) {
            projectFilter.$or = [
                {
                    name: {
                        $regex: search.trim(),
                        $options: "i"
                    }
                },
                {
                    projectId: {
                        $regex: search.trim(),
                        $options: "i"
                    }
                }
            ];
        }

        // ==============================================
        // GET PROJECTS
        // ==============================================

        const projects = await Project.find(projectFilter)
            .sort({
                createdAt: -1
            })
            .lean();

        if (!projects.length) {
            return res.status(200).json({
                success: true,
                statistics: {
                    totalProjects: 0,
                    activeProjects: 0,
                    pendingProjects: 0,
                    completedProjects: 0,
                    cancelledProjects: 0
                },
                count: 0,
                projects: []
            });
        }

        // ==============================================
        // GET ASSIGNMENTS
        // ==============================================

        const projectIds = projects.map(
            (project) => project._id
        );

        const assignments =
            await ProjectAssignment.find({
                projectId: {
                    $in: projectIds
                },
                status: {
                    $ne: "removed"
                }
            })
                .populate(
                    "employeeId",
                    "employeeId email personalDetails skills"
                )
                .lean();

        // ==============================================
        // GROUP ASSIGNMENTS BY PROJECT
        // ==============================================

        const assignmentMap = new Map();

        assignments.forEach((assignment) => {
            const projectId =
                String(assignment.projectId);

            if (!assignmentMap.has(projectId)) {
                assignmentMap.set(
                    projectId,
                    []
                );
            }

            assignmentMap
                .get(projectId)
                .push(assignment);
        });

        // ==============================================
        // BUILD RESPONSE
        // ==============================================

        const result = projects.map((project) => {
            const projectAssignments =
                assignmentMap.get(
                    String(project._id)
                ) || [];

            // ==========================================
            // USE ASSIGNMENTS FIRST
            // FALL BACK TO employeeIds
            // ==========================================

            let employees = projectAssignments
                .filter(
                    (assignment) =>
                        assignment.employeeId
                )
                .map((assignment) => {
                    const employee =
                        assignment.employeeId;

                    const firstName =
                        employee?.personalDetails
                            ?.firstName || "";

                    const lastName =
                        employee?.personalDetails
                            ?.lastName || "";

                    return {
                        assignmentId:
                            assignment._id,

                        employeeId:
                            employee?.employeeId,

                        name:
                            `${firstName} ${lastName}`
                                .trim(),

                        email:
                            employee?.email,

                        role:
                            assignment.role || "",

                        allocation:
                            assignment.allocation ?? 100,

                        status:
                            assignment.status,

                        assignedDate:
                            assignment.assignedDate
                    };
                });

            // ==========================================
            // FALLBACK
            // PROJECT employeeIds EXIST BUT
            // ASSIGNMENT RECORDS ARE MISSING
            // ==========================================

            if (
                employees.length === 0 &&
                Array.isArray(project.employeeIds) &&
                project.employeeIds.length > 0
            ) {
                employees = project.employeeIds.map(
                    (employeeId) => ({
                        assignmentId: null,

                        employeeId:
                            String(employeeId),

                        name: "",

                        email: "",

                        role: "",

                        allocation: 100,

                        status: "active",

                        assignedDate:
                            project.createdAt
                    })
                );
            }

            return {
    _id: project._id,

    projectId: project.projectId,

    name: project.name,

    description: project.description || "",

    client: project.client || "",

    projectType: project.projectType || "",

    priority: project.priority || "",

    startDate: project.startDate,

    endDate: project.endDate,

    status: project.status,

    // ==========================================
    // PROJECT OBJECTIVES
    // ==========================================
    objectives: Array.isArray(project.objectives)
        ? project.objectives
        : [],

    // ==========================================
    // TECHNOLOGY STACK
    // ==========================================
    technologyStack: Array.isArray(project.technologyStack)
        ? project.technologyStack
        : [],

    // ==========================================
    // EMPLOYEES
    // ==========================================
    employeeIds: Array.isArray(project.employeeIds)
        ? project.employeeIds
        : [],

    teamSize: employees.length,

    teamMemberCount: employees.length,

    employees
};
        });

        // ==============================================
        // STATISTICS
        // ==============================================

        const statistics = {
            totalProjects:
                result.length,

            activeProjects:
                result.filter(
                    (project) =>
                        project.status === "active"
                ).length,

            pendingProjects:
                result.filter(
                    (project) =>
                        project.status === "pending"
                ).length,

            completedProjects:
                result.filter(
                    (project) =>
                        project.status === "completed"
                ).length,

            cancelledProjects:
                result.filter(
                    (project) =>
                        project.status === "cancelled"
                ).length
        };

        // ==============================================
        // RESPONSE
        // ==============================================

        return res.status(200).json({
            success: true,

            statistics,

            count:
                result.length,

            projects:
                result
        });

    } catch (error) {
        console.error(
            "❌ Get Assigned Projects Error:",
            error
        );

        return res.status(500).json({
            success: false,

            message:
                "Failed to fetch assigned projects",

            error:
                error.message
        });
    }
};


// ======================================================
// GET PROJECT TEAM
// GET /api/admin/assigned-projects/:id/team
// ======================================================

const getProjectTeam = async (req, res) => {
    try {

        const { id } = req.params;

        let project = null;

        // ------------------------------------------
        // Allow MongoDB _id OR projectId
        // ------------------------------------------

        if (
            mongoose.Types.ObjectId.isValid(id)
        ) {

            project =
                await Project.findById(id)
                    .lean();
        }

        if (!project) {

            project =
                await Project.findOne({
                    projectId:
                        id.toUpperCase()
                })
                    .lean();
        }

        if (!project) {

            return res.status(404).json({

                success: false,

                message:
                    "Project not found"
            });
        }


        // ------------------------------------------
        // Get assignments
        // ------------------------------------------

        const assignments =
            await ProjectAssignment.find({
                projectId:
                    project._id,

                status: {
                    $ne: "removed"
                }
            })
                .populate(
                    "employeeId",
                    "employeeId email personalDetails skills"
                )
                .lean();


        const team =
            assignments.map(
                assignment => {

                    const employee =
                        assignment.employeeId;

                    const firstName =
                        employee
                            ?.personalDetails
                            ?.firstName || "";

                    const lastName =
                        employee
                            ?.personalDetails
                            ?.lastName || "";

                    return {

                        assignmentId:
                            assignment._id,

                        employeeId:
                            employee?.employeeId,

                        name:
                            `${firstName} ${lastName}`
                                .trim(),

                        email:
                            employee?.email,

                        role:
                            assignment.role,

                        allocation:
                            assignment.allocation,

                        status:
                            assignment.status,

                        assignedDate:
                            assignment.assignedDate
                    };
                }
            );


        return res.status(200).json({

            success: true,

            project: {

                _id:
                    project._id,

                projectId:
                    project.projectId,

                name:
                    project.name,

                status:
                    project.status
            },

            count:
                team.length,

            team
        });


    } catch (error) {

        console.error(
            "❌ Get Project Team Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch project team",

            error:
                error.message
        });
    }
};
//ressign
// ======================================================
// REASSIGN PROJECT TEAM
// PUT /api/admin/assigned-projects/:id/team
// ======================================================

// ======================================================
// REASSIGN PROJECT TEAM
// ======================================================

// ======================================================
// REASSIGN PROJECT TEAM
// PUT /api/admin/assigned-projects/:id/team
// ======================================================

const reassignProjectTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const { employeeIds } = req.body;

        // ==============================================
        // VALIDATE EMPLOYEE IDS
        // ==============================================

        if (!Array.isArray(employeeIds)) {
            return res.status(400).json({
                success: false,
                message: "employeeIds must be an array"
            });
        }

        const uniqueEmployeeIds = [
            ...new Set(
                employeeIds
                    .map((employeeId) =>
                        String(employeeId)
                            .trim()
                            .toUpperCase()
                    )
                    .filter(Boolean)
            )
        ];

        if (uniqueEmployeeIds.length < 2) {
            return res.status(400).json({
                success: false,
                message:
                    "A minimum of 2 employees is required"
            });
        }

        // ==============================================
        // FIND PROJECT
        // ==============================================

        let project = null;

        // MongoDB _id
        if (mongoose.Types.ObjectId.isValid(id)) {
            project = await Project.findById(id);
        }

        // Project ID such as PRJ001
        if (!project) {
            project = await Project.findOne({
                projectId: id.toUpperCase()
            });
        }

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        // ==============================================
        // FIND EMPLOYEES
        // ==============================================

        const employees = await Employee.find({
            employeeId: {
                $in: uniqueEmployeeIds
            }
        });

        const foundEmployeeIds = employees.map(
            (employee) =>
                String(employee.employeeId).toUpperCase()
        );

        const missingEmployeeIds =
            uniqueEmployeeIds.filter(
                (employeeId) =>
                    !foundEmployeeIds.includes(
                        employeeId
                    )
            );

        if (missingEmployeeIds.length > 0) {
            return res.status(404).json({
                success: false,
                message: "Some employees were not found",
                missingEmployeeIds
            });
        }

        // ==============================================
        // ADMIN
        // ==============================================

        const adminId =
            req.user?.id ||
            req.user?._id ||
            req.user?.userId;

        if (!adminId) {
            return res.status(401).json({
                success: false,
                message: "Admin identity not found"
            });
        }

        // ==============================================
        // GET EXISTING ASSIGNMENTS
        // ==============================================

        const existingAssignments =
            await ProjectAssignment.find({
                projectId: project._id
            });

        // ==============================================
        // ACTIVATE / CREATE ASSIGNMENTS
        // ==============================================

        for (const employee of employees) {
            const existingAssignment =
                existingAssignments.find(
                    (assignment) =>
                        String(
                            assignment.employeeId
                        ) ===
                        String(employee._id)
                );

            if (existingAssignment) {
                // Reactivate existing assignment

                existingAssignment.status = "active";

                existingAssignment.assignedBy =
                    adminId;

                existingAssignment.allocation = 100;

                existingAssignment.assignedDate =
                    new Date();

                await existingAssignment.save();
            } else {
                // Create new assignment

                await ProjectAssignment.create({
                    projectId: project._id,

                    employeeId: employee._id,

                    assignedBy: adminId,

                    role: "",

                    allocation: 100,

                    status: "active",

                    assignedDate: new Date()
                });
            }
        }

        // ==============================================
        // REMOVE OLD TEAM MEMBERS
        // ==============================================

        await ProjectAssignment.updateMany(
            {
                projectId: project._id,

                employeeId: {
                    $nin: employees.map(
                        (employee) =>
                            employee._id
                    )
                }
            },
            {
                $set: {
                    status: "removed"
                }
            }
        );

        // ==============================================
        // IMPORTANT
        // UPDATE PROJECT EMPLOYEE IDS
        // ==============================================

        project.employeeIds =
            uniqueEmployeeIds;

        await project.save();

        // ==============================================
        // GET FINAL ACTIVE TEAM
        // ==============================================

        const finalTeam =
            await ProjectAssignment
                .find({
                    projectId: project._id,

                    status: "active"
                })
                .populate(
                    "employeeId",
                    "employeeId email personalDetails skills"
                )
                .populate(
                    "assignedBy",
                    "fullName email"
                )
                .sort({
                    assignedDate: 1
                });

        // ==============================================
        // RESPONSE
        // ==============================================

        return res.status(200).json({
            success: true,

            message:
                "Project team reassigned successfully",

            project: {
                _id: project._id,

                projectId:
                    project.projectId,

                name:
                    project.name,

                employeeIds:
                    project.employeeIds
            },

            team: finalTeam,

            teamMemberCount:
                finalTeam.length
        });

    } catch (error) {
        console.error(
            "❌ Reassign Project Team Error:",
            error
        );

        return res.status(500).json({
            success: false,

            message:
                "Failed to reassign project team",

            error:
                error.message
        });
    }
};
// ======================================================
// EXPORT
// ======================================================

module.exports = {
    getAssignedProjects,
    getProjectTeam,
    reassignProjectTeam
};