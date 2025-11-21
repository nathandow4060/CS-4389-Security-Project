// Routes for purchase operations
// POST /api/purchase → create a new simulated purchase
const express = require('express');
const { createPurchase } = require('../controllers/purchaseController');
const { authenticateToken } = require('../middleware/authMiddleware'); // path as needed

const router = express.Router();

// Body: { accountId, productId }
router.post('/', authenticateToken, createPurchase);

module.exports = router;


