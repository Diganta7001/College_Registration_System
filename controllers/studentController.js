
const Course = require("../models/Course");
const Registration = require("../models/Registration");

// Student dashboard
exports.getDashboard = async (req, res) => {
    try {
        const userId = req.session.user.id;

        const registrations = await Registration
            .find({ student: userId })
            .populate("course");

        const courses = await Course.find().sort({ courseCode: 1 });

        res.render("student/dashboard", {
            user: req.session.user,
            registrations,
            courses
        });

    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).send("Unable to load student dashboard");
    }
};

// Register for a course
exports.registerCourse = async (req, res) => {
    try {
        const studentId = req.session.user.id;
        const courseId = req.params.courseId;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).send("Course not found");
        }

        const existingRegistration = await Registration.findOne({
            student: studentId,
            course: courseId
        });

        if (existingRegistration) {
            return res.status(400).send("Already registered for this course");
        }

        const currentCount = await Registration.countDocuments({
            course: courseId
        });

        if (currentCount >= course.capacity) {
            return res.status(400).send("Course capacity is full");
        }

        await Registration.create({
            student: studentId,
            course: courseId
        });

        res.redirect("/student/dashboard");

    } catch (error) {
        console.error("Registration error:", error);

        if (error.code === 11000) {
            return res.status(400).send("Already registered for this course");
        }

        res.status(500).send("Unable to register for course");
    }
};

// Drop a course
exports.dropCourse = async (req, res) => {
    try {
        const studentId = req.session.user.id;
        const courseId = req.params.courseId;

        const registration = await Registration.findOne({
            student: studentId,
            course: courseId
        });

        if (!registration) {
            return res.status(404).send("Registration not found");
        }

        await Registration.findByIdAndDelete(registration._id);

        res.redirect("/student/dashboard");

    } catch (error) {
        console.error("Drop course error:", error);
        res.status(500).send("Unable to drop course");
    }
};

// View registered courses
exports.getMyCourses = async (req, res) => {
    try {
        const studentId = req.session.user.id;

        const registrations = await Registration
            .find({ student: studentId })
            .populate("course");

        res.render("student/myCourses", {
            registrations
        });

    } catch (error) {
        console.error("My courses error:", error);
        res.status(500).send("Unable to load registered courses");
    }
};
