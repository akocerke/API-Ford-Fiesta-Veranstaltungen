// routes/ratings/index.js
const express = require('express');
const RatingsRouter = express.Router();
const logger = require('../../services/logger');
const Rating = require('../../database/models/Rating');
const Event = require('../../database/models/Event');
const User = require('../../database/models/User');

module.exports = { RatingsRouter };
