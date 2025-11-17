// controllers/profileController.js
const { findUserById } = require('../models/user.model');

/**
 * Get user profile
 * GET /api/profile
 * Requires JWT authentication
 */
const getProfile = async (req, res) => {
  try {
    // req.user is set by authenticateToken middleware
    const userId = req.user.id;

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user profile without password
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      age: user.age
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      message: 'Internal server error while fetching profile' 
    });
  }
};

module.exports = {
  getProfile,
};

