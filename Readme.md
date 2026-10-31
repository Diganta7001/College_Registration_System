# College Course Registration System

A web-based College Course Registration System developed as part of the **CSC702 – Software Engineering** assignment.

The application allows students to browse available courses, register for courses, drop registered courses, and view their registered subjects. Administrators can manage courses and monitor student registrations.

## Features

### Student

- Student registration and login.
- Secure password hashing using bcrypt.
- Browse available courses.
- Register for courses.
- Prevent duplicate course registrations.
- Course capacity enforcement.
- Drop registered courses.
- View registered courses.
- Session-based authentication.

### Administrator

- Admin authentication and role-based access control.
- Admin dashboard with system statistics.
- Add new courses.
- View all available courses.
- Edit existing courses.
- Delete courses.
- View student course registrations.

## Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend web framework |
| MongoDB | Database |
| Mongoose | MongoDB object modelling |
| EJS | Server-side templating |
| Bootstrap | Frontend styling |
| bcryptjs | Password hashing |
| express-session | Session management |
| connect-mongo | Persistent session storage |
| Jest | Automated testing |
| Supertest | HTTP endpoint testing |

## Project Structure

```text
college-course-registration/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── adminController.js
│   ├── courseController.js
│   └── studentController.js
│
├── middleware/
│   └── auth.js
│
├── models/
│   ├── User.js
│   ├── Course.js
│   └── Registration.js
│
├── routes/
│   ├── authRoutes.js
│   ├── adminRoutes.js
│   ├── courseRoutes.js
│   └── studentRoutes.js
│
├── scripts/
│   └── createAdmin.js
│
├── tests/
│   ├── setup.js
│   ├── auth.test.js
│   ├── course.test.js
│   └── registration.test.js
│
├── views/
│   ├── auth/
│   ├── admin/
│   ├── student/
│   └── partials/
│
├── public/
│   ├── css/
│   ├── js/
│   └── images/
│
├── .env
├── .gitignore
├── app.js
├── package.json
└── README.md
```

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- Git

## Installation and Setup

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Navigate into the project directory:

```bash
cd college-course-registration
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=3000

MONGO_URI=mongodb://127.0.0.1:27017/college_registration

TEST_MONGO_URI=mongodb://127.0.0.1:27017/college_registration_test

SESSION_SECRET=replace_with_a_secure_random_secret
```

Replace the session secret with a strong random value.

Make sure MongoDB is running before starting the application.

### 4. Create an administrator account

The project includes an administrator creation script.

Configure the following variables in your `.env` file temporarily:

```env
ADMIN_NAME=Administrator
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password
```

Run:

```bash
npm run create-admin
```

The script creates an administrator account using the configured credentials.

Remove the temporary administrator password from `.env` after creating the account.

### 5. Start the application

For development:

```bash
npm run dev
```

For normal execution:

```bash
npm start
```

Open your browser and visit:

```text
http://localhost:3000
```

## Testing

The project uses Jest and Supertest for automated testing.

Run the complete test suite:

```bash
npm test
```

Alternatively:

```bash
npx jest --runInBand
```

### Test Results

The current automated test suite contains **15 test cases**, all of which passed during the latest execution.

| Test Suite | Tests | Status |
|---|---:|---|
| Authentication Tests | 7 | Passed |
| Course Management Tests | 3 | Passed |
| Student Registration Tests | 5 | Passed |
| **Total** | **15** | **15 Passed** |

The tests cover:

- Student registration and login.
- Password validation.
- Duplicate email prevention.
- Authentication and authorization.
- Course creation.
- Duplicate course registration prevention.
- Course capacity enforcement.
- Course dropping.
- Unauthorized access prevention.

## Database Models

The application uses three primary MongoDB models:

- **User:** Stores student and administrator information, including authentication credentials and roles.
- **Course:** Stores course details such as course code, title, credits, capacity, semester, and enrolled student count.
- **Registration:** Maintains the relationship between students and registered courses.

## Security and Validation

- Passwords are hashed before being stored.
- Session-based authentication is used.
- Role-based middleware restricts administrator functionality.
- Duplicate email addresses and course registrations are prevented.
- Course capacity is checked before registration.
- Environment variables are used for sensitive configuration.

## Limitations and Future Improvements

Potential future enhancements include:

- Course prerequisite validation.
- Timetable conflict detection.
- Credit limit enforcement.
- Registration deadlines.
- Email notifications.
- Improved error handling and user feedback.
- MongoDB transactions for stronger consistency during registration and course dropping.
- More extensive automated and security testing.

## Academic Information

| Field | Details |
|---|---|
| Course | CSC702 – Software Engineering |
| Assignment | Assignment 10 |
| Project Title | College Course Registration System |
| Group Number | 10 |
| Backend | Node.js and Express.js |
| Database | MongoDB |

## Author

Developed as a group academic project for the CSC702 Software Engineering course.

**Group 10 – Assignment 10**

---

*This project is intended for academic and educational purposes.*