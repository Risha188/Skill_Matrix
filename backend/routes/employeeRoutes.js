const express = require("express");

console.log("Employee routes loaded");

const {
    createEmployee,
    getEmployee,
    updateEducation,
    updateAddress,
    updateSkills,
    updateWorkExperience,
    updateBDMDetails
} = require("../controllers/employeecontroller");

const router = express.Router();

router.post("/", createEmployee);

router.put("/:employeeId/education", updateEducation);

router.put("/:employeeId/address", updateAddress);

router.put("/:employeeId/skills", updateSkills);

router.put("/:employeeId/work-experience", updateWorkExperience);

router.put("/:employeeId/bdm", updateBDMDetails);

router.get("/:employeeId", getEmployee);

module.exports = router;