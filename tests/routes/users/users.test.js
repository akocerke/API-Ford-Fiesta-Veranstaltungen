// tests/routes/users/users.test.js
const request = require('supertest');
const app = require('../../../index');

describe('GET /api-ford-fiesta/users/all', () => {
  test('sollte eine Liste von Benutzern mit Status 200 zurückgeben', async () => {
    const { body: users } = await request(app)
      .get('/api-ford-fiesta/users/all')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(users)).toBe(true);
  });
});

describe('GET /api-ford-fiesta/users/all (Fehlerfälle)', () => {
  test('sollte 404 für eine ungültige Route zurückgeben', async () => {
    await request(app).get('/api-ford-fiesta/users/invalidroute').expect(404);
  });
});
