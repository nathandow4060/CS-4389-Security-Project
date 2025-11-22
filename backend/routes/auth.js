//AUTHOR: Alp Bayrak
// routes/auth.js
//import express from 'express';
const express = require('express');
const ctrl = require('../controllers/authController');

const router = express.Router();

router.post('/signup', ctrl.signup);
router.post('/login', ctrl.login);

module.exports =  router;
