
const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// Registration
router.get("/register", authController.getRegister);
router.post("/register", authController.register);

// Login
router.get("/login", authController.getLogin);
router.post("/login", authController.login);

// Logout
router.post("/logout", authController.logout);

module.exports = router;
