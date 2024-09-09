const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//password validation
function validatePassword(password){
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase =  /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return(
        password.length >=  minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
    );
}

//user register
router.post('/register', async(req, res) => {
    const{ username, password} = req.body;

    if(!validatePassword(password)){
        return res.status(400).json({
            message: 
            'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.',
        });
    }

    try{
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(400).json({message: 'Username is already taken'});
        }
        const user = new User({username, password});
        await user.save();
        res.status(201).json({message: 'User registered successfully'});
    }catch(error){
        res.status(500).json({message: 'Error registering user', error});
    }
});

//user login
router.post('/login', async(req, res) => {
    const{username, password} = req.body;
    try{
        const user = await User.findOne({username});
        if(!user) return res.status(400).json({message: 'Invalid credentials'});

        const isMatch = await user.comparePassword(password);
        if(!isMatch) return res.status(400).json({message: 'Invalid credentials'});

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.json({token});
    }catch(error){
        res.status(500).json({message: 'Error loggin in', error});
    }
});

module.exports = router;