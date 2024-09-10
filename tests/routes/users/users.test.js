// tests/routes/users/users.test.js
const request = require('supertest');
const app = require('../../../index');
const User = require('../../../database/models/User');
const Event = require('../../../database/models/Event');
const Rating = require('../../../database/models/Rating');
const Comment = require('../../../database/models/Comment');
describe('User Routes', () => {
  let token;
  let eventId;

  beforeAll(async () => {
    // Erstelle den Testbenutzer
    await User.create({
      email: 'testuser2@example.com',
      password: 'Test1234!',
      // Weitere erforderliche Felder
    });

    // Login für den Testbenutzer
    const loginResponse = await request(app)
      .post('/auth/login') // Dein Login-Endpunkt
      .send({
        email: 'testuser1@example.com',
        password: 'Test1234!',
      });

    token = loginResponse.body.token; // Token für die Authentifizierung

    // Erstelle ein Test-Event
    const event = await Event.create({
      title: 'Test Event',
      description: 'This is a test event.',
      date: new Date(),
      image: 'test.jpg',
      // Weitere erforderliche Felder
    });

    eventId = event.id;
  });

  // Test für die POST /users/events/rate Route
  test('should add a rating for an event', async () => {
    const response = await request(app)
      .post('/users/events/rate')
      .set('Authorization', `Bearer ${token}`)
      .send({ eventId, rating: 5 });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Rating added successfully');
  });

  // Test für die POST /users/events/comment Route
  test('should add a comment to an event', async () => {
    const response = await request(app)
      .post('/users/events/comment')
      .set('Authorization', `Bearer ${token}`)
      .send({ eventId, comment: 'Great event!' });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Comment added successfully');
  });

  // Test für die GET /users/events/event-feedback Route
  test('should fetch ratings for an event', async () => {
    await Rating.create({ eventId, userId: 1, rating: 4 }); // Ersetze 1 mit der tatsächlichen User-ID
    await Rating.create({ eventId, userId: 1, rating: 5 }); // Ersetze 1 mit der tatsächlichen User-ID

    const response = await request(app)
      .get('/users/events/event-feedback')
      .set('Authorization', `Bearer ${token}`)
      .send({ eventId });

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2); // Anzahl der Bewertungen prüfen
  });

  // Weitere Tests hinzufügen

  afterAll(async () => {
    // Bereinige die Testdaten
    await User.destroy({ where: { email: 'testuser1@example.com' } });
    await Event.destroy({ where: { id: eventId } });
    await Rating.destroy({ where: { eventId } });
    await Comment.destroy({ where: { eventId } });
  });
});

