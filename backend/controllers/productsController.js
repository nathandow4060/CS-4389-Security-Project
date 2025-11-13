const db = require('../db/db');
const { AppError } = require('../middleware/errorHandler');

// GET /products
//get all products
exports.getAllProducts = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT *
       FROM product
       ORDER BY id DESC`
    );
    res.json({ status: 'success', count: result.rowCount, data: result.rows });
  } catch (err) {
    next(err);
  }
};

// GET /products/:id
//Get a specific product by id
exports.getProductById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id) || id <= 0) throw new AppError('Invalid product id', 400);
    const result = await db.query(
      `SELECT *
       FROM product WHERE id = $1`,
      [id]
    );
    if (result.rowCount === 0) throw new AppError('Product not found', 404);
    res.json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// POST /products
// insert a new product into DB product table
exports.createProduct = async (req, res, next) => {
  try {
    const {
      name_of_product,
      developer,
      price,
      image_url,
      description,
      esrb_rating,
    } = req.body;

    const insert = await db.query(
      `INSERT INTO product
        (name_of_product, developer, price, image_url, description, esrb_rating)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id, name_of_product, developer, price, image_url, description, esrb_rating`,
      [name_of_product, developer, price, image_url, description, esrb_rating]
    );

    res.status(201).json({ status: 'success', data: insert.rows[0] });
  } catch (err) {
    next(err);
  }
};

// PATCH /products/:id
//Update a product in the DB
exports.updateProduct = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    //if id is not a number throw error
    if (Number.isNaN(id) || id <= 0) throw new AppError('Invalid product id', 400);

    const payload = (req.body && typeof req.body === 'object') ? req.body : {};
    // Build a dynamic UPSERT that only sets provided fields
    const fields = [ //all fields that exist on product table
      'digital_key',
      'name_of_product',
      'developer',
      'price',
      'image_url',
      'description',
      'esrb_rating',
    ];

    const user_fields = []; //the list of fields the user provided for update
    const values = []; //values the user provided for those fields
    //determine if passed fields are a subset of product table fields. If not throw error, if yes parse fields and values
    const incomingKeys = Object.keys(payload);
    const validKeys = new Set(fields);
    const invalidKeys = incomingKeys.filter((k) => !validKeys.has(k));
    console.log("Incoming keys " + incomingKeys)
    if (invalidKeys.length > 0) {
      throw new AppError(
        `Invalid field(s): ${invalidKeys.join(', ')}. Allowed fields: ${fields.join(', ')}.`,
        400
      );
    }

    //else fields are valid, create field value postgres command
    incomingKeys.forEach((field, _) => {
        user_fields.push(`${field} = $${values.length + 1}`); //construct field and value mapping scheme
        values.push(payload[field]); //push each value associated with passed keys
    });

    console.log(user_fields)

    if (user_fields.length == 0) throw new AppError('No fields provided to update', 400);

    values.push(id);
    //SQL query to send to DB
    const sql = `
      UPDATE product
      SET ${user_fields.join(', ')}
      WHERE id = $${values.length}
      RETURNING id, digital_key, name_of_product, developer, price, image_url, description, esrb_rating
    `;

    const result = await db.query(sql, values);
    if (result.rowCount === 0) throw new AppError('Product not found', 404);
    res.json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};


// DELETE /products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id) || id <= 0) throw new AppError('Invalid product id', 400);
    const result = await db.query('DELETE FROM product WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) throw new AppError('Product not found', 404);
    res.status(204).send(); // No Content
  } catch (err) {
    next(err);
  }
};

// Ensure CommonJS export shape is explicit for route imports
module.exports = {
  getAllProducts: exports.getAllProducts,
  getProductById: exports.getProductById,
  createProduct: exports.createProduct,
  updateProduct: exports.updateProduct,
  deleteProduct: exports.deleteProduct,
};