// routes/admins/index.js
const express = require('express');
const User = require('../../database/models/User');
const Admin = require('../../database/models/Admin');
const Event = require('../../database/models/Event');
const Comment = require('../../database/models/Comment');
const Violation = require('../../database/models/Violation');
const AdminsRouter = express.Router();
const logger = require('../../services/logger');

// GET /admins/admins - Alle Admins abrufen✅
AdminsRouter.get('/admins', async (req, res) => {
  try {
    const admins = await Admin.findAll({ where: { role: 'admin' } });
    logger.info(`GET /admins/admins - ${admins.length} admins found`);
    res.json(admins);
  } catch (err) {
    logger.error(`GET /admins/admins - Error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// GET /admins/users - Alle User abrufen✅
AdminsRouter.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({ where: { role: 'user' } });
    logger.info(`GET /admins/users - ${users.length} users found`);
    res.json(users);
  } catch (err) {
    logger.error(`GET /admins/users - Error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /admin/users/:id - Löschen eines Benutzers
AdminsRouter.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await User.destroy({ where: { id } });
    logger.info(`DELETE /admin/users/${id} - User deleted`);
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    logger.error(`DELETE /admin/users/${id} - Error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// PUT /admin/users/:id/role - Ändern der Rolle eines Benutzers
AdminsRouter.put('/users/:id/role', async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    await User.update({ role }, { where: { id } });
    logger.info(`PUT /admin/users/${id}/role - Role updated to ${role}`);
    res.status(200).json({ message: 'User role updated' });
  } catch (err) {
    logger.error(`PUT /admin/users/${id}/role - Error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// GET /admin/events - Alle Events abrufen✅
AdminsRouter.get('/events', async (req, res) => {
  try {
    const events = await Event.findAll(); // Alle Events aus der Datenbank abrufen
    logger.info(`GET /admin/events - ${events.length} events found`);
    res.json(events);
  } catch (err) {
    logger.error(`GET /admin/events - Error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /admin/events/:id - Löschen eines Events
AdminsRouter.delete('/events/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Event.destroy({ where: { id } });
    logger.info(`DELETE /admin/events/${id} - Event deleted`);
    res.status(200).json({ message: 'Event deleted' });
  } catch (err) {
    logger.error(`DELETE /admin/events/${id} - Error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// GET /admin/comments - Alle Kommentare abrufen✅
AdminsRouter.get('/comments', async (req, res) => {
  try {
    const comments = await Comment.findAll(); // Alle Kommentare aus der Datenbank abrufen
    logger.info(`GET /admin/comments - ${comments.length} comments found`);
    res.json(comments);
  } catch (err) {
    logger.error(`GET /admin/comments - Error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /admin/comments/:id - Löschen eines Kommentars
AdminsRouter.delete('/comments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Comment.destroy({ where: { id } });
    logger.info(`DELETE /admin/comments/${id} - Comment deleted`);
    res.status(200).json({ message: 'Comment deleted' });
  } catch (err) {
    logger.error(`DELETE /admin/comments/${id} - Error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// GET /admin/violations - Abrufen aller gemeldeten Verstöße✅
AdminsRouter.get('/violations', async (req, res) => {
  try {
    const violations = await Violation.findAll();
    logger.info(
      `GET /admin/violations - ${violations.length} violations found`
    );
    res.json(violations);
  } catch (err) {
    logger.error(`GET /admin/violations - Error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// PUT /admin/violations/:id/status - Aktualisieren des Status eines Verstoßes Eintrag - pending oder resolved
AdminsRouter.put('/violations/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await Violation.update({ status }, { where: { id } });
    logger.info(
      `PUT /admin/violations/${id}/status - Status updated to ${status}`
    );
    res.status(200).json({ message: 'Violation status updated' });
  } catch (err) {
    logger.error(`PUT /admin/violations/${id}/status - Error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// GET /admin/dashboard - Abrufen von Dashboard-Daten
AdminsRouter.get('/dashboard', async (req, res) => {
  try {
    const userCount = await User.count();
    const eventCount = await Event.count();
    const violationCount = await Violation.count();
    logger.info(
      `GET /admin/dashboard - Dashboard data: ${userCount} users, ${eventCount} events, ${violationCount} violations`
    );
    res.json({ userCount, eventCount, violationCount });
  } catch (err) {
    logger.error(`GET /admin/dashboard - Error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

module.exports = { AdminsRouter };
