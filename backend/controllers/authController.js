// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByUsername, postUser } = require('../services/manageAccounts');

const SECRET_KEY = process.env.JWT_SECRET || 'mysecretkey';
const PGP_ENCRYPTION_KEY = process.env.PGP_ENCRYPTION_KEY || 'c65ef18bd3a0183cedce4ff720f1f437d070194f916479d5874aef0964b62f29';

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

exports.signup = async (req, res) => {
  try {
    const {username, password, age, email} = req.body;
    const user = await findUserByUsername(username);
    console.log(user)
    if (user != undefined) {
      return res.status(400).json({ message: 'Account already exists' });
    }

    //validate email address strucure (name@provider.com)
    if(!isValidEmail(email)){
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Hash password with bcrypt before encrypting with PGP
    const hashed = await bcrypt.hash(password, 10);
    const returnRow = await postUser({username, password: hashed, age, email});
    console.log(returnRow)

    if(returnRow != null){
      res.status(201).json({ message: 'Signup successful' });
    }
    else{
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
      return res.status(400).json({ message: 'Invalid username or password' }); // do not give clues as to whether password or username is wrong
    }

    // user.password is already decrypted by findUserByUsername (it uses pgp_sym_decrypt)
    // So we can directly compare with bcrypt
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Include accountId in JWT token for RBAC
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
