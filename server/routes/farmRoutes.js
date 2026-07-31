const express = require('express');
const router = express.Router();
const { createFarm, getMyFarms, getFarmById, deleteFarm } = require('../controllers/farmController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createFarm);
router.get('/', protect, getMyFarms);
router.get('/:id', protect, getFarmById);
router.delete('/:id', protect, deleteFarm);

module.exports = router;