
const express = require("express");
const router = express.Router();

const courseController = require("../controllers/courseController");
const { isStudent } = require("../middleware/auth");

router.get("/", isStudent, courseController.getCourses);
router.get("/admin", courseController.getAdminCourses);
router.post("/admin/add", courseController.addCourse);
router.post("/admin/update/:id", courseController.updateCourse);
router.post("/admin/delete/:id", courseController.deleteCourse);

module.exports = router;
