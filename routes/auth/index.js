// routes/auth/index.js
const { Router } = require("express");
const AuthRouter = Router();
const bcrypt = require("bcryptjs"); // Verwende bcryptjs
// const jwt = require("jsonwebtoken");
const logger = require("../../services/logger");
const { generateToken } = require("../../services/auth/AccessToken");

// Temporäre Benutzerdatenbank (In-Memory)
const users = []; // Hier werden Benutzer als { email, password } gespeichert

// Benutzer registrieren
AuthRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Überprüfen, ob die E-Mail bereits vorhanden ist
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "E-Mail bereits registriert" });
    }

    // Hashen des Passworts
    const hashedPassword = await bcrypt.hash(password, 10);

    // Neuen Benutzer erstellen und speichern
    users.push({ firstName, lastName, email, password: hashedPassword });

    res.status(201).json({ message: "Benutzer erfolgreich registriert" });
  } catch (error) {
    logger.error("Fehler bei der Registrierung:", error.message);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
});

// Benutzer anmelden
AuthRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = users.find((user) => user.email === email);
    if (!user) {
      return res.status(401).json({ message: "Benutzer nicht gefunden" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ message: "Ungültige Anmeldeinformationen" });
    }

    // Token generieren
    const token = generateToken({ email });

    res.status(200).json({
      message: "Login erfolgreich",
      token,
    });
  } catch (error) {
    logger.error("Fehler beim Login:", error.message);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
});

// Benutzer abmelden (Einfaches Logout)
AuthRouter.post("/logout", (req, res) => {
  // Für ein echtes Logout müsste das Token invalidiert werden, was hier nicht simuliert wird
  res.status(200).json({ message: "Logout erfolgreich" });
});

module.exports = { AuthRouter };
