const { Router } = require('express');
const UsersRouter = Router();
const User = require('../../database/models/User');
const Event = require('../../database/models/Event');
const Comment = require('../../database/models/Comment');
const Violation = require('../../database/models/Violation');
const Rating = require('../../database/models/Rating');
const logger = require('../../services/logger');

// GET /users/dashboard - Gibt eine Übersicht von Events, Ratings, Comments und Violations des angemeldeten Benutzers zurück.✅
UsersRouter.get('/dashboard', async (req, res) => {
  const userId = req.user.id; // Extrahiere die User-ID aus dem Token

  // Logge die User-ID
  logger.info(
    `GET /users/dashboard - UserID: ${userId} - Anforderung empfangen`
  );

  try {
    // Datenbank-Abfragen für Events, Ratings, Kommentare und Verstöße
    const [events, ratings, comments, violations] = await Promise.all([
      Event.findAll({ where: { user_id: userId } }),
      Rating.findAll({ where: { user_id: userId } }),
      Comment.findAll({ where: { user_id: userId } }),
      Violation.findAll({ where: { reported_by: userId } }),
    ]);

    // Logge die Anzahl der gefundenen Einträge
    logger.info(
      `GET /users/dashboard - UserID: ${userId} angeforderte Dashboard-Daten. Events: ${events.length}, Ratings: ${ratings.length}, Comments: ${comments.length}, Violations: ${violations.length}`
    );

    // Überprüfe, ob keine Daten gefunden wurden und logge dies entsprechend
    if (
      events.length === 0 &&
      ratings.length === 0 &&
      comments.length === 0 &&
      violations.length === 0
    ) {
      logger.info(
        `GET /users/dashboard - UserID: ${userId} hat keine Dashboard-Daten.`
      );
    }

    // Sende die Daten als Antwort zurück
    res.json({
      events,
      ratings,
      comments,
      violations,
    });
  } catch (error) {
    // Protokolliere den Fehler und sende eine Antwort
    logger.error(
      `Error fetching dashboard data for user ${userId}: ${error.message}`
    );
    res.status(500).send('Server Error');
  }
});

// GET /users/profile - Abrufen der Profilinformationen des angemeldeten Benutzers✅
UsersRouter.get('/profile', async (req, res) => {
  const userId = req.user.id; // Extrahiere die User-ID aus dem Token

  try {
    // Datenbank-Abfrage für Benutzerprofil
    const user = await User.findByPk(userId);

    if (!user) {
      logger.info(`GET /users/profile - UserID: ${userId} not found`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Logge, dass Daten gefunden wurden
    logger.info(`GET /users/profile - UserID: ${userId} profile data found`);

    // Sende die Benutzerprofil-Daten als Antwort zurück
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
    });
  } catch (error) {
    // Protokolliere den Fehler und sende eine Antwort
    logger.error(
      `GET /users/profile - Error for UserID ${userId}: ${error.message}`
    );
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /users/events - Abrufen aller Events des angemeldeten Benutzers✅
UsersRouter.get('/events', async (req, res) => {
  const userId = req.user.id; // Extrahiere die User-ID aus dem Token

  try {
    // Datenbank-Abfrage für alle Events des Benutzers
    const events = await Event.findAll({ where: { user_id: userId } });

    // Logge die Anzahl der gefundenen Events
    logger.info(
      `GET /users/events - UserID: ${userId} - Found ${events.length} events`
    );

    // Sende die Events als Antwort zurück
    res.json(events);
  } catch (error) {
    // Protokolliere den Fehler und sende eine Antwort
    logger.error(
      `GET /users/events - Error for UserID ${userId}: ${error.message}`
    );
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /users/events/create - Erstellen eines neuen Events durch den Benutzer✅
UsersRouter.post('/events/create', async (req, res) => {
  const userId = req.user.id; // Extrahiere die User-ID aus dem Token
  const { title, description, date, image } = req.body;

  // Überprüfen, ob alle erforderlichen Felder bereitgestellt wurden
  if (!title || !description || !date || !image) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Erstellen eines neuen Events in der Datenbank
    const newEvent = await Event.create({
      userId,
      title,
      description,
      date,
      image,
    });

    // Logge die Erstellung des neuen Events
    logger.info(
      `POST /users/events/create - UserID: ${userId} - Created event with ID ${newEvent.id}`
    );

    // Sende die ID des neu erstellten Events als Antwort zurück
    res.status(201).json({ eventId: newEvent.id });
  } catch (error) {
    // Protokolliere den Fehler und sende eine Antwort
    logger.error(
      `POST /users/events/create - Error for UserID ${userId}: ${error.message}`
    );
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT /users/events/update - Bearbeiten eines Events, das der Benutzer erstellt hat✅
UsersRouter.put('/events/update', async (req, res) => {
  const userId = req.user.id; // Extrahiere die User-ID aus dem Token
  const { id, title, description, date, image } = req.body; // Die ID des zu bearbeitenden Events und die neuen Daten

  // Überprüfen, ob die ID des Events bereitgestellt wurde
  if (!id) {
    return res.status(400).json({ message: 'Event ID is required' });
  }

  // Überprüfen, ob alle erforderlichen Felder bereitgestellt wurden
  if (!title && !description && !date && !image) {
    return res
      .status(400)
      .json({ message: 'At least one field to update is required' });
  }

  try {
    // Finden des Events basierend auf der ID und der User-ID
    const event = await Event.findOne({
      where: {
        id,
        user_id: userId,
      },
    });

    // Überprüfen, ob das Event existiert und ob der Benutzer der Ersteller ist
    if (!event) {
      logger.info(
        `PUT /users/events/update - Event with ID ${id} not found or UserID ${userId} is not the creator`
      );
      return res
        .status(404)
        .json({ message: 'Event not found or User is not the creator' });
    }

    // Aktualisieren des Events mit den bereitgestellten Daten
    const updatedEvent = await event.update({
      title: title || event.title,
      description: description || event.description,
      date: date || event.date,
      image: image || event.image,
    });

    // Logge die Aktualisierung des Events
    logger.info(
      `PUT /users/events/update - UserID: ${userId} - Updated event with ID ${updatedEvent.id}`
    );

    // Sende eine Bestätigung der Aktualisierung als Antwort zurück
    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    // Protokolliere den Fehler und sende eine Antwort
    logger.error(
      `PUT /users/events/update - Error for UserID ${userId}: ${error.message}`
    );
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE /users/events/delete - Löschen eines Events durch den Benutzer✅
UsersRouter.delete('/events/delete', async (req, res) => {
  const userId = req.user.id; // Extrahiere die User-ID aus dem Token
  const { eventId } = req.body; // Die Event-ID wird im Body übergeben

  try {
    // Finde das Event und überprüfe, ob es dem Benutzer gehört
    const event = await Event.findOne({
      where: { id: eventId, userId: userId },
    });

    if (!event) {
      return res
        .status(404)
        .json({ message: 'Event not found or unauthorized' });
    }

    // Lösche das Event
    await event.destroy();

    // Logge das Löschen des Events
    logger.info(
      `DELETE /users/events/delete - UserID: ${userId} - Deleted event with ID ${eventId}`
    );

    // Bestätige das Löschen
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    // Fehlerprotokollierung
    logger.error(
      `DELETE /users/events/delete - Error for UserID ${userId}: ${error.message}`
    );
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /users/events/rate - Hinzufügen einer Bewertung zu einem Event
UsersRouter.post('/events/rate', async (req, res) => {
  const userId = req.user.id; // Extrahiere die User-ID aus dem Token
  const { eventId, rating } = req.body;

  // Überprüfen, ob alle erforderlichen Felder bereitgestellt wurden
  if (!eventId || !rating) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Überprüfen, ob die Bewertung im gültigen Bereich ist
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    // Überprüfen, ob das Event existiert
    const event = await Event.findByPk(eventId);
    if (!event) {
      // Logge den Fehler, wenn das Event nicht gefunden wird
      logger.info(`POST /users/events/rate - EventID ${eventId} not found`);
      return res.status(404).json({ message: 'Event not found' });
    }

    // Überprüfen, ob der Benutzer bereits eine Bewertung für dieses Event abgegeben hat
    const existingRating = await Rating.findOne({
      where: { eventId, userId },
    });

    if (existingRating) {
      // Logge, wenn der Benutzer bereits bewertet hat
      logger.info(
        `POST /users/events/rate - UserID ${userId} has already rated EventID ${eventId}`
      );
      return res
        .status(400)
        .json({ message: 'You have already rated this event' });
    }

    // Erstellen einer neuen Bewertung in der Datenbank
    await Rating.create({
      eventId,
      userId,
      rating,
    });

    // Logge die Erstellung der neuen Bewertung
    logger.info(
      `POST /users/events/rate - UserID: ${userId} - Added rating ${rating} for EventID ${eventId}`
    );

    // Sende eine Bestätigung der Bewertung als Antwort zurück
    res.status(201).json({ message: 'Rating added successfully' });
  } catch (error) {
    // Protokolliere den Fehler und sende eine Antwort
    logger.error(
      `POST /users/events/rate - Error for UserID ${userId} for EventID ${eventId}: ${error.message}`
    );
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = { UsersRouter };
