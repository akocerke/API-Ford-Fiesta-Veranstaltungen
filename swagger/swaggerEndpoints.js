// /swagger/swaggerEndpoints 


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
 *     description: Holt eine Liste aller Kommentare
 *     responses:
 *       200:
 *         description: Eine Liste von Kommentaren
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
 *                   event_id:
 *                     type: integer
 *                     description: Die ID des Events, zu dem der Kommentar gehört
 *                   user_id:
 *                     type: integer
 *                     description: Die ID des Benutzers, der den Kommentar erstellt hat
 *                   comment:
 *                     type: string
 *                     description: Der Inhalt des Kommentars
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Der Zeitpunkt, zu dem der Kommentar erstellt wurde
 */
