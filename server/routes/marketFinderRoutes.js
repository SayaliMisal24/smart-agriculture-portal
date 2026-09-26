const express = require('express');
const router = express.Router();
const { submitMarketFinder, getMyMarketFinder } = require('../controllers/marketFinderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitMarketFinder);
router.get('/', protect, getMyMarketFinder);

module.exports = router;