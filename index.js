const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
dotenv.config();
const { AppRouter } = require("./routes");
const logger = require("./services/logger");
const sequelize = require("./database/setup/database");
const { swaggerUi, swaggerDocs } = require("./swagger/swaggerConfig");

const app = express();
const port = process.env.PORT || 5050;

app.use(cors());
app.use(bodyParser.json());

app.use("/api-ford-fiesta", AppRouter);

app.use((err, req, res) => {
  logger.error(`Error occurred: ${err.message}`);
  res.status(err.status || 500).json({ message: err.message });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Exportieren Sie `app` für die Tests
module.exports = app;

// Starten Sie den Server nur, wenn das Modul direkt ausgeführt wird
if (require.main === module) {
  sequelize
    .authenticate()
    .then(() => {
      logger.info("Database connection has been established successfully.");
      app.listen(port, () => {
        logger.info(`API running on port ${port}`);
      });
    })
    .catch((err) => {
      logger.error("Unable to connect to the database:", err);
      process.exit(1);
    });
}
