// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByEmail, findUserByUsername, addUser } = require('../models/user.model');

const SECRET_KEY = process.env.JWT_SECRET || 'mysecretkey';

/**
 * Register a new user
 * POST /api/auth/register
 * Body: { username, email, password, age }
 */
const register = async (req, res) => {
  try {
    const { username, email, password, age } = req.body;

    // Validation
    if (!username || !email || !password || !age) {
      return res.status(400).json({ 
        message: 'All fields are required: username, email, password, age' 
      });
    }

    if (typeof age !== 'number' || age < 0 || age > 150) {
      return res.status(400).json({ 
        message: 'Age must be a valid number between 0 and 150' 
      });
    }

    // Check if user already exists by email
    const existingUserByEmail = await findUserByEmail(email);
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Check if user already exists by username
    const existingUserByUsername = await findUserByUsername(username);
    if (existingUserByUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Hash password with bcrypt (salt rounds: 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const newUser = await addUser({
      username,
      email,
      password: hashedPassword,
      age
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email,
        username: newUser.username
      },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        age: newUser.age
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle database constraint violations
    if (error.code === '23505') { // Unique constraint violation
      return res.status(400).json({ 
        message: 'Username or email already exists' 
      });
    }
    
    res.status(500).json({ 
      message: 'Internal server error during registration' 
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 * Body: { email, password }
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password with bcrypt
    // Handle both TEXT and BYTEA password formats
    let passwordMatch = false;
    if (typeof user.password === 'string') {
      // Password is stored as TEXT (bcrypt hash)
      passwordMatch = await bcrypt.compare(password, user.password);
    } else if (Buffer.isBuffer(user.password)) {
      // Password is stored as BYTEA - convert to string first
      const passwordString = user.password.toString('utf8');
      passwordMatch = await bcrypt.compare(password, passwordString);
    }

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        username: user.username
      },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        age: user.age
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Internal server error during login' 
    });
  }
};

module.exports = {
  register,
  login,
};
