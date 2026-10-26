const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/User');
const { getStats, recordVisit } = require('../controllers/statsController');

router.get('/', getStats);
router.post('/visit', recordVisit);

// TEMPORARY: shows which database the live server is connected to (delete after checking)
router.get('/db', async (req, res) => {
  try {
    res.json({ database: mongoose.connection.name, host: mongoose.connection.host, users: await User.countDocuments() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;