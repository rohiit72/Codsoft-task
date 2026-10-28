# Task 3: To-Do List & Task Management Backend API

A secure, full-featured Task Management REST API built with **Node.js, Express.js, Sequelize ORM, SQLite, and JWT Authentication**.

---

## Features
- **User Authentication (Bonus)**:
  - Secure registration and login with **bcrypt** password hashing.
  - Stateless authentication via **JSON Web Tokens (JWT)**.
  - Multi-tenant task isolation (users only access and manage their own tasks).
- **Comprehensive Task Model**:
  - `title`, `description`
  - `status`: `pending`, `in-progress`, `completed`
  - `priority`: `low`, `medium`, `high`, `urgent` (Bonus)
  - `category`: `Work`, `Personal`, `Study`, `Health`, `Finance`, `Other` (Bonus)
  - `dueDate`: ISO date format (Bonus)
  - `completedAt`: automatically populated when marked as completed
- **CRUD & Status Transitions**:
  - Create, view, update, delete tasks.
  - Dedicated lightweight status toggle endpoint (`PATCH /api/tasks/:id/status`).
- **Search, Filter, Sort, & Pagination**:
  - Full-text search across titles and descriptions.
  - Filter by `status`, `priority`, `category`, `dueDate`.
  - Configurable sorting and paginated metadata.
- **Metrics Dashboard**: `/api/tasks/stats` with completion rates and priority counts.
- **Interactive Documentation**: Swagger UI served at `/api-docs` with JWT Bearer auth support.
- **Automated Tests**: Unit and integration test suite (`node:test`).

---

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: SQLite
- **Security**: bcryptjs & jsonwebtoken
- **Validation**: Joi
- **Documentation**: Swagger UI & OpenAPI 3.0
- **Testing**: Node Native Test Runner (`node:test`)

---

## Installation & Setup

1. **Navigate to Task 3 directory:**
   ```bash
   cd task3-todo-list
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **(Optional) Seed demo user and initial tasks:**
   Creates `demo@codsoft.dev` (password: `password123`) with 5 tasks:
   ```bash
   npm run seed
   ```

4. **Start the server:**
   ```bash
   npm start
   ```
   Or in development mode:
   ```bash
   npm run dev
   ```

5. **Run test suite:**
   ```bash
   npm test
   ```

---

## API Documentation (Swagger)

Once the server is running, navigate to:
```
http://localhost:5003/api-docs
```
You can authorize using your JWT token in the Swagger UI by clicking the **Authorize** button and typing `Bearer <token>`.

---

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user and get JWT token |
| `POST` | `/api/auth/login` | Login with email and password |
| `GET` | `/api/auth/profile` | Get authenticated user profile |

### Tasks (`/api/tasks`) *(All require `Authorization: Bearer <token>`)*
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/tasks` | Create a new task |
| `GET` | `/api/tasks` | Get user tasks (search, filter, sort, paginate) |
| `GET` | `/api/tasks/:id` | Get task details by ID |
| `PUT` | `/api/tasks/:id` | Update task details |
| `PATCH` | `/api/tasks/:id/status` | Mark task as `pending`, `in-progress`, or `completed` |
| `DELETE` | `/api/tasks/:id` | Delete task |
| `GET` | `/api/tasks/stats` | Get task completion stats and distribution |
| `GET` | `/api/health` | Health check endpoint |

---

## Example Requests

### 1. Register User
```bash
curl -X POST http://localhost:5003/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123!"
  }'
```

### 2. Create Task (with Token)
```bash
curl -X POST http://localhost:5003/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Build CodSoft Backend Tasks",
    "description": "Develop and verify tasks 1, 2, and 3",
    "priority": "urgent",
    "category": "Work",
    "dueDate": "2026-11-01"
  }'
```

### 3. Mark Task as Completed
```bash
curl -X PATCH http://localhost:5003/api/tasks/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{ "status": "completed" }'
```
