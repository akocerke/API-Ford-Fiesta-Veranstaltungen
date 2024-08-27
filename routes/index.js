const express = require('express');
const { AdminsRouter } = require('./admins');
const { CommentsRouter } = require('./comments');
const { EventsRouter } = require('./events');
const { RatingsRouter } = require('./ratings');
const { UsersRouter } = require('./users');
const { ViolationsRouter } = require('./violations');
// const userMiddleware = require('../middleware/userMiddleware');
// const adminMiddleware =require('../middleware/adminMiddleware');

const AppRouter = express.Router();

AppRouter.use("/admins", AdminsRouter);
AppRouter.use("/comments", CommentsRouter);
AppRouter.use("/events", EventsRouter);
AppRouter.use("/ratings", RatingsRouter);
AppRouter.use("/users", UsersRouter);
AppRouter.use("/violations", ViolationsRouter);

module.exports = { AppRouter };
