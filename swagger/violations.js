// swagger/violations.js
/**
 * @swagger
 * tags:
 *   name: Violations
 *   description: Verwaltung von Verstößen
 */

/**
 * @swagger
 * /violations/all:
 *   get:
 *     tags: [Violations]
 *     summary: Alle Verstöße abrufen
 *     description: Holt eine Liste aller Verstöße
 *     responses:
 *       200:
 *         description: Eine Liste von Verstößen
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Die eindeutige Kennung des Verstoßes
 *                   user_id:
 *                     type: integer
 *                     description: Die ID des Benutzers, der den Verstoß begangen hat
 *                   event_id:
 *                     type: integer
 *                     description: Die ID des betroffenen Events
 *                   description:
 *                     type: string
 *                     description: Beschreibung des Verstoßes
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Der Zeitpunkt, zu dem der Verstoß registriert wurde
 */
