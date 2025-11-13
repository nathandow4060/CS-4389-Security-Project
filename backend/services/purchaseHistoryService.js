const db = require('../db/db');

async function createPurchaseHistoryEntry({ accountId, productId, productKey }) {
    //Assumes only validated data is sent to service

    const query = `
        INSERT INTO user_purchase_history
        (productid, accountid, productkey)
        VALUES ($1, $2, $3)
        RETURNING id, productid, accountid, productKey, date_of_purchase
    `;

    const { rows } = await db.query(query, [productId, accountId, productKey]);
    return rows[0];
}

module.exports = { createPurchaseHistoryEntry};