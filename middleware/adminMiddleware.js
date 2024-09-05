// middleware/adminMiddleware.js
const { verifyToken } = require('../services/auth/AccessToken');
const logger = require('../services/logger');

const adminMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Token aus dem Authorization-Header

  if (!token) {
    logger.error('Token not provided');
    return res.status(401).json({ message: 'Token not provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    logger.error('Invalid or expired token');
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  // Setzt den Benutzer im Request
  req.user = decoded;

  // Überprüfen, ob der Benutzer ein Admin ist
  if (req.user.role !== 'admin') {
    logger.error('Access denied: Admin rights required');
    return res
      .status(403)
      .json({ message: 'Access denied: Admin rights required' });
  }

  logger.info('Admin access granted:', req.user);
  next(); // Zugriff gewähren
};

module.exports = adminMiddleware;
