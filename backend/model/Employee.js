const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            unique: true,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        personalDetails: {
            firstName: String,
            lastName: String,
            phone: String,
            alternatePhone: String,
            dateOfBirth: Date,
            gender: String
        },

        education: [
            {
                highestQualification: String,
                course: String,
                specialization: String,
                university: String,
                college: String,
                passingYear: Number,
                percentage: Number,
                cgpa: Number
            }
        ],

        address: {
            current: {
                address: String,
                city: String,
                state: String,
                pincode: String,
                country: String
            },

            permanent: {
                address: String,
                city: String,
                state: String,
                pincode: String,
                country: String
            },

            sameAsCurrent: {
                type: Boolean,
                default: false
            }
        },

        skills: [
            {
                skill: String,
                category: String,
                proficiency: String,
                experience: String
            }
        ],

       isFresher: {
    type: Boolean,
    default: false
},

workExperience: [
    {
        companyName: String,
        jobTitle: String,
        employmentType: String,
        workLocation: String,
        startDate: Date,
        endDate: Date,
        currentlyWorking: Boolean,
        jobDescription: String
    }
],

        bdmDetails: {
            nonTechnicalSkills: [String],
            languagesKnown: [String],
            hobbies: [String],
            areasOfInterest: [String],
            keyStrengths: String,
            additionalInformation: String
        },

        declaration: {
            accepted: {
                type: Boolean,
                default: false
            },

            submittedAt: Date
        },

        profileCompleted: {
            type: Boolean,
            default: false
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("Employee", employeeSchema);