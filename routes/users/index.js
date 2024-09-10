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
module.exports = { UsersRouter };
