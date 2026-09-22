const express = require('express');
const router = express.Router();
const { submitDiseaseCheck, getMyDiseaseChecks } = require('../controllers/diseaseController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('photo'), submitDiseaseCheck);
router.get('/', protect, getMyDiseaseChecks);

module.exports = router;