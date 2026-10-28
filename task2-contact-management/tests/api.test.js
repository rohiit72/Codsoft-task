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

test('Task 2 Contact Management API Suite', async (t) => {
  let createdContactId;

  await t.test('GET / should return welcome message and documentation path', async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.documentation, '/api-docs');
  });

  await t.test('POST /api/contacts should create a new contact with full details', async () => {
    const payload = {
      firstName: 'Diana',
      lastName: 'Prince',
      email: 'diana.prince@themiscira.gov',
      phoneNumber: '+1-555-7788',
      street: '100 Museum Way',
      city: 'Washington',
      state: 'DC',
      postalCode: '20001',
      country: 'USA',
      companyName: 'Smithsonian Institute',
      jobTitle: 'Curator',
      department: 'Antiquities',
      category: 'Professional',
      isFavorite: true,
      notes: 'Antiquity and archaeology specialist.'
    };

    const res = await fetch(`${baseUrl}/api/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.email, payload.email);
    assert.strictEqual(body.data.companyName, payload.companyName);
    createdContactId = body.data.id;
  });

  await t.test('POST /api/contacts should prevent duplicate contact by email or phone', async () => {
    const duplicatePayload = {
      firstName: 'Clone',
      lastName: 'Prince',
      email: 'diana.prince@themiscira.gov',
      phoneNumber: '+1-555-9999'
    };

    const res = await fetch(`${baseUrl}/api/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(duplicatePayload)
    });

    assert.strictEqual(res.status, 409);
    const body = await res.json();
    assert.strictEqual(body.success, false);
  });

  await t.test('POST /api/contacts should validate invalid phone format', async () => {
    const invalidPayload = {
      firstName: 'Invalid',
      lastName: 'User',
      email: 'valid@example.com',
      phoneNumber: 'abc'
    };

    const res = await fetch(`${baseUrl}/api/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidPayload)
    });

    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.success, false);
  });

  await t.test('GET /api/contacts should support searching by name, email, phone, or company', async () => {
    const res = await fetch(`${baseUrl}/api/contacts?search=Smithsonian&page=1&limit=10`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.length, 1);
    assert.strictEqual(body.data[0].firstName, 'Diana');
    assert.strictEqual(body.pagination.totalItems, 1);
  });

  await t.test('GET /api/contacts/stats should return aggregate analytics', async () => {
    const res = await fetch(`${baseUrl}/api/contacts/stats`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.totalContacts, 1);
    assert.strictEqual(body.data.totalFavorites, 1);
  });

  await t.test('GET /api/contacts/:id should return single contact details', async () => {
    const res = await fetch(`${baseUrl}/api/contacts/${createdContactId}`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.data.id, createdContactId);
  });

  await t.test('PUT /api/contacts/:id should update contact details', async () => {
    const res = await fetch(`${baseUrl}/api/contacts/${createdContactId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobTitle: 'Chief Cultural Officer' })
    });

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.data.jobTitle, 'Chief Cultural Officer');
  });

  await t.test('DELETE /api/contacts/:id should delete contact', async () => {
    const res = await fetch(`${baseUrl}/api/contacts/${createdContactId}`, {
      method: 'DELETE'
    });

    assert.strictEqual(res.status, 200);

    const getRes = await fetch(`${baseUrl}/api/contacts/${createdContactId}`);
    assert.strictEqual(getRes.status, 404);
  });
});
