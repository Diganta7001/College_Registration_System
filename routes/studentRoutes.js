const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");
const { isStudent } = require("../middleware/auth");

// Student dashboard
router.get("/dashboard", isStudent, studentController.getDashboard);

// Register for a course
router.post("/register/:courseId", isStudent, studentController.registerCourse);

// Drop a course
router.post("/drop/:courseId", isStudent, studentController.dropCourse);

// View registered courses
router.get("/my-courses", isStudent, studentController.getMyCourses);

module.exports = router;