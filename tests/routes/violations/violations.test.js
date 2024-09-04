// tests/routes/violations/violations.test.js
const request = require('supertest');
const app = require('../../../index');

describe('GET /api-ford-fiesta/violations/all', () => {
  test('sollte eine Liste von Verstößen mit Status 200 zurückgeben', async () => {
    const { body: violations } = await request(app)
      .get('/api-ford-fiesta/violations/all')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(violations)).toBe(true);
  });
});

describe('GET /api-ford-fiesta/violations/all (Fehlerfälle)', () => {
  test('sollte 404 für eine ungültige Route zurückgeben', async () => {
    await request(app)
      .get('/api-ford-fiesta/violations/invalidroute')
      .expect(404);
  });
});
