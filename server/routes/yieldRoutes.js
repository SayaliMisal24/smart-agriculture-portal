const express = require('express');
const router = express.Router();
const { submitYieldPrediction, getMyYieldPrediction } = require('../controllers/yieldController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitYieldPrediction);
router.get('/', protect, getMyYieldPrediction);

module.exports = router;