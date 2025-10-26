// controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, addUser } from '../models/user.model.js';

const SECRET_KEY = process.env.JWT_SECRET || 'mysecretkey';

export const signup = async (req, res) => {
  const { email, password } = req.body;
  if (findUserByEmail(email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const hashed = await bcrypt.hash(password, 10);
  addUser({ email, password: hashed });
  res.status(201).json({ message: 'Signup successful' });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email);
  if (!user) return res.status(400).json({ message: 'User not found' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ message: 'Login successful', token });
};
