# Task 2: Contact Management System API

A secure, scalable RESTful API built with **Node.js, Express.js, Sequelize ORM, and SQLite** for managing personal and professional contacts with address and company information.

---

## Features
- **Comprehensive Contact Model**:
  - Name: `firstName`, `lastName`
  - Contact: `email`, `phoneNumber` (with unique constraints)
  - Address: `street`, `city`, `state`, `postalCode`, `country`
  - Company: `companyName`, `jobTitle`, `department`
  - Classification: `category` (`Personal`, `Professional`, `Family`, `Other`), `isFavorite`, `notes`
- **Duplicate Prevention**: Rejects duplicate contacts sharing the same email or phone number.
- **Search & Filtering**:
  - Unified search parameter across `firstName`, `lastName`, `email`, `phoneNumber`, and `companyName`.
  - Filter by `category`, `companyName`, `city`, and `isFavorite`.
- **Sorting & Pagination**:
  - Paginated responses (`page`, `limit`, `totalPages`, `totalItems`).
  - Sort by any supported field (`sortBy`, `sortOrder`).
- **Input Validation**: Joi-powered schema validation with custom regex for phone numbers.
- **Metrics & Analytics**: `/api/contacts/stats` endpoint for category counts and favorites.
- **Interactive Documentation**: Swagger UI served at `/api-docs`.
- **Automated Tests**: Unit and integration test suite (`node:test`).

---

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: SQLite
- **Validation**: Joi
- **Documentation**: Swagger UI & OpenAPI 3.0
- **Testing**: Node Native Test Runner (`node:test`)

---

## Installation & Setup

1. **Navigate to Task 2 directory:**
   ```bash
   cd task2-contact-management
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **(Optional) Seed sample contacts:**
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

5. **Run tests:**
   ```bash
   npm test
   ```

---

## API Documentation (Swagger)

Once the server is running, navigate to:
```
http://localhost:5002/api-docs
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/contacts` | Create a new contact (prevents duplicate email/phone) |
| `GET` | `/api/contacts` | Retrieve contacts (search, filter, sort, paginate) |
| `GET` | `/api/contacts/:id` | Get contact by ID |
| `PUT` | `/api/contacts/:id` | Update contact information |
| `DELETE` | `/api/contacts/:id` | Delete contact |
| `GET` | `/api/contacts/stats` | Retrieve contact metrics and category breakdown |
| `GET` | `/api/health` | Health check endpoint |

---

## Example Requests

### 1. Create a Contact
```bash
curl -X POST http://localhost:5002/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Tony",
    "lastName": "Stark",
    "email": "tony@starkindustries.com",
    "phoneNumber": "+1-555-3000",
    "companyName": "Stark Industries",
    "jobTitle": "Chief Executive Officer",
    "category": "Professional",
    "isFavorite": true
  }'
```

### 2. Search Contacts
```bash
curl "http://localhost:5002/api/contacts?search=Stark&page=1&limit=10"
```

### 3. Update a Contact
```bash
curl -X PUT http://localhost:5002/api/contacts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "isFavorite": true,
    "jobTitle": "Chief Technology Officer"
  }'
```
