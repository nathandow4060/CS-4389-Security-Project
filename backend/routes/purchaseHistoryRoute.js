const express = require('express');
const ctrl = require('../controllers/purchaseHistoryController');
const { authenticateToken, authorizeUser } = require('../middleware/authMiddleware');
const router = express.Router({ mergeParams: true });

// Protected routes: require JWT authentication and RBAC authorization
// Returns user purchase history records for specified accountid
router.get('/', authenticateToken, authorizeUser, ctrl.getUserPurchaseHistory);
router.post('/', authenticateToken, authorizeUser, ctrl.postUserPurchaseHistory);

module.exports = router;