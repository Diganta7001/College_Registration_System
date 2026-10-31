
require("dotenv").config({ quiet: true });

const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const methodOverride = require("method-override");

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

// Determine environment
const isTestEnvironment = process.env.NODE_ENV === "test";

// Select database URI
const mongoUri = isTestEnvironment
    ? process.env.TEST_MONGO_URI
    : process.env.MONGO_URI;

// EJS configuration
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static("public"));

// Configure session store
// Jest uses the default in-memory session store.
// Normal application execution uses MongoDB.
const sessionStore = isTestEnvironment
    ? undefined
    : MongoStore.create({
        mongoUrl: mongoUri
    });

// Session configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,

        ...(sessionStore && {
            store: sessionStore
        }),

        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);

// Make logged-in user available in EJS templates
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    next();
});

// Application routes
app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/admin", adminRoutes);
app.use("/student", studentRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("College Course Registration System is running!");
});

// Server configuration
const PORT = process.env.PORT || 3000;

// Start server
const startServer = async () => {
    try {
        if (!mongoUri) {
            throw new Error("MongoDB connection URI is missing.");
        }

        await connectDB(mongoUri);

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

// Start server only when app.js is executed directly
// Never start the server during Jest tests
if (require.main === module && process.env.NODE_ENV !== "test") {
    startServer();
}

// Export Express application for Supertest
module.exports = app;
