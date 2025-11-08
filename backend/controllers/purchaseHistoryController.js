const db = require('../db/db');
const { AppError } = require('../middleware/errorHandler');

// GET 
//get all linked user history data by account id
exports.getUserPurchaseHistory = async (req, res, next) => {
  try {
    //validate user input (prevent injection)
    const accountId = parseInt(req.params.accountid, 10); //only allow int numbers
    if(Number.isNaN(accountId) || accountId <= 0){
        throw new AppError('Invalid product id', 400);
    }

    const result = await db.query(
      `SELECT productid, accountid, productkey, date_of_purchase
       FROM user_purchase_history
       WHERE accountid = $1`,
       [accountId]
    );
    res.json({ status: 'success', count: result.rowCount, data: result.rows });
  } catch (err) {
    next(err);
  }
};

// POST 
// insert a new user history record into user_purchase_history table
//provide decrypted product key

exports.postUserPurchaseHistory = async (req, res, next) => {
    //validate user input (prevent injection)
    const accountId = parseInt(req.params.accountid, 10); //only allow int numbers
    if(Number.isNaN(accountId) || accountId <= 0){
        throw new AppError('Invalid product id', 400);
    }

    try {
    const {
        productid,
        productkey //SEND THE DECRYPTED KEY
    } = req.body;

    //VALIDATE JSON DATA
    const productId_valid = parseInt(productid, 10);
    if (Number.isNaN(productId_valid) || productId_valid <= 0) {
      throw new AppError('Invalid productID', 400);
    }

    if (typeof productkey !== 'string') {
      throw new AppError('Invalid productKey', 400);
    }

    const insert = await db.query(
      `INSERT INTO user_purchase_history
        (productid, accountid, productKey)
       VALUES ($1,$2,$3)
       RETURNING id, productid, accountid, productKey, date_of_purchase`,
      [productId_valid, accountId, productkey]
    );

    res.status(201).json({ status: 'success', data: insert.rows[0] });
  } catch (err) {
    next(err);
  }
};