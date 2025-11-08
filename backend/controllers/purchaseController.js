// Controller for handling simulated purchases
// Usage: POST /api/purchase with body { accountId: number, productId: number }
// Behavior: Allocates a digital key for the product, records the transaction,
//           removes the allocated key from the pool, optionally cleans wishlist,
//           and returns a confirmation JSON with timestamp.
const db = require('../db/db');
const { AppError } = require('../middleware/errorHandler');

// Helper to standardize confirmation payload for the client
function buildConfirmation({ purchaseId, accountId, product, productKey, purchasedAt }) {
  return {
    transactionId: purchaseId,
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
    if (Number.isNaN(parsedAccountId) || Number.isNaN(parsedProductId)) {
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

    // Get one available digital key for this product
    const keyResult = await client.query(
      'SELECT key FROM product_key WHERE productid = $1 LIMIT 1',
      [parsedProductId]
    );
    if (keyResult.rowCount === 0) {
      throw new AppError('No digital keys available for this product', 409);
    }
    const allocatedKey = keyResult.rows[0].key;

    const purchasedAt = new Date().toISOString();
    // Record the purchase in USER_PURCHASE_HISTORY
    const insertPurchase = await client.query(
      `INSERT INTO user_purchase_history (productid, accountid, productkey, date_of_purchase)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [parsedProductId, parsedAccountId, allocatedKey, purchasedAt]
    );

    // Consume the allocated key so it cannot be reused
    await client.query(
      'DELETE FROM product_key WHERE productid = $1 AND key = $2',
      [parsedProductId, allocatedKey]
    );

    // Optional cleanup: remove from wishlist if present
    await client.query(
      'DELETE FROM user_wishlist WHERE user_id = $1 AND product_id = $2',
      [parsedAccountId, parsedProductId]
    );

    await client.query('COMMIT');

    const confirmation = buildConfirmation({
      purchaseId: insertPurchase.rows[0].id,
      accountId: parsedAccountId,
      product: product.rows[0],
      productKey: allocatedKey,
      purchasedAt,
    });

    res.status(201).json({ status: 'success', data: confirmation });
  } catch (err) {
    try { await client.query('ROLLBACK'); } catch (_) {}
    next(err);
  } finally {
    client.release();
  }
};


