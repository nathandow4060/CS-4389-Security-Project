// models/user.model.js
const pool = require('../db/db');

/**
 * Find a user by email
 * @param {string} email - User's email address
 * @returns {Promise<Object|null>} User object or null if not found
 */
const findUserByEmail = async (email) => {
  try {
    const result = await pool.query(
      'SELECT id, username, password, age, email FROM account WHERE email = $1',
      [email]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
};

/**
 * Find a user by username
 * @param {string} username - User's username
 * @returns {Promise<Object|null>} User object or null if not found
 */
const findUserByUsername = async (username) => {
  try {
    const result = await pool.query(
      'SELECT id, username, password, age, email FROM account WHERE username = $1',
      [username]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error finding user by username:', error);
    throw error;
  }
};

/**
 * Find a user by ID
 * @param {number} id - User's ID
 * @returns {Promise<Object|null>} User object or null if not found
 */
const findUserById = async (id) => {
  try {
    const result = await pool.query(
      'SELECT id, username, password, age, email FROM account WHERE id = $1',
      [id]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error finding user by id:', error);
    throw error;
  }
};

/**
 * Add a new user to the database
 * @param {Object} user - User object with username, email, password, age
 * @returns {Promise<Object>} Created user object (without password)
 */
const addUser = async (user) => {
  const { username, email, password, age } = user;
  try {
    const result = await pool.query(
      'INSERT INTO account (username, email, password, age) VALUES ($1, $2, $3, $4) RETURNING id, username, email, age',
      [username, email, password, age]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

module.exports = {
  findUserByEmail,
  findUserByUsername,
  findUserById,
  addUser,
};