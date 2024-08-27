// middleware/adminMiddleware.js
const logger = require('../services/logger');

const adminMiddleware = (req, res, next) => {
  // Stellen sicher, dass der Benutzer authentifiziert ist
  if (!req.user) {
    logger.error("User not authenticated");
    return res.status(401).json({ message: "User not authenticated" });
  }

  // Überprüfen, ob der Benutzer ein Admin ist
  if (req.user.role !== 'admin') {
    logger.error("Access denied: Admin rights required");
    return res.status(403).json({ message: "Access denied: Admin rights required" });
  }

  logger.info("Admin access granted:", req.user);
  next(); // Zugriff gewähren
};

module.exports = adminMiddleware;
