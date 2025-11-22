//AUTHOR: Ethan McDonell
const express = require('express');
const ctrl = require('../controllers/productKeysController');
const router = express.Router({ mergeParams: true });

router.get('/count', ctrl.getKeysCountById);//get COUNT of keys in stock for a productID
router.get('/', ctrl.getAllKeysById); //Returns all product keys associated with a product id
router.get('/decrypted', ctrl.getAllDecryptedKeysbyID); //Returns all product keys in plaintext, assoicated with a product id
router.delete('/', ctrl.deleteProductkeyByIdAndKey); //DELETES a product key tuple with unique pair (productid, key); pass the encrypted key

module.exports = router;
