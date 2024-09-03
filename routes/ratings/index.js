// routes/ratings/index.js
const express = require('express');
const RatingsRouter = express.Router();
const logger = require('../../services/logger');
const Rating = require('../../database/models/Rating');
const Event = require('../../database/models/Event');
const User = require('../../database/models/User');

// GET /all - Alle Ratings abrufen
RatingsRouter.get('/all', async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      include: [
        { model: Event, as: 'event', attributes: ['title'] },
        { model: User, as: 'user', attributes: ['username'] },
      ],
    });

    logger.info(`GET /ratings/all - ${ratings.length} ratings found`);
    res.json(ratings);
  } catch (err) {
    logger.error(`GET /ratings/all - Error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

module.exports = { RatingsRouter };
