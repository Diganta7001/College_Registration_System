
const User = require("../models/User");

// GET: Registration page
exports.getRegister = (req, res) => {
    res.render("auth/register", {
        error: null
    });
};

// POST: Register student
exports.register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Check required fields
        if (!name || !email || !password || !confirmPassword) {
            return res.render("auth/register", {
                error: "All fields are required."
            });
        }

        // Check password confirmation
        if (password !== confirmPassword) {
            return res.render("auth/register", {
                error: "Passwords do not match."
            });
        }

        // Check password length
        if (password.length < 8) {
            return res.render("auth/register", {
                error: "Password must contain at least 8 characters."
            });
        }

        // Check existing email
        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingUser) {
            return res.render("auth/register", {
                error: "An account with this email already exists."
            });
        }

        // Create new student
        const user = new User({
            name,
            email,
            password,
            role: "student"
        });

        await user.save();

        return res.redirect("/auth/login");

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).render("auth/register", {
            error: "Unable to register. Please try again."
        });
    }
};

// GET: Login page
exports.getLogin = (req, res) => {
    res.render("auth/login", {
        error: null
    });
};

// POST: Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render("auth/login", {
                error: "Email and password are required."
            });
        }

        // Find user
        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return res.status(401).render("auth/login", {
                error: "Invalid email or password."
            });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).render("auth/login", {
                error: "Invalid email or password."
            });
        }

        // Regenerate session after successful authentication
        req.session.regenerate((err) => {
            if (err) {
                console.error(err);
                return res.status(500).render("auth/login", {
                    error: "Unable to create session."
                });
            }

            req.session.user = {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role
            };

            req.session.save((err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).render("auth/login", {
                        error: "Unable to save session."
                    });
                }

                if (user.role === "admin") {
                    return res.redirect("/admin/dashboard");
                }

                return res.redirect("/student/dashboard");
            });
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).render("auth/login", {
            error: "Something went wrong. Please try again."
        });
    }
};

// POST: Logout
exports.logout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }

        res.clearCookie("connect.sid");
        return res.redirect("/auth/login");
    });
};
