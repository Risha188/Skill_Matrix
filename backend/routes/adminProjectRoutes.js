const express = require("express");

const router = express.Router();

const {
    protect,
    adminOnly
} = require("../middlewares/authMiddleware");

const {
    createProject,
    getAllProjects,
    getProjectDetails,
    deleteProject
} = require("../controllers/adminProjectController");

// ======================================================
// ADMIN AUTHENTICATION
// ======================================================

router.use(protect);
router.use(adminOnly);


// ======================================================
// GET ALL PROJECTS
// GET /api/admin/projects
// ======================================================

router.get(
    "/projects",
    getAllProjects
);


// ======================================================
// CREATE PROJECT
// POST /api/admin/projects
// ======================================================

router.post(
    "/projects",
    createProject
);


// ======================================================
// GET PROJECT DETAILS
// GET /api/admin/projects/:projectId
// ======================================================

router.get(
    "/projects/:projectId",
    getProjectDetails
);


// ======================================================
// DELETE PROJECT
// DELETE /api/admin/projects/:projectId
// ======================================================

router.delete(
    "/projects/:projectId",
    deleteProject
);


module.exports = router;