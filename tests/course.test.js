
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

const User = require("../models/User");
const Course = require("../models/Course");

describe("Course Management Tests", () => {
    let adminAgent;

    beforeEach(async () => {
        const admin = await User.create({
            name: "Test Admin",
            email: "admin@test.com",
            password: "password123",
            role: "admin"
        });

        adminAgent = request.agent(app);

        // Log in as admin
        await adminAgent
            .post("/auth/login")
            .send({
                email: "admin@test.com",
                password: "password123"
            });
    });

    test("Admin should access course management page", async () => {
        const response = await adminAgent.get("/admin/courses");

        expect(response.statusCode).toBe(200);
    });

    test("Admin should add a new course", async () => {
        const response = await adminAgent
            .post("/admin/courses")
            .type("form")
            .send({
                courseCode: "CS301",
                title: "Database Management",
                description: "DBMS course",
                credits: 4,
                capacity: 60,
                semester: "Semester 5"
            });

        expect(response.statusCode).toBe(302);

        const course = await Course.findOne({ courseCode: "CS301" });

        expect(course).not.toBeNull();
        expect(course.title).toBe("Database Management");
    });

    test("Student should not access admin course management", async () => {
        const student = await User.create({
            name: "Test Student",
            email: "student@test.com",
            password: "password123",
            role: "student"
        });

        const studentAgent = request.agent(app);

        await studentAgent
            .post("/auth/login")
            .send({
                email: student.email,
                password: "password123"
            });

        const response = await studentAgent.get("/admin/courses");

        expect(response.statusCode).toBe(403);
    });
});
