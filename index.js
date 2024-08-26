// index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { AppRouter } = require("./routes");
const logger = require("./services/logger");
const sequelize = require("./database/setup/database");
const { swaggerUi, swaggerDocs } = require("./swagger/swaggerConfig");

dotenv.config();

const app = express();
const port = process.env.PORT || 5050; // Port aus Umgebungsvariablen oder Standardport 5050

app.use(cors());
app.use(bodyParser.json());

// Verwende AppRouter für alle API-Routen
app.use("/api-ford-fiesta", AppRouter);

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
