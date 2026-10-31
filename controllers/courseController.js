
const Course = require("../models/Course");
const Registration = require("../models/Registration");

// Display all available courses to students
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find().sort({ courseCode: 1 });

        res.render("student/courses", {
            courses,
            error: null
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Unable to fetch courses.");
    }
};

// Display courses in admin panel
exports.getAdminCourses = async (req, res) => {
    try {
        const courses = await Course.find().sort({ courseCode: 1 });

        res.render("admin/courses", {
            courses,
            error: null
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Unable to fetch courses.");
    }
};

// Add a new course
exports.addCourse = async (req, res) => {
    try {
        const {
            courseCode,
            title,
            description,
            credits,
            capacity,
            semester
        } = req.body;

        if (!courseCode || !title || !credits || !capacity || !semester) {
            return res.status(400).send("Please fill all required fields.");
        }

        await Course.create({
            courseCode,
            title,
            description,
            credits,
            capacity,
            semester
        });

        res.redirect("/admin/courses");

    } catch (error) {
        console.error(error);

        if (error.code === 11000) {
            return res.status(400).send("Course code already exists.");
        }

        res.status(500).send("Unable to add course.");
    }
};

// Update course
exports.updateCourse = async (req, res) => {
    try {
        const {
            title,
            description,
            credits,
            capacity,
            semester
        } = req.body;

        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).send("Course not found.");
        }

        if (title !== undefined) course.title = title;
        if (description !== undefined) course.description = description;
        if (credits !== undefined) course.credits = credits;
        if (capacity !== undefined) course.capacity = capacity;
        if (semester !== undefined) course.semester = semester;

        await course.save();

        res.redirect("/admin/courses");

    } catch (error) {
        console.error(error);
        res.status(500).send("Unable to update course.");
    }
};

// Delete course
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).send("Course not found.");
        }

        const registrations = await Registration.countDocuments({
            course: course._id
        });

        // Do not delete courses with existing registrations
        if (registrations > 0) {
            return res.status(400).send(
                "Cannot delete this course because students are registered."
            );
        }

        await Course.findByIdAndDelete(req.params.id);

        res.redirect("/admin/courses");

    } catch (error) {
        console.error(error);
        res.status(500).send("Unable to delete course.");
    }
};
