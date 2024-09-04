// tests/routes/ratings/ratings.test.js
const request = require('supertest');
const app = require('../../../index');

describe('GET /api-ford-fiesta/ratings/all', () => {
  test('sollte eine Liste von Bewertungen mit Status 200 zurückgeben', async () => {
    const { body: ratings } = await request(app)
      .get('/api-ford-fiesta/ratings/all')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(ratings)).toBe(true);
  });
});

describe('GET /api-ford-fiesta/ratings/all (Fehlerfälle)', () => {
  test('sollte 404 für eine ungültige Route zurückgeben', async () => {
    await request(app).get('/api-ford-fiesta/ratings/invalidroute').expect(404);
  });
});
