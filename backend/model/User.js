
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            default: null,
        },

        role: {
            type: String,
            enum: ["admin", "employee"],
            default: "employee",
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        isEmailVerified: {
            type: Boolean,
            default: false,
        },

        verificationCode: {
            type: String,
            default: null,
        },

        verificationCodeExpires: {
            type: Date,
            default: null,
        },

        resetCode: {
            type: String,
            default: null,
        },

        resetCodeExpires: {
            type: Date,
            default: null,
        },

        isSuperAdmin: {
            type: Boolean,
            default: false,
        },

        isApproved: {
            type: Boolean,
            default: false,
        },

        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        approvedAt: {
            type: Date,
            default: null,
        },

        permissions: {
            type: [String],
            default: [],
        },

    },
    {
        timestamps: true,
    }
);

const User =
    mongoose.models.User ||
    mongoose.model("User", userSchema);

export default User;
