const test = require('node:test');
const assert = require('node:assert');
const http = require('http');

process.env.NODE_ENV = 'test';
process.env.DB_STORAGE = ':memory:';

const app = require('../src/app');
const { sequelize } = require('../src/models');

let server;
let baseUrl;

test.before(async () => {
  await sequelize.sync({ force: true });
  server = http.createServer(app);
  await new Promise((resolve) => {
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  if (sequelize) {
    await sequelize.close();
  }
});

test('Task 1 API Suite', async (t) => {
  let createdStudentId;
  let createdCourseId;
  let createdEnrollmentId;

  await t.test('GET / should return welcome message and endpoints', async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.documentation, '/api-docs');
  });

  await t.test('POST /api/students should validate and create a student', async () => {
    const payload = {
      studentIdNumber: 'TEST001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      phone: '+1-555-0100',
      dateOfBirth: '2002-05-15',
      department: 'Computer Science',
      enrollmentYear: 2023,
      status: 'Active'
    };

    const res = await fetch(`${baseUrl}/api/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.email, payload.email);
    createdStudentId = body.data.id;
  });

  await t.test('POST /api/students should reject duplicate email/student ID', async () => {
    const payload = {
      studentIdNumber: 'TEST001',
      firstName: 'Duplicate',
      lastName: 'User',
      email: 'john.doe@test.com',
      dateOfBirth: '2002-05-15',
      department: 'Computer Science',
      enrollmentYear: 2023
    };

    const res = await fetch(`${baseUrl}/api/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.strictEqual(res.status, 409);
    const body = await res.json();
    assert.strictEqual(body.success, false);
  });

  await t.test('GET /api/students should support search, filter, and pagination', async () => {
    const res = await fetch(`${baseUrl}/api/students?search=John&page=1&limit=5`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.length, 1);
    assert.strictEqual(body.pagination.totalItems, 1);
  });

  await t.test('POST /api/courses should create a course', async () => {
    const payload = {
      courseCode: 'CS101',
      title: 'Intro to Programming',
      description: 'Foundations of Computer Science',
      credits: 4,
      department: 'Computer Science',
      instructor: 'Dr. Alan Turing',
      maxCapacity: 2
    };

    const res = await fetch(`${baseUrl}/api/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.data.courseCode, 'CS101');
    createdCourseId = body.data.id;
  });

  await t.test('POST /api/enrollments should enroll student into course', async () => {
    const payload = {
      studentId: createdStudentId,
      courseId: createdCourseId
    };

    const res = await fetch(`${baseUrl}/api/enrollments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.studentId, createdStudentId);
    createdEnrollmentId = body.data.id;
  });

  await t.test('POST /api/enrollments should prevent duplicate enrollment', async () => {
    const payload = {
      studentId: createdStudentId,
      courseId: createdCourseId
    };

    const res = await fetch(`${baseUrl}/api/enrollments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.strictEqual(res.status, 409);
  });

  await t.test('GET /api/students/:id/enrollments should retrieve enrollments for student', async () => {
    const res = await fetch(`${baseUrl}/api/students/${createdStudentId}/enrollments`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.data.enrollments.length, 1);
  });

  await t.test('PUT /api/enrollments/:id should update grade and status', async () => {
    const res = await fetch(`${baseUrl}/api/enrollments/${createdEnrollmentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grade: 'A', status: 'Completed' })
    });

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.data.grade, 'A');
    assert.strictEqual(body.data.status, 'Completed');
  });

  await t.test('DELETE /api/students/:id should delete student and cascade enrollments', async () => {
    const res = await fetch(`${baseUrl}/api/students/${createdStudentId}`, {
      method: 'DELETE'
    });
    assert.strictEqual(res.status, 200);

    const getRes = await fetch(`${baseUrl}/api/students/${createdStudentId}`);
    assert.strictEqual(getRes.status, 404);
  });
});
