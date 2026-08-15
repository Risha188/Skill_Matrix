const Employee = require("../model/Employee");

const createEmployee = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            alternatePhone,
            dateOfBirth,
            gender
        } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const existingEmployee = await Employee.findOne({ email });

        if (existingEmployee) {
            return res.status(400).json({
                success: false,
                message: "Employee already exists",
                employeeId: existingEmployee.employeeId
            });
        }

        const employeeCount = await Employee.countDocuments();

        const employeeId =
            `EMP${String(employeeCount + 1).padStart(4, "0")}`;

        const employee = await Employee.create({
            employeeId,
            email,

            personalDetails: {
                firstName,
                lastName,
                phone,
                alternatePhone,
                dateOfBirth,
                gender
            }
        });

        res.status(201).json({
            success: true,
            message: "Employee profile created successfully",
            employee
        });

    } catch (error) {
        console.error("Create Employee Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const updateEducation = async (req, res) => {
    try {

        const { employeeId } = req.params;

        console.log("Employee ID:", employeeId);
        console.log("Education Data:", req.body);

        const employee = await Employee.findOne({
            employeeId: employeeId
        });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        employee.education = [
            {
                highestQualification: req.body.highestQualification,
                course: req.body.course,
                specialization: req.body.specialization,
                university: req.body.university,
                college: req.body.college,
                passingYear: req.body.passingYear,
                percentage: req.body.percentage,
                cgpa: req.body.cgpa
            }
        ];

        await employee.save();

        console.log("Education saved successfully");

        res.status(200).json({
            success: true,
            message: "Education details saved successfully",
            employee
        });

    } catch (error) {

        console.error("Education Update Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const updateAddress = async (req, res) => {
    try {
        const { employeeId } = req.params;

        console.log("========== ADDRESS UPDATE ==========");
        console.log("Employee ID:", employeeId);
        console.log("Address Data:", req.body);

        const employee = await Employee.findOne({ employeeId });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

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

        employee.address = {
            current: {
                address: currentAddress,
                city: currentCity,
                state: currentState,
                pincode: currentPincode,
                country: currentCountry
            },

            permanent: {
                address: sameAsCurrent
                    ? currentAddress
                    : permanentAddress,

                city: sameAsCurrent
                    ? currentCity
                    : permanentCity,

                state: sameAsCurrent
                    ? currentState
                    : permanentState,

                pincode: sameAsCurrent
                    ? currentPincode
                    : permanentPincode,

                country: sameAsCurrent
                    ? currentCountry
                    : permanentCountry
            },

            sameAsCurrent
        };

        await employee.save();

        console.log("Address saved successfully");

        res.status(200).json({
            success: true,
            message: "Address details saved successfully",
            address: employee.address
        });

    } catch (error) {
        console.error("Address Update Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateSkills = async (req, res) => {
    try {

        const { employeeId } = req.params;

        const { skills } = req.body;

        if (!skills || !Array.isArray(skills)) {
            return res.status(400).json({
                success: false,
                message: "Skills must be an array"
            });
        }

        const employee = await Employee.findOneAndUpdate(
            { employeeId },
            {
                $set: {
                    skills: skills
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Skills updated successfully",
            skills: employee.skills
        });

    } catch (error) {

        console.error("Update Skills Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const updateWorkExperience = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { isFresher, workExperience } = req.body;

        const employee = await Employee.findOne({ employeeId });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        employee.isFresher = isFresher;
        employee.workExperience = isFresher
            ? []
            : workExperience;

        await employee.save();

        res.status(200).json({
            success: true,
            message: "Work experience updated successfully",
            isFresher: employee.isFresher,
            workExperience: employee.workExperience
        });

    } catch (error) {
        console.error("Update Work Experience Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// ==========================================
// UPDATE BDM DETAILS
// ==========================================

const updateBDMDetails = async (req, res) => {
    try {
        const { employeeId } = req.params;

        console.log("========== BDM UPDATE ==========");
        console.log("Employee ID:", employeeId);
        console.log("BDM Data:", req.body);

        const employee = await Employee.findOne({
            employeeId: employeeId
        });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        const {
            nonTechnicalSkills,
            languagesKnown,
            hobbies,
            areasOfInterest,
            keyStrengths,
            additionalInformation
        } = req.body;

        employee.bdmDetails = {
            nonTechnicalSkills: Array.isArray(nonTechnicalSkills)
                ? nonTechnicalSkills
                : [],

            languagesKnown: Array.isArray(languagesKnown)
                ? languagesKnown
                : [],

            hobbies: Array.isArray(hobbies)
                ? hobbies
                : [],

            areasOfInterest: Array.isArray(areasOfInterest)
                ? areasOfInterest
                : [],

            keyStrengths: keyStrengths || "",

            additionalInformation: additionalInformation || ""
        };

        await employee.save();

        console.log("BDM details saved successfully");

        return res.status(200).json({
            success: true,
            message: "BDM details saved successfully",
            bdmDetails: employee.bdmDetails
        });

    } catch (error) {
        console.error("BDM Details Update Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const getEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const employee = await Employee.findOne({
            employeeId
        });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        res.status(200).json({
            success: true,
            employee
        });

    } catch (error) {
        console.error("Get Employee Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = {
    createEmployee,
    getEmployee,
    updateEducation,
    updateAddress,
    updateSkills,
    updateWorkExperience,
    updateBDMDetails
};