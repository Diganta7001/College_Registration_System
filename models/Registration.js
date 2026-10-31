
const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },

        registeredAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

// A student can register for a particular course only once
registrationSchema.index(
    { student: 1, course: 1 },
    { unique: true }
);

const Registration = mongoose.model(
    "Registration",
    registrationSchema
);

module.exports = Registration;
