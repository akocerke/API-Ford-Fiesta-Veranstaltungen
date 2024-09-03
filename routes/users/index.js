const { Router } = require('express');
const UsersRouter = Router();
const User = require('../../database/models/User'); // Importiere korrekt
const logger = require('../../services/logger');

// GET all users
UsersRouter.get('/all', async (req, res) => {
  try {
    const users = await User.findAll();
    logger.info(`GET /users/all - ${users.length} users found`);
    res.json(users);
  } catch (err) {
    logger.error(`Error in /users/all: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

module.exports = { UsersRouter };
