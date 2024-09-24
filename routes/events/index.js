const { Router } = require('express');
const EventRouter = Router();
const Event = require('../../database/models/Event');
const Rating = require('../../database/models/Rating'); // Rating importieren
const Comment = require('../../database/models/Comment'); // Comment importieren
const User = require('../../database/models/User'); // User importieren
const logger = require('../../services/logger');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({ region: 'eu-central-1' });
const bucketName = 'fordfiestabucket';
// GET /events/all
EventRouter.get('/all', async (req, res) => {
  try {
    // Alle Events abrufen
    const events = await Event.findAll();

    // Anzahl der abgerufenen Events protokollieren
    logger.info(`GET /events/all - ${events.length} events found`);

    // Bewertungen, Kommentare und Benutzer in separaten Abfragen abrufen
    const ratings = await Rating.findAll();
    const comments = await Comment.findAll();
    const users = await User.findAll(); // Benutzerdaten abrufen

    // Benutzer-Map erstellen
    const usersMap = users.reduce((acc, user) => {
      acc[user.id] = user.username; // Mapping von userId zu username
      return acc;
    }, {});

    // Events formatieren und Bewertungen und Kommentare hinzufügen
    const formattedEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      image: event.image,
      ratings: ratings
        .filter((rating) => rating.eventId === event.id)
        .map((rating) => ({
          rating: rating.rating,
          userId: rating.userId,
          username: usersMap[rating.userId] || 'Unbekannt', // Benutzername hinzufügen
        })),
      comments: comments
        .filter((comment) => comment.event_id === event.id)
        .map((comment) => ({
          comment: comment.comment,
          userId: comment.user_id,
          username: usersMap[comment.user_id] || 'Unbekannt', // Benutzername hinzufügen
        })),
    }));

    res.status(200).json(formattedEvents);
  } catch (error) {
    logger.error('Fehler beim Abrufen der Events:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der Events' });
  }
});

// POST /events/get-url - Abfragen der Bild-URL
EventRouter.post('/get-url', async (req, res) => {
  const { fileName } = req.body; // Dateiname aus dem Body abfragen

  // Überprüfen, ob der Dateiname angegeben wurde
  if (!fileName) {
    return res.status(400).json({ message: 'fileName is required' });
  }

  const params = {
    Bucket: bucketName,
    Key: fileName,
  };

  try {
    const url = s3.getSignedUrl('getObject', params);
    logger.info(`POST /events/get-url - Retrieved URL for file: ${fileName}`);
    res.json({ url });
  } catch (error) {
    logger.error(`POST /events/get-url - Error: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = { EventRouter };
