const express = require('express');
const router = express.Router();
const { getWeather, getPublicWeather } = require('../controllers/weatherController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getWeather);
router.get('/public', getPublicWeather); // no protect middleware - open to everyone

module.exports = router;