const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
require('dotenv').config();


const JWT_SECRET = process.env.JWT_SECRET;

// Password validation function
const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};


exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        const userFound = await User.findOne({ username });
        if (userFound) {
            return res.status(400).json({ message: 'Username is already in use' });
        }

        // Validate the password
        if (!validatePassword(password)) {
            return res.status(400).json({ message: 'Password does not follow the format' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create and save the user
        const user = new User({ username, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registeration successful' });
    } catch (error) {
        res.status(400).json({ message: `Error message: ${error.message}` });
    }
};


exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(400).json({ message: `Error message: ${error.message}` });
    }
};
