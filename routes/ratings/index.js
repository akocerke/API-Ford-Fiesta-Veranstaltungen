// routes/ratings/index.js
const Router = require('express');
const RatingsRouter = Router();

// Beispiel-Routen für Ratings
RatingsRouter.get('/', (req, res) => {
    res.json({ message: "List of ratings" });
});

RatingsRouter.post('/', (req, res) => {
    // Logik zum Erstellen eines neuen Ratings
    res.json({ message: "Rating created" });
});

module.exports = { RatingsRouter};
