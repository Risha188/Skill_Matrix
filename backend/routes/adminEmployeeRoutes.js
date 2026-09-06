const express = require("express");

const router = express.Router();

const {
    protect,
    adminOnly
} = require("../middlewares/authMiddleware");

const adminEmployeeController =
    require("../controllers/adminEmployeeController");


// ==========================================
// DEBUG - TEMPORARY
// ==========================================

console.log(
    "Admin Employee Controllers:",
    {
        getEmployees:
            typeof adminEmployeeController.getEmployees,

        getEmployeeDetails:
            typeof adminEmployeeController.getEmployeeDetails,

        updateEmployeeStatus:
            typeof adminEmployeeController.updateEmployeeStatus
    }
);


// ==========================================
// AUTH
// ==========================================

router.use(protect);
router.use(adminOnly);


// ==========================================
// GET ALL EMPLOYEES
// ==========================================

router.get(
    "/",
    adminEmployeeController.getEmployees
);


// ==========================================
// GET EMPLOYEE DETAILS
// ==========================================

router.get(
    "/:id",
    adminEmployeeController.getEmployeeDetails
);


// ==========================================
// UPDATE EMPLOYEE STATUS
// ==========================================

router.patch(
    "/:id/status",
    adminEmployeeController.updateEmployeeStatus
);


module.exports = router;