const express = require('express');
const router = express.Router();
const {
  setSowingDate,
  getIrrigationAdvice,
  logIrrigation,
  getIrrigationHistory,
} = require('../controllers/irrigationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/sowing-date', protect, setSowingDate);
router.get('/', protect, getIrrigationAdvice);
router.post('/log', protect, logIrrigation);
router.get('/history', protect, getIrrigationHistory);

module.exports = router;