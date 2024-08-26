// routes/users/index.js
const { Router } = require("express");
const UsersRouter = Router();

// Beispiel-Routen für Users
UsersRouter.get('/', (req, res) => {
    res.json({ message: "List of users" });
});

UsersRouter.post('/', (req, res) => {
    // Logik zum Erstellen eines neuen Users
    res.json({ message: "User created" });
});

module.exports = { UsersRouter};
