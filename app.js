
require("dotenv").config();

const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const methodOverride = require("method-override");

const connectDB = require("./config/db");


const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// EJS configuration
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.use(express.static("public"));

// Session configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,

        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI
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

app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/admin", adminRoutes);
app.use("/student", studentRoutes);
// Home route
app.get("/", (req, res) => {
    res.send("College Course Registration System is running!");
});

// Server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();

app.get("/student/dashboard", (req, res) => {
    res.send("Student dashboard coming soon!");
});

app.get("/admin/dashboard", (req, res) => {
    res.send("Admin dashboard coming soon!");
});
