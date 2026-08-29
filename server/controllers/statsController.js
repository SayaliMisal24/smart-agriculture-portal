const User = require('../models/User');

// Simple in-memory counter for page visits since server start.
// Resets when the server restarts - a lightweight approach appropriate
// for a student project, without needing a dedicated analytics service.
let visitCount = 0;

const getStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.status(200).json({ userCount, visitCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};

const recordVisit = (req, res) => {
  visitCount += 1;
  res.status(200).json({ visitCount });
};

module.exports = { getStats, recordVisit };