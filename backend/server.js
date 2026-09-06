const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

/* =====================================================
   CORS CONFIGURATION
===================================================== */

const allowedOrigins = [
    "http://localhost:5173",
    "https://skillmatrix-ten.vercel.app",
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests without Origin
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.error("❌ CORS BLOCKED:", origin);

        return callback(
            new Error(`Not allowed by CORS: ${origin}`)
        );
    },

    credentials: true,

    methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS",
    ],

    allowedHeaders: [
        "Content-Type",
        "Authorization",
    ],

    optionsSuccessStatus: 204,
};

/*
 * IMPORTANT
 * Do NOT use:
 *
 * app.options("*", cors(corsOptions));
 *
 * Your Express/path-to-regexp version rejects "*".
 */
app.use(cors(corsOptions));


/* =====================================================
   BODY PARSERS
===================================================== */

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);


/* =====================================================
   TEST ROUTE
===================================================== */

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "SkillMatrix Backend API is running",
    });
});


/* =====================================================
   AUTH ROUTES
===================================================== */

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);


/* =====================================================
   OTHER ROUTES
===================================================== */

// Example:
//
// const employeeRoutes = require("./routes/employeeRoutes");
// app.use("/api/employees", employeeRoutes);
//
// const adminRoutes = require("./routes/adminRoutes");
// app.use("/api/admin", adminRoutes);


/* =====================================================
   404 HANDLER
===================================================== */

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});


/* =====================================================
   GLOBAL ERROR HANDLER
===================================================== */

app.use((err, req, res, next) => {
    console.error("❌ SERVER ERROR:", err);

    if (
        err.message &&
        err.message.startsWith("Not allowed by CORS")
    ) {
        return res.status(403).json({
            success: false,
            message: "CORS policy blocked this request.",
            error: err.message,
        });
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});


/* =====================================================
   LOCAL SERVER
===================================================== */

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(
            `🚀 SkillMatrix Backend running on port ${PORT}`
        );

        console.log(
            `🌐 API: http://localhost:${PORT}`
        );

        console.log("✅ Allowed Origins:");

        allowedOrigins.forEach((origin) => {
            console.log(`   - ${origin}`);
        });
    });
}


/* =====================================================
   EXPORT APP FOR VERCEL
===================================================== */

module.exports = app;