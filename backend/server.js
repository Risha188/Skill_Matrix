const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

// ==========================================
// DEFAULT ADMIN
// ==========================================

const createDefaultAdmin =
    require("./utils/createDefaultAdmin");

// ==========================================
// ROUTES
// ==========================================

const authRoutes =
    require("./routes/authRoutes");

const employeeRoutes =
    require("./routes/employeeRoutes");

const adminRoutes =
    require("./routes/adminRoutes");

const adminProjectRoutes =
    require("./routes/adminProjectRoutes");

const adminEmployeeRoutes =
    require("./routes/adminEmployeeRoutes");

const adminAssignmentRoutes =
    require("./routes/adminAssignmentRoutes");

// ==========================================
// AUTH MIDDLEWARE
// ==========================================

const {
    protect,
    adminOnly,
    employeeOnly
} = require("./middlewares/authMiddleware");

// ==========================================
// APP
// ==========================================

const app = express();

// ==========================================
// GLOBAL MIDDLEWARE
// ==========================================

// ==========================================
// GLOBAL MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

// ==========================================
// REQUEST LOGGER
// ==========================================

app.use((req, res, next) => {

    console.log("");
    console.log("REQUEST RECEIVED");
    console.log("METHOD:", req.method);
    console.log("URL:", req.originalUrl);

    next();
});
// ==========================================
// HOME / TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message:
            "Skill Matrix Backend is running"
    });
});

// ==========================================
// AUTH ROUTES
// ==========================================

app.use(
    "/api/auth",
    authRoutes
);

// ==========================================
// ADMIN DASHBOARD
// ==========================================

app.use(
    "/api/admin",
    adminRoutes
);

// ==========================================
// ADMIN PROJECTS
// ==========================================
//
// POST   /api/admin/projects
// GET    /api/admin/projects
// GET    /api/admin/projects/:projectId
// PUT    /api/admin/projects/:projectId
// DELETE /api/admin/projects/:projectId
//
// ==========================================

app.use(
    "/api/admin",
    adminProjectRoutes
);

// ==========================================
// ADMIN EMPLOYEES
// ==========================================

app.use(
    "/api/admin/employees",
    adminEmployeeRoutes
);

// ==========================================
// ADMIN ASSIGNED PROJECTS
// ==========================================
//
// GET /api/admin/assigned-projects
//
// GET /api/admin/assigned-projects/:id/team
//
// PUT /api/admin/assigned-projects/:id/team
//
// ==========================================

app.use(
    "/api/admin/assigned-projects",
    adminAssignmentRoutes
);

// ==========================================
// OPTIONAL OLD ASSIGNMENT URL
// ==========================================
//
// Keep this temporarily so any old frontend
// code using /api/admin/assignments continues
// to work.
//
// ==========================================

app.use(
    "/api/admin/assignments",
    adminAssignmentRoutes
);

// ==========================================
// EMPLOYEE ROUTES
// ==========================================

app.use(
    "/api/employees",
    employeeRoutes
);

// ==========================================
// JWT ADMIN TEST
// ==========================================

app.get(
    "/api/auth/admin-test",
    protect,
    adminOnly,
    (req, res) => {
        res.status(200).json({
            success: true,
            message:
                "Admin access granted",
            user:
                req.user
        });
    }
);

// ==========================================
// JWT EMPLOYEE TEST
// ==========================================

app.get(
    "/api/auth/employee-test",
    protect,
    employeeOnly,
    (req, res) => {
        res.status(200).json({
            success: true,
            message:
                "Employee access granted",
            user:
                req.user
        });
    }
);

// ==========================================
// JWT PROTECTED TEST
// ==========================================

app.get(
    "/api/auth/protected-test",
    protect,
    (req, res) => {
        res.status(200).json({
            success: true,
            message:
                "JWT authentication is working",
            user:
                req.user
        });
    }
);

// ==========================================
// AUTH TEST
// ==========================================

app.get(
    "/api/auth/test",
    (req, res) => {
        res.status(200).json({
            success: true,
            message:
                "Auth route is working"
        });
    }
);

// ==========================================
// 404 HANDLER
// ==========================================

app.use(
    (req, res) => {
        res.status(404).json({
            success: false,
            message:
                `Route not found: ${req.method} ${req.originalUrl}`
        });
    }
);

// ==========================================
// SERVER CONFIGURATION
// ==========================================

const PORT =
    process.env.PORT || 5000;

// ==========================================
// START SERVER
// ==========================================

const startServer = async () => {
    try {

        // ======================================
        // CONNECT DATABASE
        // ======================================

        await connectDB();

        // ======================================
        // CREATE DEFAULT ADMIN
        // ======================================

        await createDefaultAdmin();

        // ======================================
        // START EXPRESS SERVER
        // ======================================

        app.listen(
            PORT,
            () => {

                console.log(
                    `🚀 Server running on port ${PORT}`
                );

            }
        );

    } catch (error) {

        console.error(
            "❌ Server startup failed:",
            error
        );

        process.exit(1);
    }
};

// ==========================================
// START APPLICATION
// ==========================================

startServer();