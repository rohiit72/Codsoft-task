const test = require('node:test');
const assert = require('node:assert');
const http = require('http');

process.env.NODE_ENV = 'test';
process.env.DB_STORAGE = ':memory:';
process.env.JWT_SECRET = 'test_secret_key_123';

const app = require('../src/app');
const { sequelize } = require('../src/models');

let server;
let baseUrl;
let authToken;
let createdTaskId;

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

test('Task 3 To-Do List API Suite', async (t) => {
  await t.test('POST /api/auth/register should create a new user and return JWT', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alex Mercer',
        email: 'alex@example.com',
        password: 'Password123!'
      })
    });

    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.data.token);
    assert.strictEqual(body.data.user.email, 'alex@example.com');
    assert.strictEqual(typeof body.data.user.password, 'undefined'); // password stripped
    authToken = body.data.token;
  });

  await t.test('POST /api/auth/login should authenticate user with correct credentials', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alex@example.com',
        password: 'Password123!'
      })
    });

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.ok(body.data.token);
  });

  await t.test('GET /api/tasks should reject requests without Bearer token', async () => {
    const res = await fetch(`${baseUrl}/api/tasks`);
    assert.strictEqual(res.status, 401);
  });

  await t.test('POST /api/tasks should create a task with bonus fields (due date, priority, category)', async () => {
    const payload = {
      title: 'Prepare final internship report',
      description: 'Document Task 1, 2, and 3 architectures and testing results',
      priority: 'urgent',
      category: 'Work',
      dueDate: '2026-11-10',
      status: 'pending'
    };

    const res = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    });

    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.title, payload.title);
    assert.strictEqual(body.data.priority, 'urgent');
    assert.strictEqual(body.data.category, 'Work');
    createdTaskId = body.data.id;
  });

  await t.test('GET /api/tasks should retrieve tasks with search, filter, and pagination', async () => {
    const res = await fetch(`${baseUrl}/api/tasks?search=report&status=pending&priority=urgent`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.length, 1);
    assert.strictEqual(body.data[0].id, createdTaskId);
  });

  await t.test('PATCH /api/tasks/:id/status should mark task as completed and set completedAt', async () => {
    const res = await fetch(`${baseUrl}/api/tasks/${createdTaskId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ status: 'completed' })
    });

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.data.status, 'completed');
    assert.ok(body.data.completedAt !== null);
  });

  await t.test('GET /api/tasks/stats should return task analytics', async () => {
    const res = await fetch(`${baseUrl}/api/tasks/stats`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.totalTasks, 1);
    assert.strictEqual(body.data.completedTasks, 1);
    assert.strictEqual(body.data.completionRate, '100%');
  });

  await t.test('DELETE /api/tasks/:id should delete task', async () => {
    const res = await fetch(`${baseUrl}/api/tasks/${createdTaskId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    assert.strictEqual(res.status, 200);

    const getRes = await fetch(`${baseUrl}/api/tasks/${createdTaskId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    assert.strictEqual(getRes.status, 404);
  });
});
