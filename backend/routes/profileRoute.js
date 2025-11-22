//AUTHOR: Alp Bayrak
const express = require('express');
const ctrl = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes: require JWT authentication
// GET /user/profile - Get authenticated user's profile
router.get('/', authenticateToken, ctrl.getUserProfile);

// PUT /user/profile - Update authenticated user's profile
router.put('/', authenticateToken, ctrl.updateUserProfile);

module.exports = router;

