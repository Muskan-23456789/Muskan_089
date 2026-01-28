const express = require('express');
const router = express.Router();
const { register, login, getMe, refreshToken } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// @route   POST /api/auth/register
router.post('/register', authLimiter, register);

// @route   POST /api/auth/login
router.post('/login', authLimiter, login);

// @route   GET /api/auth/me
router.get('/me', protect, getMe);

// @route   POST /api/auth/refresh
router.post('/refresh', protect, refreshToken);

module.exports = router;
