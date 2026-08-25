const express = require('express');
const router = express.Router();
const { getCropRecommendation, selectCrops, getLatestCropRecommendation, updateSelection } = require('../controllers/cropController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, getCropRecommendation);
router.get('/latest', protect, getLatestCropRecommendation);
router.post('/select', protect, selectCrops);
router.patch('/update-selection', protect, updateSelection);

module.exports = router;