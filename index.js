const express = require('express');
// const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
// dotenv.config();
const { AppRouter } = require('./routes');
const logger = require('./services/logger');
const sequelize = require('./database/setup/database');
const { swaggerUi, swaggerDocs } = require('./swagger/swaggerConfig');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 5050;

// Rate-Limiter-Konfiguration
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 Minuten
  max: 1000, // Limit jeder IP auf 1000 Anfragen pro Fenster
  message:
    'Zu viele Anfragen von dieser IP-Adresse. Bitte versuche es später erneut.',
  headers: true, // Optional: setze Rate Limit-Header in den Antworten
});

// Wende den Rate-Limiter global auf alle Routen an
app.use(limiter);

app.use(cors());
app.use(bodyParser.json());

// Verwende AppRouter für alle API-Routen
app.use('/api-ford-fiesta', limiter, AppRouter);

app.use((err, req, res, next) => {
  logger.error(`Error occurred: ${err.message}`);
  res.status(err.status || 500).json({ message: err.message });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Exportieren Sie `app` für die Tests
module.exports = app;

// Starten Sie den Server nur, wenn das Modul direkt ausgeführt wird
if (require.main === module) {
  sequelize
    .authenticate()
    .then(() => {
      logger.info('Database connection has been established successfully.');
      app.listen(port, () => {
        logger.info(`API running on port ${port}`);
      });
    })
    .catch((err) => {
      logger.error('Unable to connect to the database:', err);
      process.exit(1);
    });
}
