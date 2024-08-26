// routes/events/index.js
const Router = require('express');
const EventsRouter = Router();

// Beispiel-Routen für Events
EventsRouter.get('/', (req, res) => {
    res.json({ message: "List of events" });
});

EventsRouter.post('/', (req, res) => {
    // Logik zum Erstellen eines neuen Events
    res.json({ message: "Event created" });
});

module.exports = { EventsRouter};

