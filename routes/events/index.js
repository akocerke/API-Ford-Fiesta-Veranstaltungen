const { Router } = require('express');
const EventRouter = Router();
const Event = require('../../database/models/Event');
const logger = require('../../services/logger');

// GET /events/all
EventRouter.get('/all', async (req, res) => {
  try {
    // Alle Events aus der Datenbank abrufen
    const events = await Event.findAll(); // Verwendung von findAll für Sequelize
    // Die Events zurückgeben
    res.status(200).json(events);
  } catch (error) {
    // Fehler mit dem Logger protokollieren
    logger.error('Fehler beim Abrufen der Events:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der Events' });
  }
});

module.exports = { EventRouter };
