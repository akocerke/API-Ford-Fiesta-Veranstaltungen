// routes/comments/index.js
const { Router } = require('express');
const CommentsRouter = Router();
const Comment = require('../../database/models/Comment');
const logger = require('../../services/logger');

module.exports = { CommentsRouter };
