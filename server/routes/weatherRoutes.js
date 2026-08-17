const express = require('express');
const router = express.Router();
const { getWeather, getPublicWeather, getPublicForecast } = require('../controllers/weatherController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getWeather);
router.get('/public', getPublicWeather);
router.get('/public/forecast', getPublicForecast);

module.exports = router;