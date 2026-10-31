require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

const createAdmin = async () => {
    try {
        await connectDB();

        const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

        if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
            throw new Error("Please provide all admin credentials in .env");
        }

        const existingAdmin = await User.findOne({
            email: ADMIN_EMAIL.toLowerCase()
        });

        if (existingAdmin) {
            console.log("Admin account already exists.");
            return;
        }

        const admin = new User({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            role: "admin"
        });

        await admin.save();

        console.log("Admin account created successfully!");
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await mongoose.connection.close();
    }
};

createAdmin();