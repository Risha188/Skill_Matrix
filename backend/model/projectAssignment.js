const mongoose = require("mongoose");

const projectAssignmentSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },

        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true
        },

        assignedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        role: {
            type: String,
            default: ""
        },

        allocation: {
            type: Number,
            default: 100
        },

        status: {
            type: String,
            enum: [
                "active",
                "removed"
            ],
            default: "active"
        },

        assignedDate: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.models.ProjectAssignment ||
    mongoose.model(
        "ProjectAssignment",
        projectAssignmentSchema
    );