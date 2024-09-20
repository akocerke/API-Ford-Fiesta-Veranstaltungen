const { Router } = require('express');
const EventRouter = Router();
const Event = require('../../database/models/Event');
const Rating = require('../../database/models/Rating'); // Rating importieren
const Comment = require('../../database/models/Comment'); // Comment importieren
const logger = require('../../services/logger');

// GET /events/all
EventRouter.get('/all', async (req, res) => {
  try {
    // Alle Events abrufen
    const events = await Event.findAll();

    // Anzahl der abgerufenen Events protokollieren
    logger.info(`GET /events/all - ${events.length} events found`);

    // Bewertungen und Kommentare in separaten Abfragen abrufen
    const ratings = await Rating.findAll();
    const comments = await Comment.findAll();

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
        })),
      comments: comments
        .filter((comment) => comment.event_id === event.id)
        .map((comment) => ({
          comment: comment.comment,
          userId: comment.user_id,
        })),
    }));

    res.status(200).json(formattedEvents);
  } catch (error) {
    logger.error('Fehler beim Abrufen der Events:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der Events' });
  }
});

module.exports = { EventRouter };
