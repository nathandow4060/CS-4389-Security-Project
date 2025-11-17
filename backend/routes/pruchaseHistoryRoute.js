const express = require('express');
const ctrl = require('../controllers/purchaseHistoryController');
const { authenticateToken } = require('../middleware/authMiddleware'); //loggedin user verification
const router = express.Router({ mergeParams: true });

//returns user purchase history records for specified accountid
// Protected routes - require JWT authentication
router.get('/', authenticateToken, ctrl.getUserPurchaseHistory);
router.post('/', authenticateToken, ctrl.postUserPurchaseHistory);

module.exports = router;