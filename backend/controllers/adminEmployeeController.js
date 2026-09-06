const mongoose = require("mongoose");

const Employee = require("../model/Employee");
const User = require("../model/User");
const ProjectAssignment = require("../model/projectAssignment");


// ======================================================
// HELPER: GET SKILL NAME
// ======================================================

const getSkillName = (skill) => {

    if (!skill) {
        return "";
    }

    // Normal string
    if (typeof skill === "string") {
        return skill.trim();
    }

    // Skill object
    if (typeof skill === "object") {

        return String(
            skill.skill ||
            skill.name ||
            ""
        ).trim();

    }

    return "";
};


// ======================================================
// HELPER: GET PRIMARY SKILLS
//
// Primary Skills come from:
//
// employee.skills
//
// Example:
// Java
// React.js
// Node.js
// MongoDB
// ======================================================

const getPrimarySkills = (employee) => {

    if (
        !employee ||
        !Array.isArray(employee.skills)
    ) {
        return [];
    }

    return employee.skills
        .map(getSkillName)
        .filter(Boolean);

};


// ======================================================
// HELPER: GET SECONDARY SKILLS
//
// Secondary Skills come ONLY from:
//
// employee.bdmDetails.nonTechnicalSkills
//
// Example:
// Communication
// Teamwork
// Leadership
// Problem Solving
// ======================================================

const getSecondarySkills = (employee) => {

    const skills =
        employee?.bdmDetails?.nonTechnicalSkills;

    if (!Array.isArray(skills)) {
        return [];
    }

    return skills
        .map(getSkillName)
        .filter(Boolean);

};


// ======================================================
// HELPER: GET EMPLOYEE NAME
// ======================================================

const getEmployeeName = (
    employee,
    user
) => {

    const firstName =
        employee?.personalDetails?.firstName ||
        "";

    const lastName =
        employee?.personalDetails?.lastName ||
        "";

    const employeeName =
        `${firstName} ${lastName}`.trim();

    if (employeeName) {
        return employeeName;
    }

    if (user?.fullName) {
        return user.fullName;
    }

    return "Unnamed Employee";
};


// ======================================================
// GET ALL EMPLOYEES
// ======================================================

const getEmployees = async (req, res) => {

    try {

        const {
            search,
            status
        } = req.query;


        // ==================================================
        // EMPLOYEE FILTER
        // ==================================================

        const employeeFilter = {};


        if (
            search &&
            search.trim()
        ) {

            const searchValue =
                search.trim();

            employeeFilter.$or = [

                {
                    employeeId: {
                        $regex:
                            searchValue,
                        $options: "i"
                    }
                },

                {
                    email: {
                        $regex:
                            searchValue,
                        $options: "i"
                    }
                },

                {
                    "personalDetails.firstName": {
                        $regex:
                            searchValue,
                        $options: "i"
                    }
                },

                {
                    "personalDetails.lastName": {
                        $regex:
                            searchValue,
                        $options: "i"
                    }
                }

            ];

        }


        // ==================================================
        // GET EMPLOYEES
        // ==================================================

        const employees =
            await Employee.find(
                employeeFilter
            )
                .sort({
                    createdAt: -1
                })
                .lean();


        // ==================================================
        // GET USERS
        // ==================================================

        const emails =
            employees
                .map(
                    employee =>
                        employee.email
                            ?.toLowerCase()
                            .trim()
                )
                .filter(Boolean);


        const users =
            await User.find({

                email: {
                    $in: emails
                },

                role: "employee"

            })
                .select(
                    "email fullName isActive isEmailVerified createdAt"
                )
                .lean();


        // ==================================================
        // USER MAP
        // ==================================================

        const userMap =
            new Map();


        users.forEach(user => {

            if (user.email) {

                userMap.set(
                    user.email
                        .toLowerCase()
                        .trim(),
                    user
                );

            }

        });


        // ==================================================
        // BUILD RESPONSE
        // ==================================================

        let result =
            employees.map(employee => {

                const employeeEmail =
                    employee.email
                        ?.toLowerCase()
                        .trim() || "";


                const user =
                    userMap.get(
                        employeeEmail
                    );


                // ------------------------------------------
                // NAME
                // ------------------------------------------

                const name =
                    getEmployeeName(
                        employee,
                        user
                    );


                // ------------------------------------------
                // PRIMARY SKILLS
                // ------------------------------------------

                const primarySkills =
                    getPrimarySkills(
                        employee
                    );


                // ------------------------------------------
                // SECONDARY SKILLS
                // ------------------------------------------

                const secondarySkills =
                    getSecondarySkills(
                        employee
                    );


                // ------------------------------------------
                // STATUS
                // ------------------------------------------

                const isActive =
                    user?.isActive !== false;


                return {

                    _id:
                        employee._id,

                    employeeId:
                        employee.employeeId,

                    name,

                    email:
                        employee.email || "",

                    primarySkills,

                    secondarySkills,

                    status:
                        isActive
                            ? "active"
                            : "inactive",

                    isActive,

                    isEmailVerified:
                        user?.isEmailVerified === true,

                    profileCompleted:
                        employee.profileCompleted === true

                };

            });


        // ==================================================
        // STATUS FILTER
        // ==================================================

        if (
            status &&
            status.toLowerCase() === "active"
        ) {

            result =
                result.filter(
                    employee =>
                        employee.isActive === true
                );

        }


        if (
            status &&
            status.toLowerCase() === "inactive"
        ) {

            result =
                result.filter(
                    employee =>
                        employee.isActive === false
                );

        }


        // ==================================================
        // STATISTICS
        // ==================================================

        const totalEmployees =
            result.length;


        const activeEmployees =
            result.filter(
                employee =>
                    employee.isActive === true
            ).length;


        const inactiveEmployees =
            result.filter(
                employee =>
                    employee.isActive === false
            ).length;


        // ==================================================
        // RESPONSE
        // ==================================================

        return res.status(200).json({

            success: true,

            statistics: {

                totalEmployees,

                activeEmployees,

                inactiveEmployees

            },

            count:
                result.length,

            employees:
                result

        });

    } catch (error) {

        console.error(
            "❌ Get Admin Employees Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch employees",

            error:
                error.message

        });

    }

};


// ======================================================
// GET SINGLE EMPLOYEE DETAILS
// ======================================================

const getEmployeeDetails = async (
    req,
    res
) => {

    try {

        const {
            id
        } = req.params;


        let employee = null;


        // ==================================================
        // FIND BY MONGODB ID
        // ==================================================

        if (
            mongoose.Types.ObjectId.isValid(id)
        ) {

            employee =
                await Employee.findById(
                    id
                ).lean();

        }


        // ==================================================
        // FIND BY EMPLOYEE ID
        //
        // EMP001
        // EMP002
        // ==================================================

        if (!employee) {

            employee =
                await Employee.findOne({

                    employeeId:
                        id
                            .trim()
                            .toUpperCase()

                }).lean();

        }


        // ==================================================
        // NOT FOUND
        // ==================================================

        if (!employee) {

            return res.status(404).json({

                success: false,

                message:
                    "Employee not found"

            });

        }


        // ==================================================
        // USER
        // ==================================================

        const user =
            await User.findOne({

                email:
                    employee.email,

                role:
                    "employee"

            })
                .select(
                    "fullName email isActive isEmailVerified createdAt"
                )
                .lean();


        // ==================================================
        // PROJECT ASSIGNMENTS
        // ==================================================

        const assignments =
            await ProjectAssignment.find({

                employeeId:
                    employee._id,

                status: {
                    $ne: "removed"
                }

            })
                .populate(
                    "projectId",
                    "projectId name startDate endDate status client projectType priority"
                )
                .lean();


        // ==================================================
        // SKILLS
        // ==================================================

        const primarySkills =
            getPrimarySkills(
                employee
            );


        const secondarySkills =
            getSecondarySkills(
                employee
            );


        // ==================================================
        // NAME
        // ==================================================

        const name =
            getEmployeeName(
                employee,
                user
            );


        // ==================================================
        // RESPONSE
        // ==================================================

        return res.status(200).json({

            success: true,

            employee: {

                ...employee,

                name,

                isActive:
                    user?.isActive !== false,

                accountStatus:
                    user?.isActive === false
                        ? "inactive"
                        : "active",

                isEmailVerified:
                    user?.isEmailVerified === true,

                primarySkills,

                secondarySkills

            },

            projects:
                assignments,

            projectCount:
                assignments.length

        });

    } catch (error) {

        console.error(
            "❌ Get Employee Details Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch employee details",

            error:
                error.message

        });

    }

};


// ======================================================
// UPDATE EMPLOYEE STATUS
// ======================================================

const updateEmployeeStatus = async (
    req,
    res
) => {

    try {

        const {
            id
        } = req.params;


        const {
            isActive
        } = req.body;


        console.log(
            "================================="
        );

        console.log(
            "UPDATE EMPLOYEE STATUS"
        );

        console.log(
            "Received ID:",
            id
        );

        console.log(
            "Received isActive:",
            isActive
        );

        console.log(
            "================================="
        );


        // ==================================================
        // VALIDATION
        // ==================================================

        if (
            typeof isActive !== "boolean"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "isActive must be true or false"

            });

        }


        // ==================================================
        // FIND EMPLOYEE
        // ==================================================

        let employee =
            await Employee.findOne({

                employeeId:
                    id
                        .trim()
                        .toUpperCase()

            });


        // ==================================================
        // FALLBACK MONGODB ID
        // ==================================================

        if (
            !employee &&
            mongoose.Types.ObjectId.isValid(id)
        ) {

            employee =
                await Employee.findById(
                    id
                );

        }


        // ==================================================
        // EMPLOYEE NOT FOUND
        // ==================================================

        if (!employee) {

            console.log(
                "Employee NOT FOUND:",
                id
            );

            return res.status(404).json({

                success: false,

                message:
                    "Employee not found",

                requestedId:
                    id

            });

        }


        // ==================================================
        // FIND USER
        // ==================================================

        const user =
            await User.findOne({

                email:
                    employee.email
                        .toLowerCase()
                        .trim(),

                role:
                    "employee"

            });


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "Employee user account not found",

                employeeId:
                    employee.employeeId,

                email:
                    employee.email

            });

        }


        // ==================================================
        // UPDATE STATUS
        // ==================================================

        user.isActive =
            isActive;


        await user.save();


        console.log(
            "Employee status updated:",
            employee.employeeId,
            "=>",
            user.isActive
        );


        // ==================================================
        // RESPONSE
        // ==================================================

        return res.status(200).json({

            success: true,

            message:
                isActive
                    ? "Employee activated successfully"
                    : "Employee deactivated successfully",

            employee: {

                employeeId:
                    employee.employeeId,

                name:
                    getEmployeeName(
                        employee,
                        user
                    ),

                email:
                    employee.email,

                isActive:
                    user.isActive,

                status:
                    user.isActive
                        ? "active"
                        : "inactive"

            }

        });

    } catch (error) {

        console.error(
            "❌ Update Employee Status Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to update employee status",

            error:
                error.message

        });

    }

};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {

    getEmployees,

    getEmployeeDetails,

    updateEmployeeStatus

};