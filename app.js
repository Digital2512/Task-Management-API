// app.js
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/authRoutes');
const connectDB = require('./db');
require('dotenv').config();
const authMiddleware = require('./middleware/authMiddleware'); // Import authMiddleware

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

if (process.env.NODE_ENV !== 'test') {
    connectDB(process.env.MONGO_URI).catch(err => console.log('MongoDB connection error: ', err));
}

module.exports = app;
