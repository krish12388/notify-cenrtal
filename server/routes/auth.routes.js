const express = require('express');
const { register, login, logout, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { check } = require('express-validator');
const { validate } = require('../middleware/validate.middleware');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per 15 minutes
  message: { message: 'Too many authentication attempts from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], validate, register);

router.post('/login', authLimiter, [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], validate, login);

router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
