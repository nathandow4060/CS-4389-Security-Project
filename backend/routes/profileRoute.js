// routes/profileRoute.js
const express = require('express');
const { getProfile } = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/profile - Get user profile
// Protected route - requires JWT authentication
router.get('/', authenticateToken, getProfile);

module.exports = router;