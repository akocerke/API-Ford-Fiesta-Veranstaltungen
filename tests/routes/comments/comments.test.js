// tests/routes/comments/comments.test.js
const request = require('supertest');
const app = require('../../../index');

describe('GET /api-ford-fiesta/comments/all', () => {
  test('sollte eine Liste von Kommentaren mit Status 200 zurückgeben', async () => {
    const { body: comments } = await request(app)
      .get('/api-ford-fiesta/comments/all')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(comments)).toBe(true);
  });
});

describe('GET /api-ford-fiesta/comments/all (Fehlerfälle)', () => {
  test('sollte 404 für eine ungültige Route zurückgeben', async () => {
    await request(app)
      .get('/api-ford-fiesta/comments/invalidroute')
      .expect(404);
  });
});
