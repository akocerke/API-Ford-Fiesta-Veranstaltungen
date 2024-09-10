//  routes/events/index.js
const express = require('express');
const Event = require('../../database/models/Event'); // Import Event-Modell
const logger = require('../../services/logger');
const EventsRouter = express.Router();

module.exports = { EventsRouter };
