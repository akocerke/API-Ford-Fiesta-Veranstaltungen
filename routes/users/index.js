const { Router } = require('express');
const UsersRouter = Router();
const User = require('../../database/models/User');
const logger = require('../../services/logger');

module.exports = { UsersRouter };
