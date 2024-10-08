const express = require('express');
const { AdminsRouter } = require('./admins');
const { UsersRouter } = require('./users');
const { AuthRouter } = require('./auth');
const { EventRouter } = require('./events');
const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const AppRouter = express.Router();

AppRouter.use('/admins', adminMiddleware, AdminsRouter);
AppRouter.use('/users', userMiddleware, UsersRouter);
AppRouter.use('/auth', AuthRouter);
AppRouter.use('/events', EventRouter);

module.exports = { AppRouter };
