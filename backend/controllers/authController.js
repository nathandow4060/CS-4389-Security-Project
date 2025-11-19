const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByUsername, postUser } = require('../services/manageAccounts');

const SECRET_KEY = process.env.JWT_SECRET || 'mysecretkey';

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

exports.signup = async (req, res) => {
  try {
    const { username, password, age, email } = req.body;
    const user = await findUserByUsername(username);

    if (user) {
      return res.status(400).json({ message: 'Account already exists' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Hash password before storing
    const hashed = await bcrypt.hash(password, 10);
    const returnRow = await postUser({ username, password: hashed, age, email });

    if (returnRow) {
      res.status(201).json({ message: 'Signup successful' });
    } else {
      res.status(400).json({ message: 'Error during Signup' });
    }
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Internal server error during signup' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await findUserByUsername(username);

    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare hashed password with bcrypt
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({
      email: user.email,
      accountId: user.id,
      username: user.username
    }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error during login' });
  }
};
