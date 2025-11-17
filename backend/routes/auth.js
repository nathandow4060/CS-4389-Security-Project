// routes/auth.js
const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/register - Create new user
router.post('/register', register);

// POST /api/auth/login - Verify credentials and return JWT
router.post('/login', login);

module.exports = router;