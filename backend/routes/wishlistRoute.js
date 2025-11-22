//AUTHOR: Ethan McDonell
//WIP Not fully implemented. Dropped due to time constraints
const express = require('express');
const ctrl = require('../controllers/wishlistController');

const router = express.Router();

// Create Read Update Delete (CRUD)

//NOT SURE IF NEEDED
//router.get('/', ctrl.getAllWishlists); //Do we want the ability to fetch all wishlist table records?
//router.get('/:wishlistid', ctrl.getWishlistEnrtryById);//Fetches a single requested entry from table by ID
router.get('/:id', ctrl.getWishlistEnrtiesByUserId);
router.post('/', ctrl.createWishlistItem); //insert record into table
//router.patch('/:id', ctrl.updateWishlistByUserIdProductId); // WIP: used to update wishlist rank; will need to be called iteratively when item is removed from wishlist (decrement every item rank in a users wishlist below removed item by 1) 

//WIP
//router.patch('/:id', ctrl.updateWishlistByUserId);
//router.delete('/:id', ctrl.deleteItemFromWishlistByUserIdProductId);

module.exports = router;
