const express = require('express');
const router = express.Router();
const { submitDiseaseCheck, getMyDiseaseCheck } = require('../controllers/diseaseController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('photo'), submitDiseaseCheck);
router.get('/', protect, getMyDiseaseCheck);

module.exports = router;