const db = require('../db/db');
const { AppError } = require('../middleware/errorHandler');

// GET /products/:id
//Get a specific product by id
exports.getWishlistEnrtiesByUserId = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new AppError('Invalid user id', 400);
    const result = await db.query(
      `SELECT *
       FROM user_wishlist WHERE user_id = $1
       ORDER BY RANK`,
      [id]
    );
    if (result.rowCount === 0) throw new AppError('User Wishlist not found', 404);
    res.json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

//creates a wislist entry for given user
//somehow error cheking rank would be helpful for user side, but DB will prevent duplicate
// (productid, userid, rank) combos. Such that every wishlist item must be 

exports.createWishlistItem = async (req, res, next) => {
  try {
    const {
      user_id,
      product_id,
      date_added,
      rank
    } = req.body;

    const insert = await db.query(
      `INSERT INTO user_wishlist
        (user_id,product_id,date_added,rank)
       VALUES ($1,$2,$3,$4)
       RETURNING id, user_id,product_id,date_added,rank`,
      [user_id, product_id,date_added,rank]
    );

    res.status(201).json({ status: 'success', data: insert.rows[0] });
  } catch (err) {
    next(err);
  }
};

