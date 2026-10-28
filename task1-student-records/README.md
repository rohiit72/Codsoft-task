# Task 1: Student Record Management API

A robust RESTful backend application built with **Node.js, Express.js, Sequelize ORM, and SQLite** for managing student records, course information, and student enrollments.

---

## Features
- **Relational Data Architecture**: Models for `Student`, `Course`, and `Enrollment` with cascading relationships and unique constraints.
- **Full CRUD Support**: Complete endpoints for students, courses, and student enrollments.
- **Relational Queries**: Query courses a student is enrolled in, and retrieve all students enrolled in a specific course.
- **Capacity & Duplicate Protection**: Enforces course max capacity limits and prevents duplicate enrollments.
- **Search, Filter, Sort, & Pagination**:
  - Filter by department, status, enrollment year, credits, grades.
  - Search across names, student ID, email, course title, course code, instructor.
  - Configurable sorting (`sortBy`, `sortOrder`).
  - Standardized pagination metadata (`totalItems`, `totalPages`, `currentPage`, `hasNextPage`, `hasPrevPage`).
- **Input Validation**: Comprehensive schema validation using **Joi** before database execution.
- **Interactive Documentation**: Swagger UI served at `/api-docs`.
- **Automated Testing**: Built-in test suite covering creation, validations, filtering, relational querying, and deletions.

---

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: SQLite (zero-config, portable)
- **Validation**: Joi
- **Documentation**: Swagger UI & OpenAPI 3.0
- **Testing**: Node Native Test Runner (`node:test`)

---

## Installation & Setup

1. **Navigate to Task 1 directory:**
   ```bash
   cd task1-student-records
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **(Optional) Seed sample data:**
   Populates 5 courses, 5 students, and enrollments:
   ```bash
   npm run seed
   ```

4. **Start the server:**
   ```bash
   npm start
   ```
   Or in development mode with hot-reloading:
   ```bash
   npm run dev
   ```

5. **Run test suite:**
   ```bash
   npm test
   ```

---

## API Documentation (Swagger)

Once the server is running, open your browser and navigate to:
```
http://localhost:5001/api-docs
```

---

## API Endpoints Summary

### Students (`/api/students`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/students` | Create new student |
| `GET` | `/api/students` | Get all students (search, filter, sort, paginate) |
| `GET` | `/api/students/:id` | Get student details by ID with enrolled courses |
| `PUT` | `/api/students/:id` | Update student details |
| `DELETE` | `/api/students/:id` | Delete student and cascade enrollments |
| `GET` | `/api/students/:id/enrollments` | Get all enrollments for a specific student |

### Courses (`/api/courses`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/courses` | Create new course |
| `GET` | `/api/courses` | Get all courses (search, filter, sort, paginate) |
| `GET` | `/api/courses/:id` | Get course details with enrolled students |
| `PUT` | `/api/courses/:id` | Update course details |
| `DELETE` | `/api/courses/:id` | Delete course |
| `GET` | `/api/courses/:id/students` | Get all students enrolled in course |

### Enrollments (`/api/enrollments`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/enrollments` | Enroll student into course (validates capacity & duplicates) |
| `GET` | `/api/enrollments` | List enrollments with filters & pagination |
| `GET` | `/api/enrollments/:id` | Get single enrollment details |
| `PUT` | `/api/enrollments/:id` | Update grade or status |
| `DELETE` | `/api/enrollments/:id` | Drop / delete enrollment |

---

## Example Requests

### 1. Create a Student
```bash
curl -X POST http://localhost:5001/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "studentIdNumber": "STU2001",
    "firstName": "Ada",
    "lastName": "Lovelace",
    "email": "ada.lovelace@university.edu",
    "phone": "+1-555-0199",
    "dateOfBirth": "2003-12-10",
    "department": "Computer Science",
    "enrollmentYear": 2024,
    "status": "Active"
  }'
```

### 2. Search Students
```bash
curl "http://localhost:5001/api/students?search=Ada&department=Computer%20Science&page=1&limit=10"
```

### 3. Enroll Student into Course
```bash
curl -X POST http://localhost:5001/api/enrollments \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "courseId": 2,
    "grade": "Pending",
    "status": "Enrolled"
  }'
```
