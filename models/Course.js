
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        default: ""
    },

    credits: {
        type: Number,
        required: true,
        min: 1
    },

    capacity: {
        type: Number,
        required: true,
        min: 1
    },

    enrolledCount: {
        type: Number,
        default: 0,
        min: 0
    },

    semester: {
        type: String,
        required: true,
        trim: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
