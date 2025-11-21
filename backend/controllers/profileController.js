const db = require('../db/db');
const { AppError } = require('../middleware/errorHandler');

/**
 * GET /user/profile
 * Returns the authenticated user's profile information
 * Protected route - requires JWT authentication
 */
exports.getUserProfile = async (req, res, next) => {
  try {
    const accountId = req.user?.accountId || req.user?.id;
    
    if (!accountId) {
      throw new AppError('User account information not found in token', 403);
    }

    const query = `
      SELECT 
        id,
        username,
        age,
        email
      FROM ACCOUNT
      WHERE id = $1
    `;

    const { rows } = await db.query(query, [accountId]);
    
    if (rows.length === 0) {
      throw new AppError('User profile not found', 404);
    }

    const user = rows[0];
    
    res.json({
      status: 'success',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        age: user.age
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /user/profile
 * Updates the authenticated user's profile information
 * Protected route - requires JWT authentication
 */
exports.updateUserProfile = async (req, res, next) => {
  try {
    const accountId = req.user?.accountId || req.user?.id;
    
    if (!accountId) {
      throw new AppError('User account information not found in token', 403);
    }

    const { username, email, age } = req.body;
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (username !== undefined) {
      updates.push(`username = $${paramCount++}`);
      values.push(username);
    }
    if (email !== undefined) {
      updates.push(`email = $${paramCount++}`);
      values.push(email);
    }
    if (age !== undefined) {
      updates.push(`age = $${paramCount++}`);
      values.push(age);
    }

    if (updates.length === 0) {
      throw new AppError('No fields to update', 400);
    }

    values.push(accountId);
    const query = `
      UPDATE ACCOUNT
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, username, email, age
    `;

    const { rows } = await db.query(query, values);
    
    if (rows.length === 0) {
      throw new AppError('User profile not found', 404);
    }

    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: rows[0]
    });
  } catch (err) {
    next(err);
  }
};

