// routes/comments/index.js
const { Router } = require('express');
const CommentsRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Die Kommentare verwaltende API
 */

/**
 * @swagger
 * /comments/all:
 *   get:
 *     tags: [Comments]
 *     summary: Alle Kommentare abrufen
 *     description: Holen sich eine Liste aller Kommentare
 *     responses:
 *       200:
 *         description: Eine Liste mit Kommentaren
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Die eindeutige Kennung für den Kommentar
 *                   comment:
 *                     type: string
 *                     description: Der Inhalt des Kommentars
 */
CommentsRouter.get('/all', (req, res) => {
    res.json({ message: "Liste mit Kommentaren" });
});

module.exports = { CommentsRouter };
