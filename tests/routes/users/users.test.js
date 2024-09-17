const request = require('supertest');
const app = require('../../../index'); // Pfad zu deiner Express-Anwendung
const jwt = require('jsonwebtoken'); // Zum Dekodieren des Tokens

describe('Benutzer-Routen', () => {
  let token;
  let eventId;
  let userId;

  beforeAll(async () => {
    // Benutzer registrieren
    const signupResponse = await request(app)
      .post('/api-ford-fiesta/auth/signup') // Registrierungs-Endpunkt
      .send({
        username: 'testuser14',
        email: 'testuser14@example.com',
        password: 'Test1234!',
      });

    expect(signupResponse.statusCode).toBe(201); // Überprüfe nur den Statuscode

    // Login für den Testbenutzer
    const loginResponse = await request(app)
      .post('/api-ford-fiesta/auth/login') // Login-Endpunkt
      .send({
        email: 'testuser14@example.com',
        password: 'Test1234!',
      });

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.token).toBeDefined();

    token = loginResponse.body.token;

    // Dekodiere das Token, um die Benutzer-ID zu extrahieren
    const decoded = jwt.decode(token);
    userId = decoded.id;

    // Erstelle ein Test-Event
    const eventResponse = await request(app)
      .post('/api-ford-fiesta/users/events/create') // Event-Erstellungs-Endpunkt
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Event',
        description: 'Dies ist ein Test-Event',
        date: new Date(),
        image: 'testimage.jpg',
        userId, // userId als Teil des Requests, wenn nötig
      });

    expect(eventResponse.statusCode).toBe(201);
    expect(eventResponse.body.eventId).toBeDefined();

    eventId = eventResponse.body.eventId;
  });

  test('sollte eine Bewertung für ein Event hinzufügen', async () => {
    const response = await request(app)
      .post('/api-ford-fiesta/users/events/rate') // Bewertung hinzufügen
      .set('Authorization', `Bearer ${token}`)
      .send({
        eventId,
        rating: 5,
        userId, // userId hinzufügen, falls die API dies benötigt
      });

    expect(response.statusCode).toBe(201); // Überprüfe nur den Statuscode
  });

  test('sollte einen Kommentar zu einem Event hinzufügen', async () => {
    const response = await request(app)
      .post('/api-ford-fiesta/users/events/comment') // Kommentar hinzufügen
      .set('Authorization', `Bearer ${token}`)
      .send({
        eventId,
        comment: 'Tolles Event!',
        userId, // userId hinzufügen, falls die API dies benötigt
      });

    expect(response.statusCode).toBe(201); // Überprüfe nur den Statuscode
  });
});
