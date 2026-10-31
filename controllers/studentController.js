
const Course = require("../models/Course");
const Registration = require("../models/Registration");

// Student dashboard
exports.getDashboard = async (req, res) => {
    try {
        const studentId = req.session.user.id;

        const registrations = await Registration
            .find({ student: studentId })
            .populate("course");

        const courses = await Course
            .find()
            .sort({ courseCode: 1 });

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

        // Check whether the course exists
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).send("Course not found");
        }

        // Check duplicate registration
        const existingRegistration = await Registration.findOne({
            student: studentId,
            course: courseId
        });

        if (existingRegistration) {
            return res.status(400).send(
                "You are already registered for this course"
            );
        }

        // Reserve a seat only if capacity is available
        const updatedCourse = await Course.findOneAndUpdate(
            {
                _id: courseId,
                $expr: {
                    $lt: ["$enrolledCount", "$capacity"]
                }
            },
            {
                $inc: { enrolledCount: 1 }
            },
            {
                returnDocument: "after"
            }
        );

        if (!updatedCourse) {
            return res.status(400).send("Course capacity is full");
        }

        try {
            // Create registration after reserving the seat
            await Registration.create({
                student: studentId,
                course: courseId
            });

        } catch (error) {
            // Release reserved seat if registration creation fails
            await Course.findByIdAndUpdate(courseId, {
                $inc: { enrolledCount: -1 }
            });

            // Handle duplicate registration
            if (error.code === 11000) {
                return res.status(400).send(
                    "You are already registered for this course"
                );
            }

            throw error;
        }

        res.redirect("/student/dashboard");

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).send("Unable to register for course");
    }
};


// Drop a course
exports.dropCourse = async (req, res) => {
    try {
        const studentId = req.session.user.id;
        const courseId = req.params.courseId;

        // Atomically find and delete the student's registration
        const registration = await Registration.findOneAndDelete({
            student: studentId,
            course: courseId
        });

        if (!registration) {
            return res.status(404).send("Registration not found");
        }

        // Release the reserved seat
        await Course.findOneAndUpdate(
            {
                _id: courseId,
                enrolledCount: { $gt: 0 }
            },
            {
                $inc: { enrolledCount: -1 }
            }
        );

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
