const User = require("../models/User");
const Course = require("../models/Course");
const Registration = require("../models/Registration");

// Admin dashboard
exports.getDashboard = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({
            role: "student"
        });

        const totalCourses = await Course.countDocuments();

        const totalRegistrations = await Registration.countDocuments();

        res.render("admin/dashboard", {
            totalStudents,
            totalCourses,
            totalRegistrations
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};

// View all student registrations
exports.getRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find()
            .populate("student", "name email")
            .populate("course", "courseCode title credits")
            .sort({ registeredAt: -1 });

        res.render("admin/registrations", {
            registrations
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};