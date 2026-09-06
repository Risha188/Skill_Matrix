const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        // =====================================================
        // PROJECT BASIC INFORMATION
        // =====================================================

        projectId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: "",
            trim: true
        },

        client: {
            type: String,
            default: "",
            trim: true
        },

        projectType: {
            type: String,
            default: "",
            trim: true
        },

        priority: {
            type: String,
            enum: [
                "",
                "low",
                "medium",
                "high",
                "critical"
            ],
            default: "medium"
        },

        // =====================================================
        // PROJECT DATES
        // =====================================================

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            required: true
        },

        // =====================================================
        // PROJECT STATUS
        // =====================================================

        status: {
            type: String,
            enum: [
                "pending",
                "active",
                "completed",
                "cancelled"
            ],
            default: "pending"
        },

        // =====================================================
        // PROJECT TECHNOLOGY
        // =====================================================

        technologyStack: {
            type: [String],
            default: []
        },

        // =====================================================
        // PROJECT OBJECTIVES
        // =====================================================

        objectives: {
            type: [String],
            default: []
        },

        // =====================================================
        // ASSIGNED EMPLOYEES
        // =====================================================
        // Store employee codes:
        // ["EMP002", "EMP003"]
        //
        // Your frontend already sends employeeIds in this format.
        // =====================================================

        employeeIds: {
            type: [String],
            default: [],
            validate: {
                validator: function (value) {
                    return value.length >= 2;
                },
                message:
                    "A project must have at least 2 employees."
            }
        },

        // =====================================================
        // CREATED BY
        // =====================================================

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.models.Project ||
    mongoose.model("Project", projectSchema);