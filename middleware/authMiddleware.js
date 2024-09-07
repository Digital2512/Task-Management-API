const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Changed 'Headers' to 'headers'

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1]; // Changed 'splits' to 'split'

    if (!token) {
        return res.status(401).json({ message: 'Token is invalid' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => { // Changed 'JWT_SECeRET' to 'JWT_SECRET'
        if (err) {
            return res.status(403).json({ message: 'Invalid Token' });
        }

        req.userId = user.userId;
        next();
    });
};

module.exports = authMiddleware;
