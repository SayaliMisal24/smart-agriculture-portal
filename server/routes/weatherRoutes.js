const express = require('express');
const router = express.Router();
const { getWeather, getPublicWeather, getPublicForecast, getRawForecast } = require('../controllers/weatherController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getWeather);
router.get('/public', getPublicWeather);
router.get('/public/forecast', getPublicForecast);
router.get('/public/raw-forecast', getRawForecast);

module.exports = router;