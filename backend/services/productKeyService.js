//AUTHOR: Ethan McDonell
const db = require('../db/db');
const { AppError } = require('../middleware/errorHandler');

//Returns the top key associated with a product
async function getFirstKeyEntry(productID) {
    result = await db.query(
      `SELECT key as encryptedkey, pgp_sym_decrypt(key, $1) as key
       FROM product_key
       WHERE productid = $2
       LIMIT 1`,
       [process.env.PG_ENCRYPTION_SECRET, productID]
    );
    
    if(result.rowCount != 0){ //Delete the key
        //reconstruct encrypted key in JS
        const arr = result.rows[0].encryptedkey;
        //Reconstruct Buffer for BYTEA comparison
        const keyBuffer = Buffer.from(Uint8Array.from(arr));

        const deleteResult = deleteKeyByProductIDANDKey(productID, keyBuffer)
        if(deleteResult.rowCount == 0){
            throw new AppError('Product key not found', 404);
        }
    }

    //console.log("DEBUG DECRYPTED KEY: " + result.rows[0]?.key)

    return result = result.rows[0]?.key || null; //Returns key or null if the product as no more keys 
}

//deletes the product key consumed by getFirstKeyEntry
async function deleteKeyByProductIDANDKey(productID, encryptedkey) {
    const result = await db.query(`
        DELETE FROM product_key WHERE productid = $1 AND key = $2`,
        [productID, encryptedkey]
        );
    
        return result
}

module.exports = { getFirstKeyEntry };