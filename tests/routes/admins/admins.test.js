// tests/routes/admins/admins.test.js
const request = require('supertest');
const app = require('../../../index');

let token;

beforeAll(async () => {
  const res = await request(app)
    .post('/api-ford-fiesta/auth/login') // Pfad zum Login-Endpunkt
    .send({
      email: 'testuser7@example.com',
      password: 'Test1234!',
    });

  token = res.body.token; // Token aus der Login-Antwort speichern
});

describe('GET /api-ford-fiesta/admins/admins', () => {
  test('sollte eine Liste von Admins mit Status 200 zurückgeben', async () => {
    const { body: admins } = await request(app)
      .get('/api-ford-fiesta/admins/admins')
      .set('Authorization', `Bearer ${token}`) // Generierten Token setzen
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(admins)).toBe(true);
  });
});

describe('GET /api-ford-fiesta/admins/users', () => {
  test('sollte eine Liste von allen Users mit Status 200 zurückgeben', async () => {
    const { body: users } = await request(app)
      .get('/api-ford-fiesta/admins/users')
      .set('Authorization', `Bearer ${token}`) // Generierten Token setzen
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(users)).toBe(true);
  });
});

describe('GET /api-ford-fiesta/admin/all (Fehlerfälle)', () => {
  test('sollte 404 für eine ungültige Route zurückgeben', async () => {
    await request(app).get('/api-ford-fiesta/admin/invalidroute').expect(404);
  });
});

describe('GET /api-ford-fiesta/admins/dashboard - Zugriff als normaler User', () => {
  let userToken;

  // Vor den Tests: User-Token anfordern
  beforeAll(async () => {
    const res = await request(app).post('/api-ford-fiesta/auth/login').send({
      email: 'testuser14@example.com', // USER ROLE !!!!
      password: 'Test1234!',
    });

    userToken = res.body.token; // Speichere den Token
  });

  // Test: Zugriff eines normalen Benutzers auf das Admin-Dashboard
  test('sollte den Zugriff verweigern und Status 403 zurückgeben', async () => {
    const res = await request(app)
      .get('/api-ford-fiesta/admins/dashboard') // Überprüfe den vollständigen Pfad
      .set('Authorization', `Bearer ${userToken}`) // Setze den User-Token in den Header
      .expect(403); // Erwarte den Statuscode 403

    // Überprüfe die Fehlermeldung
    expect(res.body.message).toBe('Access denied: Admin rights required');
  });
});
