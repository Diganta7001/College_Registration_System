
const request = require("supertest");
const app = require("../app");

const User = require("../models/User");
const Course = require("../models/Course");
const Registration = require("../models/Registration");

describe("Student Course Registration Tests", () => {
    let studentAgent;
    let course;

    beforeEach(async () => {
        const student = await User.create({
            name: "Test Student",
            email: "student@test.com",
            password: "password123",
            role: "student"
        });

        studentAgent = request.agent(app);

        await studentAgent
            .post("/auth/login")
            .send({
                email: student.email,
                password: "password123"
            });

        course = await Course.create({
            courseCode: "CS401",
            title: "Software Engineering",
            description: "Software engineering fundamentals",
            credits: 4,
            capacity: 2,
            semester: "Semester 7"
        });
    });

    test("Student should register for a course successfully", async () => {
        const response = await studentAgent
            .post(`/student/register/${course._id}`);

        expect(response.statusCode).toBe(302);

        const registration = await Registration.findOne({
            course: course._id
        });

        expect(registration).not.toBeNull();

        const updatedCourse = await Course.findById(course._id);

        expect(updatedCourse.enrolledCount).toBe(1);
    });

    test("Student should not register for the same course twice", async () => {
        await studentAgent.post(`/student/register/${course._id}`);

        const response = await studentAgent
            .post(`/student/register/${course._id}`);

        expect(response.text).toContain("already registered");

        const registrations = await Registration.countDocuments({
            course: course._id
        });

        expect(registrations).toBe(1);
    });

    test("Student should not register when course is full", async () => {
        course.enrolledCount = course.capacity;
        await course.save();

        const response = await studentAgent
            .post(`/student/register/${course._id}`);

        expect(response.text).toContain("full");

        const registrations = await Registration.countDocuments({
            course: course._id
        });

        expect(registrations).toBe(0);
    });

    test("Student should drop a registered course", async () => {
        await studentAgent.post(`/student/register/${course._id}`);

        const response = await studentAgent
            .post(`/student/drop/${course._id}`);

        expect(response.statusCode).toBe(302);

        const registration = await Registration.findOne({
            course: course._id
        });

        expect(registration).toBeNull();

        const updatedCourse = await Course.findById(course._id);

        expect(updatedCourse.enrolledCount).toBe(0);
    });

    test("Unauthenticated users should not register for courses", async () => {
        const response = await request(app)
            .post(`/student/register/${course._id}`);

        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe("/auth/login");
    });
});
