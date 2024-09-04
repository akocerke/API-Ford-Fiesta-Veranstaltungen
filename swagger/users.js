// swagger/users.js
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Verwaltung von Benutzern
 */

/**
 * @swagger
 * /users/all:
 *   get:
 *     tags: [Users]
 *     summary: Alle Benutzer abrufen
 *     description: Holt eine Liste aller Benutzer
 *     responses:
 *       200:
 *         description: Eine Liste von Benutzern
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Die eindeutige Kennung des Benutzers
 *                   name:
 *                     type: string
 *                     description: Der Name des Benutzers
 *                   email:
 *                     type: string
 *                     description: Die E-Mail-Adresse des Benutzers
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Der Zeitpunkt, zu dem der Benutzer erstellt wurde
 */
