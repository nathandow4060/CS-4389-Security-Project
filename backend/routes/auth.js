// routes/auth.js
//import express from 'express';
//import { signup, login } from '../controllers/authController.js';
const express = require('express');
const ctrl = require('../controllers/authController');

const router = express.Router();

router.post('/signup', ctrl.signup);
router.post('/login', ctrl.login);

module.exports =  router;
