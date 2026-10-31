
const mongoose = require("mongoose");

const connectDB = async (uri = process.env.MONGO_URI) => {
    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        throw error;
    }
};

module.exports = connectDB;
