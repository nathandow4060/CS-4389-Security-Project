//AUTHOR: Ethan McDonell
// /routes/productRoutes.js
const express = require('express');
const ctrl = require('../controllers/productsController');

const router = express.Router();

// Create Read Update Delete (CRUD)
//two reads, one for all products, one read by specifying product id
router.get('/', ctrl.getAllProducts);
router.get('/:id', ctrl.getProductById);
router.post('/', ctrl.createProduct);
router.patch('/:id', ctrl.updateProduct);
router.delete('/:id', ctrl.deleteProduct);

module.exports = router;
