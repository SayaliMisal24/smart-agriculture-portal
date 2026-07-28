const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);

// Protected test route
router.get('/profile', protect, (req, res) => {
  res.status(200).json({
    message: 'You are authorized!',
    user: req.user,
  });
});

module.exports = router;