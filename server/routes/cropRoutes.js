const express = require('express');
const router = express.Router();
const { getCropRecommendation } = require('../controllers/cropController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, getCropRecommendation);

module.exports = router;