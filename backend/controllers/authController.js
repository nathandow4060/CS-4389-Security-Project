// controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
//import { findUserByEmail, addUser } from '../models/user.model.js';
import { findUserByUsername, postUser } from '../services/manageAccounts.js';

const SECRET_KEY = process.env.JWT_SECRET || 'mysecretkey';

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const signup = async (req, res) => {
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

  const hashed = await bcrypt.hash(password, 10);
  const returnRow  = postUser({username, password: hashed, age, email});
  console.log(returnRow)

  if(returnRow != null){
    res.status(201).json({ message: 'Signup successful' });
  }
  else{
    res.status(400).json({ message: 'Error during Signup' });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await findUserByUsername(username);
  if (!user) return res.status(400).json({ message: 'Invalid username or password' }); // do not give clues as to whether password or username is wrong

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid username or password' });

  const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ message: 'Login successful', token });
};
