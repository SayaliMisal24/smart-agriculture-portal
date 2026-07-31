const express = require('express');
const router = express.Router();
const { getIrrigationAdvice } = require('../controllers/irrigationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getIrrigationAdvice);

module.exports = router;