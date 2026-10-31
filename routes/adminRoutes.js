const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const courseController = require("../controllers/courseController");

const { isAdmin } = require("../middleware/auth");

// Dashboard
router.get(
    "/dashboard",
    isAdmin,
    adminController.getDashboard
);

// Course management
router.get(
    "/courses",
    isAdmin,
    courseController.getAdminCourses
);

router.post(
    "/courses",
    isAdmin,
    courseController.addCourse
);

router.put(
    "/courses/:id",
    isAdmin,
    courseController.updateCourse
);

router.delete(
    "/courses/:id",
    isAdmin,
    courseController.deleteCourse
);

// View registrations
router.get(
    "/registrations",
    isAdmin,
    adminController.getRegistrations
);

module.exports = router;