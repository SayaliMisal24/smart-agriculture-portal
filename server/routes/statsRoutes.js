const express = require('express');
const router = express.Router();
const { getStats, recordVisit } = require('../controllers/statsController');

router.get('/', getStats);
router.post('/visit', recordVisit);

module.exports = router;