const express = require('express');
const router = express.Router();
const { createCropCalendar, getMyCropCalendars } = require('../controllers/calendarController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createCropCalendar);
router.get('/', protect, getMyCropCalendars);

module.exports = router;