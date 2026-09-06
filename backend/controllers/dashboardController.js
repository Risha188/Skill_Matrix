const User = require("../model/User");
const Project = require("../model/Project");
const ProjectAssignment = require("../model/ProjectAssignment");
const Employee = require("../model/Employee");
// ======================================================
// ADMIN DASHBOARD
// GET /api/admin/dashboard
// ======================================================

// ======================================================
// ADMIN DASHBOARD
// GET /api/admin/dashboard
// ======================================================

const getAdminDashboard = async (req, res) => {
    try {

        // ==================================================
        // EMPLOYEE STATISTICS
        // ==================================================

        const totalEmployees =
            await User.countDocuments({
                role: "employee"
            });

        const activeEmployees =
            await User.countDocuments({
                role: "employee",
                isActive: true
            });

        const inactiveEmployeesCount =
            await User.countDocuments({
                role: "employee",
                isActive: false
            });


        // ==================================================
        // PROJECT STATISTICS
        // ==================================================

        const totalProjects =
            await Project.countDocuments();

        const activeProjects =
            await Project.countDocuments({
                status: "active"
            });

        const completedProjects =
            await Project.countDocuments({
                status: "completed"
            });

        const pendingProjects =
            await Project.countDocuments({
                status: "pending"
            });

        const cancelledProjects =
            await Project.countDocuments({
                status: "cancelled"
            });


        // ==================================================
        // ADMINISTRATORS
        // ==================================================

        const administrators =
            await User.find({
                role: "admin"
            })
                .select(
                    "fullName email isActive isEmailVerified createdAt"
                )
                .sort({
                    createdAt: 1
                })
                .lean();


        // ==================================================
        // INACTIVE EMPLOYEES
        // ==================================================

        const inactiveUsers =
            await User.find({
                role: "employee",
                isActive: false
            })
                .select(
                    "fullName email isActive"
                )
                .sort({
                    updatedAt: -1
                })
                .lean();


        // ==================================================
        // GET EMPLOYEE PROFILES
        // ==================================================

        const inactiveEmails =
            inactiveUsers.map(
                user => user.email
            );

        const inactiveEmployeeProfiles =
            await Employee.find({
                email: {
                    $in: inactiveEmails
                }
            })
                .select(
                    "employeeId email personalDetails skills profileCompleted"
                )
                .lean();


        // ==================================================
        // CREATE INACTIVE EMPLOYEE RESPONSE
        // ==================================================

        const inactiveEmployeeMap =
            new Map(
                inactiveEmployeeProfiles.map(
                    employee => [
                        employee.email,
                        employee
                    ]
                )
            );


        const inactiveEmployees =
            inactiveUsers.map(user => {

                const profile =
                    inactiveEmployeeMap.get(
                        user.email
                    );

                const firstName =
                    profile?.personalDetails
                        ?.firstName || "";

                const lastName =
                    profile?.personalDetails
                        ?.lastName || "";

                const profileName =
                    `${firstName} ${lastName}`.trim();

                return {

                    employeeId:
                        profile?.employeeId || null,

                    name:
                        profileName ||
                        user.fullName,

                    email:
                        user.email,

                    isActive:
                        false,

                    profileCompleted:
                        profile?.profileCompleted ||
                        false
                };
            });


        // ==================================================
        // PROJECT OVERVIEW
        // ==================================================

        const projectOverview = {

            active:
                activeProjects,

            completed:
                completedProjects,

            pending:
                pendingProjects,

            cancelled:
                cancelledProjects
        };


        // ==================================================
        // RESPONSE
        // ==================================================

        return res.status(200).json({

            success: true,

            statistics: {

                employees: {
                    total:
                        totalEmployees,

                    active:
                        activeEmployees,

                    inactive:
                        inactiveEmployeesCount
                },

                projects: {
                    total:
                        totalProjects,

                    active:
                        activeProjects,

                    completed:
                        completedProjects,

                    pending:
                        pendingProjects,

                    cancelled:
                        cancelledProjects
                }
            },

            projectOverview,

            administrators,

            inactiveEmployees
        });


    } catch (error) {

        console.error(
            "❌ Admin Dashboard Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch admin dashboard",

            error:
                error.message
        });
    }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
    getAdminDashboard
};
 