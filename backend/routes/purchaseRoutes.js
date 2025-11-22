//AUTHOR: Alp Bayrak
// Routes for purchase operations
// POST /api/purchase → create a new simulated purchase
const express = require('express');
const { createPurchase } = require('../controllers/purchaseController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Body: { productId } (accountId comes from JWT token)
// Protected route: requires JWT authentication and RBAC authorization
router.post('/', authenticateToken, createPurchase);

module.exports = router;


