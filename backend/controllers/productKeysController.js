const db = require('../db/db');
const { AppError } = require('../middleware/errorHandler');

// GET /productkeys
//get all lnked product keys on product id
exports.getAllKeysById = async (req, res, next) => {
  try {
    //validate user input (prevent injection)
    const productId = parseInt(req.params.id, 10); //only allow int numbers
    if(Number.isNaN(productId) || productId <= 0){
        throw new AppError('Invalid product id', 400);
    }

    const result = await db.query(
      `SELECT key
       FROM product_key
       WHERE productid = $1`,
       [productId]
    );
    res.json({ status: 'success', count: result.rowCount, data: result.rows });
  } catch (err) {
    next(err);
  }
};

exports.getAllDecryptedKeysbyID = async (req, res, next) => {
  try {
    //validate user input (prevent injection)
    const productId = parseInt(req.params.id, 10); //only allow int numbers
    if(Number.isNaN(productId) || productId <= 0){
        throw new AppError('Invalid product id', 400);
    }

    const result = await db.query(
      `SELECT pgp_sym_decrypt(key, $1) as key
       FROM product_key
       WHERE productid = $2`,
       [process.env.PG_ENCRYPTION_SECRET, productId]
    );
    res.json({ status: 'success', count: result.rowCount, data: result.rows });
  } catch (err) {
    next(err);
  }
};


// GET productkeys count by ID
exports.getKeysCountById = async (req, res, next) => {
  try {
    //validate user input (prevent injection)
    const productId = parseInt(req.params.id, 10); //only allow int numbers
    if(Number.isNaN(productId) || productId <= 0){
        throw new AppError('Invalid product id', 400);
    }

    const result = await db.query(
      `SELECT COUNT(DISTINCT key) FROM PRODUCT_KEY
       WHERE productid = $1`,
       [productId]
    );
    res.json({ status: 'success', count: result.rowCount, data: result.rows });
  } catch (err) {
    next(err);
  }
};

//DELETE product key be searching for unique tuple (productid, key)
exports.deleteProductkeyByIdAndKey = async (req, res, next) => {
  try {
    //validate json input (prevent injection)
    const keyObj = req.body?.key;
    console.log("Check keyobj: " + keyObj)
    if (!keyObj || keyObj.type !== 'Buffer' || !Array.isArray(keyObj.data)) {
      throw new AppError('Body must include { "key": { "type":"Buffer", "data": [...] } }', 400);
    }
    const arr = keyObj.data;
    if (arr.length === 0 || !arr.every(n => Number.isInteger(n) && n >= 0 && n <= 255)) {
      throw new AppError('key.data must be an array of 0..255 integers', 400);
    }

    // key size guard reject keys not wihin range
    if (arr.length < 128 || arr.length > 512) {
        throw new AppError('key size out of range', 400);
    }

    //Reconstruct Buffer for BYTEA comparison
    const keyBuffer = Buffer.from(Uint8Array.from(arr));

    //validate productid
    const productId = parseInt(req.params.id, 10); //only allow int numbers
    if(Number.isNaN(productId) || productId <= 0){
        throw new AppError('Invalid product id', 400);
    }
    
    const result = await db.query('DELETE FROM product_key WHERE productid = $1 AND key = $2 RETURNING productid', [productId,keyBuffer]);
    if (result.rowCount === 0) throw new AppError('Product not found', 404);
    res.status(204).send(); // No Content
  } catch (err) {
    next(err);
  }
};