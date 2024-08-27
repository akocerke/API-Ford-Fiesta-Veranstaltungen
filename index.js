// index.js
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
dotenv.config();
const { AppRouter } = require("./routes");
const logger = require("./services/logger");
const sequelize = require("./database/setup/database");
const { swaggerUi, swaggerDocs } = require("./swagger/swaggerConfig");
const rateLimit = require('express-rate-limit');



const app = express();
const port = process.env.PORT || 5050; // Port aus Umgebungsvariablen oder Standardport 5050

// Rate-Limiter-Konfiguration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100, // Limit jeder IP auf 100 Anfragen pro Fenster
  message: 'Zu viele Anfragen von dieser IP-Adresse. Bitte versuche es später erneut.',
  headers: true, // Optional: setze Rate Limit-Header in den Antworten
});

// Wende den Rate-Limiter global auf alle Routen an
app.use(limiter);

app.use(cors());
app.use(bodyParser.json());

// Verwende AppRouter für alle API-Routen
app.use("/api-ford-fiesta", limiter, AppRouter);

// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).send("API is running!");
});

// Fehlerbehandlungs-Middleware
app.use((err, req, res, next) => {
  logger.error(`Error occurred: ${err.message}`);
  res.status(err.status || 500).json({ message: err.message });
});

// Teste die Verbindung zur Datenbank
sequelize
  .authenticate()
  .then(() => {
    logger.info("Database connection has been established successfully.");
    // Starte den Server, nachdem die Verbindung zur Datenbank erfolgreich ist
    app.listen(port, () => {
      logger.info(`API running on port ${port}`);
    });
  })
  .catch((err) => {
    logger.error("Unable to connect to the database:", err);
    process.exit(1); // Beende den Prozess bei Verbindungsfehler
  });

// Middleware für Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
