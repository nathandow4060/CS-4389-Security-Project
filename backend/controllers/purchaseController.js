// Controller for handling simulated purchases
// Usage: POST /api/purchase with body { accountId: number, productId: number }
// Behavior: Allocates a digital key for the product, records the transaction,
//           removes the allocated key from the pool, optionally cleans wishlist,
//           and returns a confirmation JSON with timestamp.
const db = require('../db/db');
const { AppError } = require('../middleware/errorHandler');
const { createPurchaseHistoryEntry } = require('../services/purchaseHistoryService');
const { getFirstKeyEntry } = require('../services/productKeyService');

// Helper to standardize confirmation payload for the client
function buildConfirmation({ purchaseId, accountId, product, productKey, purchasedAt }) {
  return {
    purchaseHistoryId: purchaseId,
    accountId,
    product: {
      id: product.id,
      name: product.name_of_product,
      developer: product.developer,
      price: product.price,
    },
    key: productKey,
    purchasedAt,
    status: 'confirmed',
  };
}

// POST /api/purchase
// Body: { accountId: number, productId: number }
// Notes:
// - Ensures account and product exist
// - Pulls one available key from PRODUCT_KEY for the product
// - Inserts into USER_PURCHASE_HISTORY with ISO timestamp
// - Deletes the allocated key so it cannot be reused
// - Removes product from user_wishlist for this user (if present)
exports.createPurchase = async (req, res, next) => {
  const client = await db.connect();
  try {
    const { accountId, productId } = req.body || {};
    const parsedAccountId = Number(accountId);
    const parsedProductId = Number(productId);
    if (Number.isNaN(parsedAccountId) && parsedAccountId <= 0 || Number.isNaN(parsedProductId) && parsedProductId <= 0) {
      throw new AppError('Invalid accountId or productId', 400);
    }

    // Start transaction to ensure atomic allocation and recording
    await client.query('BEGIN');

    // Validate account exists
    const account = await client.query(
      'SELECT id, username, email FROM account WHERE id = $1',
      [parsedAccountId]
    );
    if (account.rowCount === 0) throw new AppError('Account not found', 404);

    // Validate product exists
    const product = await client.query(
      'SELECT id, name_of_product, developer, price FROM product WHERE id = $1',
      [parsedProductId]
    );
    if (product.rowCount === 0) throw new AppError('Product not found', 404);


    await client.query('COMMIT'); //ETHAN: Moved up here as other queries commented out
    // Get one available digital key for this product
    /* 
    const keyResult = await client.query(
      'SELECT key FROM product_key WHERE productid = $1 LIMIT 1',
      [parsedProductId]
    );
    if (keyResult.rowCount === 0) {
      throw new AppError('No digital keys available for this product', 409);
    }
    const allocatedKey = keyResult.rows[0].key;
    */
    //ETHAN: CHANGED TO SERVICE such that purchase controller and productkey endpoints can access the same query
    //console.log("DEBUG parsedProductId: " + parsedProductId)
    const allocatedKey = await getFirstKeyEntry(
        parsedProductId
    );

    console.log("DEBUG DECRYPTED KEY allocatedKey Var: " + allocatedKey)

    const purchasedAt = new Date().toISOString();
    // Record the purchase in USER_PURCHASE_HISTORY
    /*
    const insertPurchase = await client.query(
      `INSERT INTO user_purchase_history (productid, accountid, productkey, date_of_purchase)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [parsedProductId, parsedAccountId, allocatedKey, purchasedAt]
    );
    */

    //ETHAN: Changed to service such that purchase and purchase history routes can call the same query
    //Only create a record if a key is returned
    if(allocatedKey != null){
      var historyRecord = await createPurchaseHistoryEntry({
        accountId: parsedAccountId,
        productId: parsedProductId,
        productKey: allocatedKey
      });
    }

    // Consume the allocated key so it cannot be reused
    // The service getFirstKeyEntry handleds key deletion automatically now
    /* 
    await client.query(
      'DELETE FROM product_key WHERE productid = $1 AND key = $2',
      [parsedProductId, allocatedKey]
    );
    */

    // Optional cleanup: remove from wishlist if present
    /* ETHAN: Commented out as wishlist is not fully implemented.
    await client.query(
      'DELETE FROM user_wishlist WHERE user_id = $1 AND product_id = $2',
      [parsedAccountId, parsedProductId]
    );
    */

    //The product has sold out of keys
    if(allocatedKey == null){
      const product_payload = {
        id: parsedProductId,
        name: product.rows[0].name_of_product,
        developer: product.rows[0].developer,
        price: product.rows[0].price,
      }
      res.status(409).json({ status: 'Purchase Failed', accountId: parsedAccountId, productData: product_payload, message: "No product keys in stock for this product"});
    }

    else{ //Success: game has been purchased
      const confirmation = buildConfirmation({
      purchaseId: historyRecord.id,
      accountId: parsedAccountId,
      product: product.rows[0],
      productKey: allocatedKey,
      purchasedAt,
      });
      res.status(201).json({ status: 'success', data: confirmation });
    }
    
  } catch (err) {
    //ETHAN: Rollback likely no longer works due to service implementation
    try { await client.query('ROLLBACK'); } catch (_) {}
    next(err);
  } finally {
    client.release();
  }
};


