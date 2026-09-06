const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            default: null
        },

        role: {
            type: String,
            enum: ["admin", "employee"],
            default: "employee"
        },

        isActive: {
            type: Boolean,
            default: true
        },

        isEmailVerified: {
            type: Boolean,
            default: false
        },

        verificationCode: String,
        verificationCodeExpires: Date,

        resetCode: String,
        resetCodeExpires: Date
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.models.User ||
    mongoose.model("User", userSchema);