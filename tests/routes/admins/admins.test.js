// tests/routes/admins/admins.test.js
const request = require('supertest');
const app = require('../../../index');

describe('GET /api-ford-fiesta/admins/admins', () => {
  test('sollte eine Liste von Admins mit Status 200 zurückgeben', async () => {
    const { body: admins } = await request(app)
      .get('/api-ford-fiesta/admins/admins')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(admins)).toBe(true);
  });
});

describe('GET /api-ford-fiesta/admins/users', () => {
  test('sollte eine Liste von allen Users mit Status 200 zurückgeben', async () => {
    const { body: admins } = await request(app)
      .get('/api-ford-fiesta/admins/users')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(admins)).toBe(true);
  });
});

describe('GET /api-ford-fiesta/admin/all (Fehlerfälle)', () => {
  test('sollte 404 für eine ungültige Route zurückgeben', async () => {
    await request(app).get('/api-ford-fiesta/admin/invalidroute').expect(404);
  });
});
