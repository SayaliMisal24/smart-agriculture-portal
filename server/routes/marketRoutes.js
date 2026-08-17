const express = require('express');
const router = express.Router();
const { getMarketPrices } = require('../controllers/marketController');

// Public - no login required, same as the homepage weather card
router.get('/prices', getMarketPrices);

module.exports = router;