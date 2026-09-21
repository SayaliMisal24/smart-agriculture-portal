const express = require('express');
const router = express.Router();
const { submitFertilizerCheck, getMyFertilizerCheck } = require('../controllers/fertilizerController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitFertilizerCheck);
router.get('/', protect, getMyFertilizerCheck);

module.exports = router;