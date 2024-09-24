const { Router } = require('express');
const UsersRouter = Router();
const User = require('../../database/models/User');
const Event = require('../../database/models/Event');
const Comment = require('../../database/models/Comment');
const Violation = require('../../database/models/Violation');
const Rating = require('../../database/models/Rating');
const logger = require('../../services/logger');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({ region: 'eu-central-1' });
const bucketName = 'fordfiestabucket';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

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

// PUT /users/profile - Profile Daten ändern [username, email] des angemeldeten Benutzers
UsersRouter.put('/profile', async (req, res) => {
  const userId = req.user.id; // Extrahiere die User-ID aus dem Token
  const { username, email } = req.body;

  try {
    // Datenbank-Abfrage für den aktuellen Benutzer
    const user = await User.findByPk(userId);

    if (!user) {
      logger.info(`PUT /users/profile - UserID: ${userId} not found`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Überprüfen, ob der neue Benutzername bereits verwendet wird
    const existingUserWithUsername = await User.findOne({
      where: {
        username: username,
      },
    });

    if (existingUserWithUsername && existingUserWithUsername.id !== userId) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // Überprüfen, ob die neue E-Mail-Adresse bereits verwendet wird
    const existingUserWithEmail = await User.findOne({
      where: {
        email: email,
      },
    });

    if (existingUserWithEmail && existingUserWithEmail.id !== userId) {
      return res.status(400).json({ message: 'Email is already taken' });
    }

    // Benutzer-Daten aktualisieren
    user.username = username;
    user.email = email;
    await user.save();

    // Erfolgreiche Aktualisierung protokollieren
    logger.info(
      `PUT /users/profile - UserID: ${userId} profile updated successfully`
    );
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    // Fehler protokollieren
    logger.error(
      `PUT /users/profile - Error for UserID ${userId}: ${error.message}`
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
  const userId = req.user.id;
  const { title, description, date, imageFileName, imageFileType } = req.body;

  if (!title || !description || !date || !imageFileName || !imageFileType) {
    return res
      .status(400)
      .json({ success: false, message: 'Missing required fields' });
  }

  const uniqueFileName = `${uuidv4()}-${imageFileName}`;
  const params = {
    Bucket: bucketName,
    Key: uniqueFileName,
    Expires: 60 * 5,
    ContentType: imageFileType,
  };

  try {
    const uploadUrl = s3.getSignedUrl('putObject', params);

    const newEvent = await Event.create({
      userId,
      title,
      description,
      date,
      image: uniqueFileName,
    });

    logger.info(
      `POST /users/events/create - UserID: ${userId} - Created event with ID ${newEvent.id}`
    );

    // Erfolgreiche Antwort mit Event-ID und Upload-URL
    return res.status(201).json({
      success: true,
      message: 'Event erfolgreich erstellt',
      eventId: newEvent.id,
      uploadUrl,
    });
  } catch (error) {
    logger.error(
      `POST /users/events/create - Error for UserID ${userId}: ${error.message}`
    );

    // Fehlermeldung zurücksenden
    return res.status(500).json({
      success: false,
      message: 'Server Error: Unable to create event',
    });
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

// POST /users/events/rate - Hinzufügen einer Bewertung zu einem Event✅
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
        .json({ message: 'Du hast diese Veranstaltung bereits bewertet' });
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
    res.status(201).json({ message: 'Bewertung erfolgreich hinzugefügt' });
  } catch (error) {
    // Protokolliere den Fehler und sende eine Antwort
    logger.error(
      `POST /users/events/rate - Error for UserID ${userId} for EventID ${eventId}: ${error.message}`
    );
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /users/events/comment - Hinzufügen eines Kommentars zu einem Event✅
UsersRouter.post('/events/comment', async (req, res) => {
  const userId = req.user.id; // Extrahiere die User-ID aus dem Token
  const { eventId, comment } = req.body; // Extrahiere die Event-ID und den Kommentar aus dem Body

  // Überprüfen, ob alle erforderlichen Felder bereitgestellt wurden
  if (!eventId || !comment) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Überprüfen, ob das Event existiert
    const eventExists = await Event.findByPk(eventId);

    if (!eventExists) {
      logger.info(`POST /users/events/comment - EventID ${eventId} not found`);
      return res.status(404).json({ message: 'Event not found' });
    }

    // Überprüfen, ob der Benutzer bereits einen Kommentar zu diesem Event abgegeben hat
    const existingComment = await Comment.findOne({
      where: {
        event_id: eventId,
        user_id: userId,
      },
    });

    if (existingComment) {
      logger.info(
        `POST /users/events/comment - UserID ${userId} has already commented on EventID ${eventId}`
      );
      return res
        .status(400)
        .json({ message: 'Du hast dieses Event bereits kommentiert' });
    }

    // Erstellen eines neuen Kommentars in der Datenbank
    await Comment.create({
      event_id: eventId, // Verwende den richtigen Feldnamen
      user_id: userId, // Verwende die User-ID aus dem Token
      comment,
    });

    // Logge die Erstellung des neuen Kommentars
    logger.info(
      `POST /users/events/comment - UserID: ${userId} - Added comment for EventID ${eventId}`
    );

    // Sende eine Bestätigung der Kommentar-Erstellung als Antwort zurück
    res.status(201).json({ message: 'Kommentar erfolgreich hinzugefügt' });
  } catch (error) {
    // Protokolliere den Fehler und sende eine Antwort
    logger.error(
      `POST /users/events/comment - Error for UserID ${userId} for EventID ${eventId}: ${error.message}`
    );
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /users/events/event-feedback - Abrufen aller Bewertungen eines Events✅
UsersRouter.get('/events/event-feedback', async (req, res) => {
  const userId = req.user.id; // Extrahiere die User-ID aus dem Token
  const { eventId } = req.body; // Extrahiere die Event-ID aus dem Body der Anfrage

  // Überprüfen, ob die Event-ID bereitgestellt wurde
  if (!eventId) {
    logger.info('GET /users/events/event-feedback - Event ID not provided');
    return res.status(400).json({ message: 'Event ID is required' });
  }

  try {
    // Überprüfen, ob das Event existiert
    const eventExists = await Event.findByPk(eventId);

    if (!eventExists) {
      logger.info(
        `GET /users/events/event-feedback - EventID ${eventId} not found`
      );
      return res.status(404).json({ message: 'Event not found' });
    }

    // Abrufen aller Bewertungen für das Event aus der Ratings-Tabelle
    const ratings = await Rating.findAll({
      where: { eventId },
    });

    // Logge die Anzahl der Bewertungen zusammen mit den Bewertungen
    logger.info(
      `GET /users/events/event-feedback - UserID: ${userId} - Fetched: ${ratings.length} ratings for EventID: ${eventId}`
    );

    // Sende die Bewertungen als Antwort zurück
    res.status(200).json(ratings);
  } catch (error) {
    // Protokolliere den Fehler und sende eine Antwort
    logger.error(
      `GET /users/events/event-feedback - Error for UserID ${userId} for EventID ${eventId}: ${error.message}`
    );
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /users/password - Passwort ändern
UsersRouter.post('/password', async (req, res) => {
  try {
    const userId = req.user.id; // Benutzer-ID aus dem Token
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      logger.warn(`UserId: ${userId} - Fehlende Passwortinformationen`);
      return res
        .status(400)
        .json({ message: 'Altes und neues Passwort müssen angegeben werden' });
    }

    // Benutzer anhand der userId suchen
    const user = await User.findOne({ where: { id: userId } }); // Sicherstellen, dass die richtige ID verwendet wird
    if (!user) {
      logger.warn(`UserId: ${userId} - Benutzer nicht gefunden`);
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }

    // Vergleiche das alte Passwort
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      logger.warn(`UserId: ${userId} - Altes Passwort ist falsch`);
      return res.status(400).json({ message: 'Das alte Passwort ist falsch' });
    }

    // Hash das neue Passwort
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    logger.info(`UserId: ${userId} - Passwort erfolgreich geändert`);
    return res.status(200).json({ message: 'Passwort erfolgreich geändert' });
  } catch (error) {
    logger.error(
      `UserId: ${req.user.id} - Fehler beim Ändern des Passworts: ${error.message}`
    );
    return res.status(500).json({ message: 'Serverfehler' });
  }
});

module.exports = { UsersRouter };
