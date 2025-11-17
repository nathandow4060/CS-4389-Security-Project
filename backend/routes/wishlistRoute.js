const express = require('express');
const ctrl = require('../controllers/wishlistController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Create Read Update Delete (CRUD)
// All wishlist routes are protected - require JWT authentication

//NOT SURE IF NEEDED
//router.get('/', authenticateToken, ctrl.getAllWishlists); //Do we want the ability to fetch all wishlist table records?
//router.get('/:wishlistid', authenticateToken, ctrl.getWishlistEnrtryById);//Fetches a single requested entry from table by ID
router.get('/:id', authenticateToken, ctrl.getWishlistEnrtiesByUserId);
router.post('/', authenticateToken, ctrl.createWishlistItem); //insert record into table
//router.patch('/:id', authenticateToken, ctrl.updateWishlistByUserIdProductId); // WIP: used to update wishlist rank; will need to be called iteratively when item is removed from wishlist (decrement every item rank in a users wishlist below removed item by 1) 

//WIP
//router.patch('/:id', authenticateToken, ctrl.updateWishlistByUserId);
//router.delete('/:id', authenticateToken, ctrl.deleteItemFromWishlistByUserIdProductId);

module.exports = router;