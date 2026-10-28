# CodSoft Backend Development Internship Projects

This repository contains production-ready, fully tested implementations for all three tasks of the CodSoft Backend Development Internship:

1. **[Task 1: Student Record Management API](./task1-student-records)**
2. **[Task 2: Contact Management System API](./task2-contact-management)**
3. **[Task 3: To-Do List & Task Management Backend API](./task3-todo-list)**

All three applications are developed using **Node.js, Express.js, Sequelize ORM, and SQLite**, featuring Joi schema validations, relational modeling, pagination, search, sorting, error handling, and interactive **Swagger/OpenAPI 3.0** documentation.

---

## Quick Navigation

| Project | Port | Swagger Documentation | Description |
|---|---|---|---|
| **[Task 1](./task1-student-records)** | `5001` | `http://localhost:5001/api-docs` | Manage Students, Courses, and Enrollments with capacity & duplicate checks |
| **[Task 2](./task2-contact-management)** | `5002` | `http://localhost:5002/api-docs` | Secure contact management with company, address, duplicates, & stats |
| **[Task 3](./task3-todo-list)** | `5003` | `http://localhost:5003/api-docs` | To-Do API with JWT Auth, due dates, priority levels, & status tracking |

---

## Global Commands (Run from Root Directory)

### Run Automated Tests for All Tasks
```bash
npm run test:all
```

### Seed Demo Data for All Tasks
```bash
npm run seed:all
```

### Individual Task Start Commands
```bash
# Start Task 1 on http://localhost:5001
npm run start:task1

# Start Task 2 on http://localhost:5002
npm run start:task2

# Start Task 3 on http://localhost:5003
npm run start:task3
```

---

## Detailed Task Summaries

### Task 1: Student Record Management API
- **Relational Architecture**: `Student`, `Course`, and `Enrollment` models with foreign keys and unique composite indices.
- **Features**:
  - Full CRUD operations on Students, Courses, and Enrollments.
  - Relational queries: Find all courses for a student, and all students in a course.
  - Course capacity enforcement and duplicate enrollment prevention.
  - Pagination, field filtering (department, status, grade), and multi-field search.
  - Centralized error handling and Joi validation schemas.
- **Port**: `5001` | **Interactive Docs**: `http://localhost:5001/api-docs`

---

### Task 2: Contact Management System
- **Data Model**: Contact records with `firstName`, `lastName`, `email`, `phoneNumber`, full `address` (street, city, state, postalCode, country), and `company` (companyName, jobTitle, department).
- **Features**:
  - Duplicate detection: Prevents duplicate email or phone number across contacts.
  - Search across name, email, phone number, and company.
  - Category classification (`Personal`, `Professional`, `Family`, `Other`) and favorite marking.
  - Analytics endpoint (`/api/contacts/stats`) for dashboard metrics.
  - Pagination, sorting, and regex phone validation.
- **Port**: `5002` | **Interactive Docs**: `http://localhost:5002/api-docs`

---

### Task 3: To-Do List Backend (with Bonus Features)
- **Authentication**: JWT authentication with **bcrypt** password hashing (`/api/auth/register`, `/api/auth/login`, `/api/auth/profile`).
- **Features**:
  - Multi-tenant security: Users can only see and manipulate their own tasks.
  - Task completion toggle (`PATCH /api/tasks/:id/status`) with automatic `completedAt` timestamping.
  - Bonus fields implemented: `dueDate`, `priority` (`low`, `medium`, `high`, `urgent`), and `category` (`Work`, `Personal`, `Study`, `Health`, `Finance`, `Other`).
  - Search by title and description, filter by status, priority, and due date.
  - Productivity metrics endpoint (`/api/tasks/stats`) with completion percentages.
- **Port**: `5003` | **Interactive Docs**: `http://localhost:5003/api-docs`

---

## Verification & Automated Test Results

Each task contains its own dedicated test suite running against an in-memory SQLite database:
- **Task 1 Suite**: 11 unit/integration tests (`tests/api.test.js`)
- **Task 2 Suite**: 10 unit/integration tests (`tests/api.test.js`)
- **Task 3 Suite**: 9 unit/integration tests (`tests/api.test.js`)
- **Total**: 30 passing automated tests.
