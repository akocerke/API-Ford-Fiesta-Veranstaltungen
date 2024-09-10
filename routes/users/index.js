const { Router } = require('express');
const UsersRouter = Router();
const Event = require('../../database/models/Event');
const Comment = require('../../database/models/Comment');
const Violation = require('../../database/models/Violation');
const Rating = require('../../database/models/Rating');
const logger = require('../../services/logger');

// GET /users/dashboard - Gibt eine Übersicht von Events, Ratings, Comments und Violations des angemeldeten Benutzers zurück.
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

module.exports = { UsersRouter };
