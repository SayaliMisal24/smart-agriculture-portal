const express = require('express');
const router = express.Router();
const { submitPricePrediction, getMyPricePrediction } = require('../controllers/pricePredictionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitPricePrediction);
router.get('/', protect, getMyPricePrediction);

module.exports = router;