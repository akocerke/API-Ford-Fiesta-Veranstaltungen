//  routes/events/index.js
const express = require('express');
const Event = require('../../database/models/Event'); // Import Event-Modell
const logger = require('../../services/logger');
const EventsRouter = express.Router();

// GET /events/all - Alle Events abrufen
EventsRouter.get('/all', async (req, res) => {
  try {
    const events = await Event.findAll(); // Alle Events abfragen
    logger.info(`GET /events/all - ${events.length} events found`); // Logge die Anzahl der gefundenen Events
    res.json(events); // Antwort mit den Events senden
  } catch (err) {
    logger.error(`GET /events/all - Error: ${err.message}`); // Logge den Fehler
    res.status(500).json({ message: err.message }); // Antwort mit Fehlermeldung senden
  }
});

module.exports = { EventsRouter };
