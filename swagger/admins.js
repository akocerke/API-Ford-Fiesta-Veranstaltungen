// swagger/admins.js
/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: Verwaltung von Admins
 */

/**
 * @swagger
 * /admins/admins:
 *   get:
 *     tags: [Admins]
 *     summary: Alle Admins abrufen
 *     description: Holt eine Liste aller Admins
 *     responses:
 *       200:
 *         description: Eine Liste von Admins
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Die eindeutige Kennung des Admins
 *                   name:
 *                     type: string
 *                     description: Der Name des Admins
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Der Zeitpunkt, zu dem der Admin erstellt wurde
 */
