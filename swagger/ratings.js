// swagger/ratings.js
/**
 * @swagger
 * tags:
 *   name: Ratings
 *   description: Verwaltung von Bewertungen
 */

/**
 * @swagger
 * /ratings/all:
 *   get:
 *     tags: [Ratings]
 *     summary: Alle Bewertungen abrufen
 *     description: Holt eine Liste aller Bewertungen
 *     responses:
 *       200:
 *         description: Eine Liste von Bewertungen
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Die eindeutige Kennung der Bewertung
 *                   user_id:
 *                     type: integer
 *                     description: Die ID des Benutzers, der die Bewertung abgegeben hat
 *                   event_id:
 *                     type: integer
 *                     description: Die ID des bewerteten Events
 *                   rating:
 *                     type: integer
 *                     description: Der Wert der Bewertung
 *                   comment:
 *                     type: string
 *                     description: Ein Kommentar zur Bewertung
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Der Zeitpunkt, zu dem die Bewertung abgegeben wurde
 */
