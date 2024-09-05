// routes/auth/index.js
const { Router } = require('express');
const bcrypt = require('bcryptjs');
const logger = require('../../services/logger');
const User = require('../../database/models/User');
const { generateToken } = require('../../services/auth/AccessToken');
const { verifyToken } = require('../../services/auth/AccessToken');

const AuthRouter = Router();

// Login-Route
AuthRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Überprüfe, ob der Benutzer existiert
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Benutzer nicht gefunden' });
    }

    // Vergleiche das Passwort
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ message: 'Ungültige Anmeldeinformationen' });
    }

    // JWT-Token generieren mit Benutzer-ID und Rolle
    const token = generateToken({ id: user.id, role: user.role });

    // Token als HttpOnly-Cookie speichern
    res.cookie('token', token, {
      maxAge: 3600000, // 1 Stunde
    });

    // Erfolgreiches Login zurückgeben
    res.status(200).json({
      message: 'Login erfolgreich',
      user: {
        id: user.id,
        role: user.role,
      },
      token,
    });

    // Logge den erfolgreichen Login-Versuch
    logger.info(`Benutzer mit ID ${user.id} hat sich erfolgreich eingeloggt.`);
  } catch (error) {
    logger.error('Fehler beim Login:', error.message);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

// Signup-Route
AuthRouter.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Überprüfe, ob die E-Mail bereits vorhanden ist
    const existingUserByEmail = await User.findOne({ where: { email } });
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'E-Mail bereits registriert' });
    }

    // Überprüfe, ob der Benutzername bereits vorhanden ist
    const existingUserByUsername = await User.findOne({ where: { username } });
    if (existingUserByUsername) {
      return res.status(400).json({ message: 'Benutzername bereits vergeben' });
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    // Neuen Benutzer erstellen
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: 'user', // Standard-Rolle für neue Benutzer
    });

    // Erfolgreiche Registrierung protokollieren
    logger.info(
      `Benutzer erfolgreich registriert: ID ${newUser.id}, Benutzername ${newUser.username}`
    );

    // Erfolgreiche Registrierung zurückgeben
    res.status(201).json({
      message: 'Benutzer erfolgreich registriert',
    });
  } catch (error) {
    logger.error('Fehler bei der Registrierung:', error.message);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

// Logout-Route
AuthRouter.post('/logout', (req, res) => {
  try {
    // Token aus dem Authorization-Header lesen
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      logger.error('Kein Token zum Logout bereitgestellt.');
      return res.status(400).json({ message: 'Kein Token bereitgestellt' });
    }

    // Token verifizieren und Benutzer-ID extrahieren
    const decoded = verifyToken(token);
    if (!decoded) {
      logger.error('Ungültiges oder abgelaufenes Token.');
      return res
        .status(401)
        .json({ message: 'Ungültiges oder abgelaufenes Token' });
    }

    const userId = decoded.id;

    // Protokolliere, welcher Benutzer sich ausgeloggt hat
    if (userId) {
      logger.info(`Benutzer mit ID ${userId} hat sich erfolgreich ausgeloggt.`);
    }

    // Da der Token nur im Header verwendet wird, gibt es keine Cookie-Aktion
    // Optional: Hier könntest du zusätzliche Logik zur Token-Invalidierung einfügen, falls nötig

    res.status(200).json({ message: 'Logout erfolgreich' });
  } catch (error) {
    logger.error('Fehler beim Logout:', error.message);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

module.exports = { AuthRouter };
