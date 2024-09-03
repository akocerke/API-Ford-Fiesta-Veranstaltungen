// routes/violations/index.js
const Router = require('express');
const ViolationsRouter = Router();
const Violation = require('../../database/models/Violation');
const Event = require('../../database/models/Event');
const User = require('../../database/models/User');
const logger = require('../../services/logger');

// GET /all - Alle Violations abrufen
// GET /all - Alle Violations abrufen
ViolationsRouter.get('/all', async (req, res) => {
  try {
    // Alle Violations abfragen, inklusive der zugehörigen Events und Users
    const violations = await Violation.findAll({
      include: [
        { model: Event, as: 'event', attributes: ['id', 'title'] },
        { model: User, as: 'reportedByUser', attributes: ['id', 'username'] },
      ],
    });

    // Erfolgreiche Antwort
    logger.info(`GET /violations/all - Found ${violations.length} violations`);
    res.json(violations);
  } catch (err) {
    // Fehlerbehandlung
    logger.error(`GET /violations/all - ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});
module.exports = { ViolationsRouter };
