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
    // Alle Benutzer abrufen, egal welche Rolle
    const users = await User.findAll();
    logger.info(`GET /admins/users - ${users.length} users found`);
    res.json(users);
  } catch (err) {
    logger.error(`GET /admins/users - Error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /admins/users/delete - Löschen eines Benutzers✅
AdminsRouter.delete('/users/delete', async (req, res) => {
  const { id } = req.body;

  // Validierung der ID
  if (!id) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    // Löschen des Benutzers
    const result = await User.destroy({ where: { id } });

    if (result === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    logger.info(`DELETE /admins/users/delete - User with ID ${id} deleted`);
    res.status(200).json({ message: 'Benutzer gelöscht' });
  } catch (err) {
    logger.error(`DELETE /admins/users/delete - Error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// PUT /admin/users/role - Ändern der Rolle eines Benutzers✅
AdminsRouter.put('/users/role', async (req, res) => {
  const { userId, role } = req.body; // Verwende Body-Parameter für userId und role
  try {
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    await User.update({ role }, { where: { id: userId } });
    logger.info(
      `PUT /admins/users/role - Role updated for user ${userId} to ${role}`
    );
    res.status(200).json({ message: 'Benutzer Rolle updated' });
  } catch (err) {
    logger.error(`PUT /admins/users/role - Error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// GET /admin/events - Alle Events abrufen✅
AdminsRouter.get('/events', async (req, res) => {
  try {
    const events = await Event.findAll(); // Alle Events aus der Datenbank abrufen
    logger.info(`GET /admins/events - ${events.length} events found`);
    res.json(events);
  } catch (err) {
    logger.error(`GET /admins/events - Error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /admin/events/delete - Löschen eines Events✅
AdminsRouter.delete('/events/delete', async (req, res) => {
  const { id } = req.body;

  // Validierung der ID
  if (!id) {
    return res.status(400).json({ message: 'Event ID is required.' });
  }

  try {
    // Löschen des Events
    const result = await Event.destroy({ where: { id } });

    if (result === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    logger.info(`DELETE /admins/events/delete - Event with ID ${id} deleted`);
    res.status(200).json({ message: 'Event deleted' });
  } catch (err) {
    logger.error(`DELETE /admins/events/delete - Error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// GET /admin/comments - Alle Kommentare abrufen✅
AdminsRouter.get('/comments', async (req, res) => {
  try {
    const comments = await Comment.findAll(); // Alle Kommentare aus der Datenbank abrufen
    logger.info(`GET /admins/comments - ${comments.length} comments found`);
    res.json(comments);
  } catch (err) {
    logger.error(`GET /admins/comments - Error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /admin/comments/delete - Löschen eines Kommentars✅
AdminsRouter.delete('/comments/delete', async (req, res) => {
  const { id } = req.body;

  // Validierung der ID
  if (!id) {
    return res.status(400).json({ message: 'Comment ID is required.' });
  }

  try {
    // Löschen des Kommentars
    const result = await Comment.destroy({ where: { id } });

    if (result === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    logger.info(
      `DELETE /admins/comments/delete - Comment with ID ${id} deleted`
    );
    res.status(200).json({ message: 'Kommentar gelöscht' });
  } catch (err) {
    logger.error(`DELETE /admins/comments/delete - Error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// GET /admin/violations - Abrufen aller gemeldeten Verstöße✅
AdminsRouter.get('/violations', async (req, res) => {
  try {
    const violations = await Violation.findAll();
    logger.info(
      `GET /admins/violations - ${violations.length} violations found`
    );
    res.json(violations);
  } catch (err) {
    logger.error(`GET /admins/violations - Error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// PUT /admin/violations/status - Aktualisieren des Status eines Verstoßes Eintrags - pending oder resolved ✅
AdminsRouter.put('/violations/status', async (req, res) => {
  const { id, status } = req.body;

  // Validierung des Status
  if (status !== 'pending' && status !== 'resolved') {
    return res.status(400).json({
      message: 'Invalid status value. It must be "pending" or "resolved".',
    });
  }

  // Validierung der ID
  if (!id) {
    return res.status(400).json({ message: 'ID is required.' });
  }

  try {
    // Überprüfen, ob der Verstoß existiert
    const [affectedRows] = await Violation.update(
      { status },
      { where: { id } }
    );

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Violation not found' });
    }

    logger.info(
      `PUT /admins/violations/status - Status updated to ${status} for ID ${id}`
    );
    res.status(200).json({ message: 'Violation status updated' });
  } catch (err) {
    logger.error(`PUT /admins/violations/status - Error: ${err.message}`);
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
      `GET /admins/dashboard - Dashboard data: ${userCount} users, ${eventCount} events, ${violationCount} violations`
    );
    res.json({ userCount, eventCount, violationCount });
  } catch (err) {
    logger.error(`GET /admins/dashboard - Error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

module.exports = { AdminsRouter };
