const express = require('express');
const router = express.Router();
const { updateProfile, uploadProfilePhoto, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.put('/profile', protect, updateProfile);
router.post('/profile/photo', protect, upload.single('photo'), uploadProfilePhoto);
router.put('/profile/password', protect, changePassword);

module.exports = router;