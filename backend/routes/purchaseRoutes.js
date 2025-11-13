// Routes for purchase operations
// POST /api/purchase → create a new simulated purchase
const express = require('express');
const { createPurchase } = require('../controllers/purchaseController');

const router = express.Router();

// Body: { accountId, productId }
router.post('/', createPurchase);

module.exports = router;


