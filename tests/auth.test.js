
const request = require("supertest");
const app = require("../app");

const User = require("../models/User");

describe("Authentication Tests", () => {

    test("GET /auth/register should display registration page", async () => {
        const response = await request(app)
            .get("/auth/register");

        expect(response.statusCode).toBe(200);
    });

    test("Student should register successfully", async () => {
        const response = await request(app)
            .post("/auth/register")
            .type("form")
            .send({
                name: "Test Student",
                email: "student@test.com",
                password: "Password123",
                confirmPassword: "Password123"
            });

        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe("/auth/login");

        const user = await User.findOne({
            email: "student@test.com"
        });

        expect(user).not.toBeNull();
        expect(user.role).toBe("student");
        expect(user.password).not.toBe("Password123");
    });

    test("Registration should reject mismatched passwords", async () => {
        const response = await request(app)
            .post("/auth/register")
            .type("form")
            .send({
                name: "Test Student",
                email: "student@test.com",
                password: "Password123",
                confirmPassword: "Different123"
            });

        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("Passwords do not match");
    });

    test("Registration should reject duplicate email", async () => {
        await User.create({
            name: "Existing Student",
            email: "student@test.com",
            password: "Password123",
            role: "student"
        });

        const response = await request(app)
            .post("/auth/register")
            .type("form")
            .send({
                name: "Another Student",
                email: "student@test.com",
                password: "Password123",
                confirmPassword: "Password123"
            });

        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("already exists");
    });

    test("Login should reject incorrect password", async () => {
        await User.create({
            name: "Test Student",
            email: "student@test.com",
            password: "Password123",
            role: "student"
        });

        const response = await request(app)
            .post("/auth/login")
            .type("form")
            .send({
                email: "student@test.com",
                password: "WrongPassword123"
            });

        expect(response.statusCode).toBe(401);
    });

    test("Student should login successfully", async () => {
        await User.create({
            name: "Test Student",
            email: "student@test.com",
            password: "Password123",
            role: "student"
        });

        const agent = request.agent(app);

        const response = await agent
            .post("/auth/login")
            .type("form")
            .send({
                email: "student@test.com",
                password: "Password123"
            });

        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe("/student/dashboard");
    });

    test("Unauthenticated users should not access student dashboard", async () => {
        const response = await request(app)
            .get("/student/dashboard");

        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe("/auth/login");
    });

});
