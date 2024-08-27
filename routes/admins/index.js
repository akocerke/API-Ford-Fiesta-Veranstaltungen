// routes/admin/index.js
const express = require('express');
const adminMiddleware = require('../../middleware/adminMiddleware');
const AdminsRouter = express.Router();

AdminsRouter.use(adminMiddleware);

AdminsRouter.get('/allUsers', (req, res) => {
    res.json({ message: "List of users" });
});

module.exports = { AdminsRouter };
