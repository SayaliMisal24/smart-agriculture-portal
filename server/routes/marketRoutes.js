const express = require('express');
const router = express.Router();
const { getMarketPrices, debugMarketFetch } = require('../controllers/marketController');

router.get('/prices', getMarketPrices);
router.get('/debug', debugMarketFetch);

module.exports = router;