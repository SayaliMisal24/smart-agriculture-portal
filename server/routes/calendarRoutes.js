const express = require('express');
const router = express.Router();
const { createCropCalendar, getMyCropCalendar } = require('../controllers/calendarController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createCropCalendar);
router.get('/', protect, getMyCropCalendar);

module.exports = router;