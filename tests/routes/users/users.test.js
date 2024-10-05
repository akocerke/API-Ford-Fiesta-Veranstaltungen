const request = require('supertest');
const app = require('../../../index'); // Pfad zu deiner Express-Anwendung
const jwt = require('jsonwebtoken'); // Zum Dekodieren des Tokens
console.log('hello from userstest', process.env.DB_NAME);
describe('Benutzer-Routen', () => {
  let token;
  let eventId;
  let userId;

  const testUser = {
    username: 'testuser0', // Eindeutiger Benutzername
    email: 'testuser0@example.com', // Eindeutige E-Mail
    password: 'Test1234!',
  };
  beforeAll(async () => {
    // Benutzer registrieren
    const signupResponse = await request(app)
      .post('/api-ford-fiesta/auth/signup') // Registrierungs-Endpunkt
      .send(testUser); // Verwendung der eindeutigen Benutzerdaten

    expect(signupResponse.statusCode).toBe(201);

    // Login für den Testbenutzer
    const loginResponse = await request(app)
      .post('/api-ford-fiesta/auth/login') // Login-Endpunkt
      .send({
        email: 'testuser18@example.com',
        password: 'Test1234!',
      });

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.token).toBeDefined();

    token = loginResponse.body.token;

    // Dekodiere das Token, um die Benutzer-ID zu extrahieren
    const decoded = jwt.decode(token);
    userId = decoded.id;

    // Erstelle ein Test-Event mit dem korrekten Payload
    const eventResponse = await request(app)
      .post('/api-ford-fiesta/users/events/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Event 6',
        description: 'This is a test event',
        date: '2024-12-25', // Stellt sicher, dass das Datum im richtigen Format ist
        imageFileName: 'test-image.jpg', // Benutze den richtigen Schlüssel
        imageFileType: 'image/jpeg', // Benutze den richtigen Typ
      });

    // Überprüfe, ob das Event erfolgreich erstellt wurde
    expect(eventResponse.statusCode).toBe(201);
    expect(eventResponse.body.eventId).toBeDefined();

    eventId = eventResponse.body.eventId; // Speichere die eventId für spätere Tests
  });

  test('sollte eine Bewertung für ein Event hinzufügen', async () => {
    const response = await request(app)
      .post('/api-ford-fiesta/users/events/rate') // Bewertung hinzufügen
      .set('Authorization', `Bearer ${token}`)
      .send({
        eventId,
        rating: 5,
        // userId,
      });

    // Überprüfe, ob die Bewertung erfolgreich hinzugefügt wurde
    expect(response.statusCode).toBe(201); // Statuscode 201 für erfolgreich
  });

  test('sollte einen Kommentar zu einem Event hinzufügen', async () => {
    const response = await request(app)
      .post('/api-ford-fiesta/users/events/comment') // Kommentar hinzufügen
      .set('Authorization', `Bearer ${token}`)
      .send({
        eventId,
        comment: 'Tolles Event!',
        // userId, // userId hinzufügen, falls die API dies benötigt
      });

    // Überprüfe, ob der Kommentar erfolgreich hinzugefügt wurde
    expect(response.statusCode).toBe(201); // Statuscode 201 für erfolgreich
  });
});
