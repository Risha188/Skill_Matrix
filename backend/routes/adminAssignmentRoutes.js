const express = require("express");

const router = express.Router();

const {
    protect,
    adminOnly
} = require("../middlewares/authMiddleware");

const {
    getAssignedProjects,
    getProjectTeam,
    reassignProjectTeam
} = require("../controllers/adminAssignmentController");

router.use(protect);
router.use(adminOnly);


// ======================================================
// ASSIGNED PROJECTS
// ======================================================

router.get(
    "/",
    getAssignedProjects
);

router.get(
    "/:id/team",
    getProjectTeam
);


router.put(
    "/:id/team",
    reassignProjectTeam
);


module.exports = router;