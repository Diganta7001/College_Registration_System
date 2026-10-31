
exports.isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/auth/login");
    }

    next();
};

exports.isStudent = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/auth/login");
    }

    if (req.session.user.role !== "student") {
        return res.status(403).send("Access denied: Students only.");
    }

    next();
};

exports.isAdmin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/auth/login");
    }

    if (req.session.user.role !== "admin") {
        return res.status(403).send("Access denied: Administrators only.");
    }

    next();
};
