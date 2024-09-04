// tests/routes/events/events.test.js
const request = require('supertest');
const app = require('../../../index');

describe('GET /api-ford-fiesta/events/all', () => {
  test('sollte eine Liste von Events mit Status 200 zurückgeben', async () => {
    const { body: events } = await request(app)
      .get('/api-ford-fiesta/events/all')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(events)).toBe(true);
  });
});

describe('GET /api-ford-fiesta/events/all (Fehlerfälle)', () => {
  test('sollte 404 für eine ungültige Route zurückgeben', async () => {
    await request(app).get('/api-ford-fiesta/events/invalidroute').expect(404);
  });
});
