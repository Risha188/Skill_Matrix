const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const employeeRoutes = require("./routes/employeeRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB
connectDB();

// ==========================================
// TEST ROUTE
// ==========================================
app.get("/api/employees/test", (req, res) => {
    res.json({
        success: true,
        message: "Employee test route is working"
    });
});

// Employee routes
app.use("/api/employees", employeeRoutes);


 
// Root
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Skill Matrix Backend is running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});