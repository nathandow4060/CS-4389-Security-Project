//AUTHOR: Alp Bayrak
const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 * Verifies JWT token from Authorization header and attaches user info to req.user
 * Usage: router.get('/protected', authenticateToken, controller.handler)
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      status: 'error', 
      message: 'Authentication required. Please provide a valid JWT token.' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey', (err, user) => {
    if (err) {
      return res.status(403).json({ 
        status: 'error', 
        message: 'Invalid or expired token. Please login again.' 
      });
    }
    req.user = user;
    next();
  });
};

/**
 * RBAC Middleware - Ensures user can only access their own resources
 * Verifies that the accountId in the route params matches the authenticated user's accountId
 * Usage: router.get('/user/:accountid/history', authenticateToken, authorizeUser, controller.handler)
 */
const authorizeUser = (req, res, next) => {
  // Get accountId from route params or request body
  const accountIdFromRoute = req.params.accountid ? parseInt(req.params.accountid, 10) : null;
  const accountIdFromBody = req.body.accountId ? parseInt(req.body.accountId, 10) : null;
  const accountId = accountIdFromRoute || accountIdFromBody;
  
  // Get accountId from JWT token (should be set during login)
  const userAccountId = req.user?.accountId || req.user?.id;
  
  if (!userAccountId) {
    return res.status(403).json({ 
      status: 'error', 
      message: 'User account information not found in token.' 
    });
  }
  
  if (accountId && accountId !== userAccountId) {
    return res.status(403).json({ 
      status: 'error', 
      message: 'Access denied. You can only access your own resources.' 
    });
  }
  
  // If no accountId specified, allow (for routes that don't need it)
  next();
};

module.exports = { authenticateToken, authorizeUser };
