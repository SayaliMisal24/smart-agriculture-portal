const express = require('express');
const router = express.Router();
const { createSoilReport, getMySoilReports } = require('../controllers/soilController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createSoilReport);
router.get('/', protect, getMySoilReports);

module.exports = router;