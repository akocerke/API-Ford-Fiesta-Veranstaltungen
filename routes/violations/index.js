// routes/violations/index.js
const Router = require('express');
const ViolationsRouter = Router();

// Beispiel-Routen für Violations
ViolationsRouter.get('/', (req, res) => {
    res.json({ message: "List of violations" });
});

ViolationsRouter.post('/', (req, res) => {
    // Logik zum Erstellen eines neuen Violations
    res.json({ message: "Violation created" });
});

module.exports = { ViolationsRouter};

