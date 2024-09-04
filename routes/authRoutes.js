const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const authController = require('../controllers/authController');
require('dotenv').config();

const router = express.Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

module.exports = router;
