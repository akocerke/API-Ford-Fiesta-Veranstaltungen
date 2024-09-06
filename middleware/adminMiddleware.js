const { verifyToken } = require('../services/auth/AccessToken');
const logger = require('../services/logger');

const adminMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    logger.error('Token not provided');
    return res.status(401).json({ message: 'Token not provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    logger.error('Invalid or expired token');
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  // Logge den decodierten Token-Inhalt
  logger.info('Decoded token:', decoded);

  req.user = decoded;

  // Überprüfe die Rolle des Benutzers
  if (req.user.role !== 'admin') {
    logger.error('Access denied: Admin rights required');
    return res
      .status(403)
      .json({ message: 'Access denied: Admin rights required' });
  }

  logger.info('Admin access granted:', req.user);
  next();
};

module.exports = adminMiddleware;
