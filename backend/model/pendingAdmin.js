const mongoose = require("mongoose");

const pendingAdminSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        verificationCode: {
            type: String,
            required: true
        },

        verificationCodeExpires: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "PendingAdmin",
    pendingAdminSchema
);