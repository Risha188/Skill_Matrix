const express = require("express");

const router = express.Router();

const {
    protect
} = require("../middleware/authMiddleware");

const {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
} = require("../controllers/projectController");

// ======================================================
// ALL PROJECT ROUTES
// ======================================================

// All routes require login
router.use(protect);

// ======================================================
// GET ALL PROJECTS
// GET /api/projects
// ======================================================

router.get(
    "/",
    getProjects
);

// ======================================================
// GET SINGLE PROJECT
// GET /api/projects/:id
// ======================================================

router.get(
    "/:id",
    getProjectById
);

// ======================================================
// CREATE PROJECT
// POST /api/projects
// ======================================================

router.post(
    "/",
    createProject
);

// ======================================================
// UPDATE PROJECT
// PUT /api/projects/:id
// ======================================================

router.put(
    "/:id",
    updateProject
);

// ======================================================
// DELETE PROJECT
// DELETE /api/projects/:id
// ======================================================

router.delete(
    "/:id",
    deleteProject
);

module.exports = router;