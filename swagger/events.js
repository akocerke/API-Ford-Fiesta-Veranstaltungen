// swagger/events.js
/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Verwaltung von Veranstaltungen
 */

/**
 * @swagger
 * /events/all:
 *   get:
 *     tags: [Events]
 *     summary: Alle Veranstaltungen abrufen
 *     description: Holt eine Liste aller Veranstaltungen
 *     responses:
 *       200:
 *         description: Eine Liste von Veranstaltungen
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Die eindeutige Kennung der Veranstaltung
 *                   name:
 *                     type: string
 *                     description: Der Name der Veranstaltung
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     description: Das Datum der Veranstaltung
 */
