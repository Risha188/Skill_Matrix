const Employee = require("../model/Employee");
const User = require("../model/User");

// ==========================================================
// GET AUTHENTICATED USER ID
// ==========================================================

const getUserId = (req) => {
    return (
        req.user?._id ||
        req.user?.id ||
        req.user?.userId ||
        null
    );
};

// ==========================================================
// GET LOGIN EMAIL FROM USER
// ==========================================================

const getLoginEmail = async (userId) => {
    if (!userId) {
        return "";
    }

    const user = await User.findById(userId)
        .select("email")
        .lean();

    if (!user?.email) {
        return "";
    }

    return String(user.email)
        .trim()
        .toLowerCase();
};

// ==========================================================
// UPDATE PROFILE COMPLETION
// ==========================================================

const updateProfileCompletion = (employee) => {

    // ------------------------------------------------------
    // 1. PERSONAL INFORMATION
    // ------------------------------------------------------

    const hasPersonalDetails =
        Boolean(
            employee.personalDetails?.firstName?.trim?.() &&
            employee.personalDetails?.lastName?.trim?.() &&
            employee.personalDetails?.email?.trim?.() &&
            employee.personalDetails?.phone?.trim?.() &&
            employee.personalDetails?.gender
        );

    // ------------------------------------------------------
    // 2. EDUCATION
    // ------------------------------------------------------

    const hasEducation =
        Array.isArray(employee.education) &&
        employee.education.length > 0 &&
        Boolean(
            employee.education.some(
                (education) =>
                    education &&
                    (
                        education.highestQualification ||
                        education.course ||
                        education.university ||
                        education.college
                    )
            )
        );

    // ------------------------------------------------------
    // 3. ADDRESS
    // ------------------------------------------------------

    const currentAddress =
        employee.address?.current || {};

    const hasAddress =
        Boolean(
            currentAddress.address &&
            currentAddress.city &&
            currentAddress.state &&
            currentAddress.pincode &&
            currentAddress.country
        );

    // ------------------------------------------------------
    // 4. SKILLS
    // ------------------------------------------------------

    const hasSkills =
        Array.isArray(employee.skills) &&
        employee.skills.length > 0;

    // ------------------------------------------------------
    // 5. WORK EXPERIENCE
    // ------------------------------------------------------
    // Fresher = completed.
    // Experienced employee needs at least one record.

    const hasWorkExperience =
        employee.isFresher === true ||
        (
            Array.isArray(employee.workExperience) &&
            employee.workExperience.length > 0
        );

    // ------------------------------------------------------
    // 6. BDM DETAILS
    // ------------------------------------------------------

    const bdm =
        employee.bdmDetails || {};

    const hasBDMDetails =
        (
            Array.isArray(bdm.nonTechnicalSkills) &&
            bdm.nonTechnicalSkills.length > 0
        ) ||
        (
            Array.isArray(bdm.languagesKnown) &&
            bdm.languagesKnown.length > 0
        ) ||
        (
            Array.isArray(bdm.hobbies) &&
            bdm.hobbies.length > 0
        ) ||
        (
            Array.isArray(bdm.areasOfInterest) &&
            bdm.areasOfInterest.length > 0
        ) ||
        Boolean(
            String(
                bdm.keyStrengths || ""
            ).trim()
        ) ||
        Boolean(
            String(
                bdm.additionalInformation || ""
            ).trim()
        );

    // ------------------------------------------------------
    // FINAL PROFILE STATUS
    // ------------------------------------------------------

    employee.profileCompleted =
        hasPersonalDetails &&
        hasEducation &&
        hasAddress &&
        hasSkills &&
        hasWorkExperience &&
        hasBDMDetails;

    return employee;
};

// ==========================================================
// CREATE EMPLOYEE PROFILE
// POST /api/employees
// ==========================================================

const createEmployee = async (req, res) => {
    try {

        const userId = getUserId(req);

        const {
            firstName,
            lastName,
            email,
            phone,
            alternatePhone,
            dateOfBirth,
            gender
        } = req.body;

        // --------------------------------------------------
        // USER ID REQUIRED
        // --------------------------------------------------

        if (!userId) {
            return res.status(401).json({
                success: false,
                message:
                    "Authenticated user ID is required"
            });
        }

        // --------------------------------------------------
        // GET ACTUAL LOGIN USER
        // --------------------------------------------------

        const user = await User.findById(userId)
            .select("email")
            .lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message:
                    "User account not found"
            });
        }

        if (!user.email) {
            return res.status(400).json({
                success: false,
                message:
                    "User login email not found"
            });
        }

        // --------------------------------------------------
        // LOGIN EMAIL
        // --------------------------------------------------

        const loginEmail =
            String(user.email)
                .trim()
                .toLowerCase();

        // --------------------------------------------------
        // PERSONAL / CONTACT EMAIL
        // This is NOT the login email.
        // --------------------------------------------------

        const personalEmail =
            String(email || "")
                .trim()
                .toLowerCase();

        // --------------------------------------------------
        // FIND EMPLOYEE BY USER ID
        //
        // IMPORTANT:
        // ONE USER = ONE EMPLOYEE
        // --------------------------------------------------

        let employee =
            await Employee.findOne({
                userId
            });

        // --------------------------------------------------
        // EMPLOYEE ALREADY EXISTS
        //
        // UPDATE EXISTING EMPLOYEE.
        // DO NOT CREATE A NEW EMPLOYEE.
        // --------------------------------------------------

        if (employee) {

            employee.email =
                loginEmail;

            const existingPersonalDetails =
                employee.personalDetails?.toObject
                    ? employee.personalDetails.toObject()
                    : employee.personalDetails || {};

            employee.personalDetails = {

                ...existingPersonalDetails,

                firstName:
                    firstName ??
                    existingPersonalDetails.firstName ??
                    "",

                lastName:
                    lastName ??
                    existingPersonalDetails.lastName ??
                    "",

                // Contact/personal email only.
                email:
                    email !== undefined
                        ? personalEmail
                        : existingPersonalDetails.email || "",

                phone:
                    phone ??
                    existingPersonalDetails.phone ??
                    "",

                alternatePhone:
                    alternatePhone ??
                    existingPersonalDetails.alternatePhone ??
                    "",

                dateOfBirth:
                    dateOfBirth ??
                    existingPersonalDetails.dateOfBirth ??
                    null,

                gender:
                    gender ??
                    existingPersonalDetails.gender ??
                    ""
            };

            // Recalculate before saving.
            updateProfileCompletion(employee);

            await employee.save();

            return res.status(200).json({
                success: true,
                message:
                    "Employee profile updated successfully",
                employee
            });
        }

        // --------------------------------------------------
        // SAFETY CHECK
        // LOGIN EMAIL MUST NOT BE LINKED TO ANOTHER EMPLOYEE
        // --------------------------------------------------

        const employeeWithLoginEmail =
            await Employee.findOne({
                email: loginEmail
            });

        if (employeeWithLoginEmail) {
            return res.status(409).json({
                success: false,
                message:
                    "This login account is already linked to an employee profile.",
                employeeId:
                    employeeWithLoginEmail.employeeId
            });
        }

        // --------------------------------------------------
        // GENERATE EMPLOYEE ID
        // --------------------------------------------------

        const employeeCount =
            await Employee.countDocuments();

        const employeeId =
            `EMP${String(
                employeeCount + 1
            ).padStart(4, "0")}`;

        // --------------------------------------------------
        // CREATE EMPLOYEE
        // --------------------------------------------------

        employee = new Employee({

            userId,

            employeeId,

            // Login email.
            email: loginEmail,

            personalDetails: {

                firstName:
                    firstName || "",

                lastName:
                    lastName || "",

                // Personal/contact email.
                email:
                    personalEmail,

                phone:
                    phone || "",

                alternatePhone:
                    alternatePhone || "",

                dateOfBirth:
                    dateOfBirth || null,

                gender:
                    gender || ""
            },

            education: [],

            address: {
                current: {},
                permanent: {},
                sameAsCurrent: false
            },

            skills: [],

            workExperience: [],

            isFresher: false,

            bdmDetails: {
                nonTechnicalSkills: [],
                languagesKnown: [],
                hobbies: [],
                areasOfInterest: [],
                keyStrengths: "",
                additionalInformation: ""
            },

            profileCompleted: false,

            isActive: true,

            status: "active"
        });

        // Calculate initial status.
        updateProfileCompletion(employee);

        await employee.save();

        return res.status(201).json({
            success: true,
            message:
                "Employee profile created successfully",
            employee
        });

    } catch (error) {

        console.error(
            "Create Employee Error:",
            error
        );

        // Duplicate key.
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message:
                    "Employee profile already exists for this account.",
                error:
                    error.message
            });
        }

        return res.status(500).json({
            success: false,
            message:
                "Failed to create employee",
            error:
                error.message
        });
    }
};

// ==========================================================
// GET EMPLOYEE
// GET /api/employees/:employeeId
// ==========================================================

const getEmployee = async (req, res) => {
    try {

        const {
            employeeId
        } = req.params;

        if (!employeeId) {
            return res.status(400).json({
                success: false,
                message:
                    "Employee ID is required"
            });
        }

        // --------------------------------------------------
        // FIND EMPLOYEE
        // --------------------------------------------------

        const employee =
            await Employee.findOne({
                employeeId
            }).lean();

        if (!employee) {
            return res.status(404).json({
                success: false,
                message:
                    "Employee not found"
            });
        }

        // --------------------------------------------------
        // NORMALIZE EDUCATION
        // --------------------------------------------------

        employee.education =
            Array.isArray(employee.education)
                ? employee.education
                : [];

        // --------------------------------------------------
        // NORMALIZE SKILLS
        // --------------------------------------------------

        employee.skills =
            Array.isArray(employee.skills)
                ? employee.skills
                : [];

        // --------------------------------------------------
        // NORMALIZE WORK EXPERIENCE
        // --------------------------------------------------

        employee.workExperience =
            Array.isArray(employee.workExperience)
                ? employee.workExperience
                : [];

        // --------------------------------------------------
        // NORMALIZE ADDRESS
        // --------------------------------------------------

        employee.address =
            employee.address || {};

        employee.address.current =
            employee.address.current || {};

        employee.address.permanent =
            employee.address.permanent || {};

        // --------------------------------------------------
        // NORMALIZE BDM
        // --------------------------------------------------

        employee.bdmDetails =
            employee.bdmDetails || {};

        employee.bdmDetails.nonTechnicalSkills =
            Array.isArray(
                employee.bdmDetails.nonTechnicalSkills
            )
                ? employee.bdmDetails.nonTechnicalSkills
                : [];

        employee.bdmDetails.languagesKnown =
            Array.isArray(
                employee.bdmDetails.languagesKnown
            )
                ? employee.bdmDetails.languagesKnown
                : [];

        employee.bdmDetails.hobbies =
            Array.isArray(
                employee.bdmDetails.hobbies
            )
                ? employee.bdmDetails.hobbies
                : [];

        employee.bdmDetails.areasOfInterest =
            Array.isArray(
                employee.bdmDetails.areasOfInterest
            )
                ? employee.bdmDetails.areasOfInterest
                : [];

        // ==================================================
        // IMPORTANT FIX
        // ==================================================
        //
        // DO NOT TRUST OLD profileCompleted VALUE.
        //
        // Recalculate the profile completion from the
        // actual employee data every time the employee
        // is loaded.
        //
        // This fixes:
        //
        // Profile data exists
        // BUT
        // Admin shows "Incomplete"
        //
        // It also fixes:
        //
        // Data deleted
        // BUT
        // Admin still shows "Completed"
        //
        // ==================================================

        updateProfileCompletion(employee);

        // --------------------------------------------------
        // QUALIFICATION FOR FRONTEND
        // --------------------------------------------------

        const firstEducation =
            employee.education[0];

        employee.qualification =
            firstEducation
                ? {

                    degree:
                        firstEducation
                            .highestQualification || "",

                    course:
                        firstEducation
                            .course || "",

                    specialization:
                        firstEducation
                            .specialization || "",

                    university:
                        firstEducation
                            .university || "",

                    college:
                        firstEducation
                            .college || "",

                    passingYear:
                        firstEducation
                            .passingYear || "",

                    percentage:
                        firstEducation
                            .percentage || "",

                    cgpa:
                        firstEducation
                            .cgpa || ""
                }
                : {

                    degree: "",
                    course: "",
                    specialization: "",
                    university: "",
                    college: "",
                    passingYear: "",
                    percentage: "",
                    cgpa: ""
                };

        // --------------------------------------------------
        // RETURN EMPLOYEE
        // --------------------------------------------------

        return res.status(200).json({
            success: true,
            employee
        });

    } catch (error) {

        console.error(
            "Get Employee Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to get employee",
            error:
                error.message
        });
    }
};

// ==========================================================
// UPDATE PERSONAL DETAILS
// PUT /api/employees/:employeeId/personal
// ==========================================================

const updatePersonalDetails =
    async (req, res) => {

        try {

            const {
                employeeId
            } = req.params;

            const {
                firstName,
                lastName,
                email,
                phone,
                alternatePhone,
                dateOfBirth,
                gender
            } = req.body;

            const employee =
                await Employee.findOne({
                    employeeId
                });

            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Employee not found"
                });
            }

            // ------------------------------------------------
            // KEEP LOGIN EMAIL FROM AUTH USER
            // ------------------------------------------------

            const userId =
                getUserId(req);

            if (userId) {

                const loginEmail =
                    await getLoginEmail(
                        userId
                    );

                if (loginEmail) {
                    employee.email =
                        loginEmail;
                }
            }

            // ------------------------------------------------
            // EXISTING PERSONAL DETAILS
            // ------------------------------------------------

            const existingPersonalDetails =
                employee.personalDetails?.toObject
                    ? employee.personalDetails.toObject()
                    : employee.personalDetails || {};

            // ------------------------------------------------
            // PERSONAL EMAIL
            // ------------------------------------------------

            const personalEmail =
                email !== undefined
                    ? String(email)
                        .trim()
                        .toLowerCase()
                    : (
                        existingPersonalDetails.email ||
                        ""
                    );

            // ------------------------------------------------
            // UPDATE PERSONAL DETAILS
            // ------------------------------------------------

            employee.personalDetails = {

                ...existingPersonalDetails,

                firstName:
                    firstName ??
                    existingPersonalDetails.firstName ??
                    "",

                lastName:
                    lastName ??
                    existingPersonalDetails.lastName ??
                    "",

                email:
                    personalEmail,

                phone:
                    phone ??
                    existingPersonalDetails.phone ??
                    "",

                alternatePhone:
                    alternatePhone ??
                    existingPersonalDetails.alternatePhone ??
                    "",

                dateOfBirth:
                    dateOfBirth ??
                    existingPersonalDetails.dateOfBirth ??
                    null,

                gender:
                    gender ??
                    existingPersonalDetails.gender ??
                    ""
            };

            // Recalculate.
            updateProfileCompletion(
                employee
            );

            await employee.save();

            return res.status(200).json({
                success: true,
                message:
                    "Personal details updated successfully",
                employee
            });

        } catch (error) {

            console.error(
                "Personal Details Update Error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to update personal details",
                error:
                    error.message
            });
        }
    };

// ==========================================================
// UPDATE EDUCATION
// PUT /api/employees/:employeeId/education
// ==========================================================

const updateEducation =
    async (req, res) => {

        try {

            const {
                employeeId
            } = req.params;

            const {
                highestQualification,
                course,
                specialization,
                university,
                college,
                passingYear,
                percentage,
                cgpa
            } = req.body;

            const employee =
                await Employee.findOne({
                    employeeId
                });

            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Employee not found"
                });
            }

            employee.education = [
                {
                    highestQualification:
                        highestQualification || "",

                    course:
                        course || "",

                    specialization:
                        specialization || "",

                    university:
                        university || "",

                    college:
                        college || "",

                    passingYear:
                        passingYear || "",

                    percentage:
                        percentage || "",

                    cgpa:
                        cgpa || ""
                }
            ];

            updateProfileCompletion(
                employee
            );

            await employee.save();

            return res.status(200).json({
                success: true,
                message:
                    "Education details saved successfully",

                education:
                    employee.education,

                profileCompleted:
                    employee.profileCompleted
            });

        } catch (error) {

            console.error(
                "Education Update Error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to update education",
                error:
                    error.message
            });
        }
    };

// ==========================================================
// UPDATE ADDRESS
// PUT /api/employees/:employeeId/address
// ==========================================================

const updateAddress =
    async (req, res) => {

        try {

            const {
                employeeId
            } = req.params;

            const {
                currentAddress,
                currentCity,
                currentState,
                currentPincode,
                currentCountry,

                sameAsCurrent,

                permanentAddress,
                permanentCity,
                permanentState,
                permanentPincode,
                permanentCountry
            } = req.body;

            const employee =
                await Employee.findOne({
                    employeeId
                });

            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Employee not found"
                });
            }

            const same =
                Boolean(
                    sameAsCurrent
                );

            employee.address = {

                current: {

                    address:
                        currentAddress || "",

                    city:
                        currentCity || "",

                    state:
                        currentState || "",

                    pincode:
                        currentPincode || "",

                    country:
                        currentCountry || ""
                },

                permanent: {

                    address:
                        same
                            ? currentAddress || ""
                            : permanentAddress || "",

                    city:
                        same
                            ? currentCity || ""
                            : permanentCity || "",

                    state:
                        same
                            ? currentState || ""
                            : permanentState || "",

                    pincode:
                        same
                            ? currentPincode || ""
                            : permanentPincode || "",

                    country:
                        same
                            ? currentCountry || ""
                            : permanentCountry || ""
                },

                sameAsCurrent:
                    same
            };

            updateProfileCompletion(
                employee
            );

            await employee.save();

            return res.status(200).json({
                success: true,
                message:
                    "Address details saved successfully",

                address:
                    employee.address,

                profileCompleted:
                    employee.profileCompleted
            });

        } catch (error) {

            console.error(
                "Address Update Error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to update address",
                error:
                    error.message
            });
        }
    };

// ==========================================================
// UPDATE SKILLS
// PUT /api/employees/:employeeId/skills
// ==========================================================

const updateSkills =
    async (req, res) => {

        try {

            const {
                employeeId
            } = req.params;

            const {
                skills
            } = req.body;

            if (!Array.isArray(skills)) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Skills must be an array"
                });
            }

            const employee =
                await Employee.findOne({
                    employeeId
                });

            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Employee not found"
                });
            }

            employee.skills =
                skills;

            updateProfileCompletion(
                employee
            );

            await employee.save();

            return res.status(200).json({
                success: true,
                message:
                    "Skills updated successfully",

                skills:
                    employee.skills,

                profileCompleted:
                    employee.profileCompleted
            });

        } catch (error) {

            console.error(
                "Update Skills Error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to update skills",
                error:
                    error.message
            });
        }
    };

// ==========================================================
// UPDATE WORK EXPERIENCE
// PUT /api/employees/:employeeId/experience
// ==========================================================

const updateWorkExperience =
    async (req, res) => {

        try {

            const {
                employeeId
            } = req.params;

            const {
                isFresher,
                workExperience
            } = req.body;

            const employee =
                await Employee.findOne({
                    employeeId
                });

            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Employee not found"
                });
            }

            employee.isFresher =
                Boolean(isFresher);

            // Fresher does not need work experience.
            if (employee.isFresher) {

                employee.workExperience = [];

            } else {

                employee.workExperience =
                    Array.isArray(workExperience)
                        ? workExperience
                        : [];
            }

            updateProfileCompletion(
                employee
            );

            await employee.save();

            return res.status(200).json({
                success: true,
                message:
                    "Work experience updated successfully",

                isFresher:
                    employee.isFresher,

                workExperience:
                    employee.workExperience,

                profileCompleted:
                    employee.profileCompleted
            });

        } catch (error) {

            console.error(
                "Update Work Experience Error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to update work experience",
                error:
                    error.message
            });
        }
    };

// ==========================================================
// UPDATE BDM DETAILS
// PUT /api/employees/:employeeId/bdm
// ==========================================================

const updateBDMDetails =
    async (req, res) => {

        try {

            const {
                employeeId
            } = req.params;

            const {
                nonTechnicalSkills,
                languagesKnown,
                hobbies,
                areasOfInterest,
                keyStrengths,
                additionalInformation
            } = req.body;

            const employee =
                await Employee.findOne({
                    employeeId
                });

            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Employee not found"
                });
            }

            employee.bdmDetails = {

                nonTechnicalSkills:
                    Array.isArray(
                        nonTechnicalSkills
                    )
                        ? nonTechnicalSkills
                        : [],

                languagesKnown:
                    Array.isArray(
                        languagesKnown
                    )
                        ? languagesKnown
                        : [],

                hobbies:
                    Array.isArray(
                        hobbies
                    )
                        ? hobbies
                        : [],

                areasOfInterest:
                    Array.isArray(
                        areasOfInterest
                    )
                        ? areasOfInterest
                        : [],

                keyStrengths:
                    keyStrengths || "",

                additionalInformation:
                    additionalInformation || ""
            };

            updateProfileCompletion(
                employee
            );

            await employee.save();

            return res.status(200).json({
                success: true,
                message:
                    "BDM details saved successfully",

                bdmDetails:
                    employee.bdmDetails,

                profileCompleted:
                    employee.profileCompleted
            });

        } catch (error) {

            console.error(
                "BDM Details Update Error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to update BDM details",
                error:
                    error.message
            });
        }
    };

// ==========================================================
// EXPORT
// ==========================================================

module.exports = {
    createEmployee,
    getEmployee,
    updatePersonalDetails,
    updateEducation,
    updateAddress,
    updateSkills,
    updateWorkExperience,
    updateBDMDetails
};