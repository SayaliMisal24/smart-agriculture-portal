const express = require('express');
const router = express.Router();
const { getMarketPrices, debugMarketFetch, marketCoverage } = require('../controllers/marketController');

router.get('/prices', getMarketPrices);
router.get('/debug', debugMarketFetch);
router.get('/coverage', marketCoverage);

module.exports = router;