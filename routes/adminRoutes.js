
const express = require("express");
const router = express.Router();

const courseController = require("../controllers/courseController");
const { isAdmin } = require("../middleware/auth");

// Admin dashboard
router.get("/dashboard", isAdmin, (req, res) => {
    res.render("admin/dashboard");
});

// Course management
router.get("/courses", isAdmin, courseController.getAdminCourses);

router.post("/courses", isAdmin, courseController.addCourse);

router.put("/courses/:id", isAdmin, courseController.updateCourse);

router.delete("/courses/:id", isAdmin, courseController.deleteCourse);

module.exports = router;
