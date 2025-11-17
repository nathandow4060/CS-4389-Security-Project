const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'mysecretkey';

/**
 * JWT Authentication Middleware
 * Verifies JWT token from Authorization header
 * Adds user info to req.user if valid
 */
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        message: 'Access denied. No token provided.' 
      });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ 
            message: 'Token expired. Please login again.' 
          });
        }
        if (err.name === 'JsonWebTokenError') {
          return res.status(403).json({ 
            message: 'Invalid token.' 
          });
        }
        return res.status(403).json({ 
          message: 'Token verification failed.' 
        });
      }

      // Attach user info to request object
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      message: 'Internal server error during authentication' 
    });
  }
};

module.exports = {
  authenticateToken,
};