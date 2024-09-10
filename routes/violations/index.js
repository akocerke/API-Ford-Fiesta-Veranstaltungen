// routes/violations/index.js
const Router = require('express');
const ViolationsRouter = Router();
const Violation = require('../../database/models/Violation');
const Event = require('../../database/models/Event');
const User = require('../../database/models/User');
const logger = require('../../services/logger');

module.exports = { ViolationsRouter };
