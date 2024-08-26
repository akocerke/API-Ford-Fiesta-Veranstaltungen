const express = require('express');
const { CommentsRouter } = require('./comments');
const { EventsRouter } = require('./events');
const { RatingsRouter } = require('./ratings');
const { UsersRouter } = require('./users');
const { ViolationsRouter } = require('./violations');
const authMiddleware = require('../middleware/authMiddleware');

const AppRouter = express.Router();

AppRouter.use("/comments", CommentsRouter);
AppRouter.use("/events", EventsRouter);
AppRouter.use("/ratings", RatingsRouter);
AppRouter.use("/users", authMiddleware, UsersRouter);
AppRouter.use("/violations", ViolationsRouter);

module.exports = { AppRouter };
