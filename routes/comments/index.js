// routes/comments/index.js
const { Router } = require("express");
const CommentsRouter = Router();
const Comment = require("../../database/models/Comment");
const logger = require("../../services/logger");

// GET /all Kommentare
CommentsRouter.get('/all', async (req, res) => {
    try {
        logger.info('GET /comments/all - Request received');
        
        const comments = await Comment.findAll();
        
        logger.info(`GET /comments/all - ${comments.length} comments retrieved`);
        res.json(comments);
    } catch (error) {
        logger.error(`GET /comments/all - Error: ${error.message}`);
        res.status(500).json({ error: 'Fehler beim Abrufen der Kommentare' });
    }

});
module.exports = { CommentsRouter };
