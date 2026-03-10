const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { registerValidator, loginValidator } = require('../utils/validators');

// POST /api/auth/register
router.post('/register', registerValidator, registerUser);

// POST /api/auth/login
router.post('/login', loginValidator, loginUser);

// GET /api/auth/profile  (protected)
router.get('/profile', protect, getProfile);

module.exports = router;