// routes/admins/index.js
const express = require("express");
const User = require("../../database/models/User"); // Import User-Modell
const Admin = require("../../database/models/Admin"); // Import Admin-Modell
const AdminsRouter = express.Router();
const logger = require("../../services/logger");

// GET /admins/admins - Alle Admins abrufen
AdminsRouter.get("/admins", async (req, res) => {
  try {
    const admins = await Admin.findAll({ where: { role: "admin" } });
    logger.info(`GET /admins/admins - ${admins.length} admins found`);
    res.json(admins);
  } catch (err) {
    logger.error(`GET /admins/admins - Error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// GET /admins/users - Alle User abrufen
AdminsRouter.get("/users", async (req, res) => {
  try {
    const users = await User.findAll({ where: { role: "user" } });
    logger.info(`GET /admins/users - ${users.length} users found`);
    res.json(users);
  } catch (err) {
    logger.error(`GET /admins/users - Error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

module.exports = { AdminsRouter };
