const express = require('express');
const router = express.Router();
const { getCropRecommendation, selectCrop } = require('../controllers/cropController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, getCropRecommendation);
router.patch('/:id/select', protect, selectCrop);

module.exports = router;