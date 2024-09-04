// tests/routes/comments/comments.test.js
const request = require('supertest');
const app = require('../../../index'); // Importieren Sie die Express-Anwendung

describe('GET /api-ford-fiesta/comments/all', () => {
  test('sollte eine Liste von Kommentaren zurückgeben', async () => {
    const response = await request(app)
      .get('/api-ford-fiesta/comments/all')
      .expect('Content-Type', /json/)
      .expect(200);

    const myComments = response.body;
    expect(Array.isArray(myComments)).toBe(true);
  });
});
