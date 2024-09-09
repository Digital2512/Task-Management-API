const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const User = require('../models/UserModel');
const authRoutes = require('../routes/authRoutes');
const { beforeEach } = require('node:test');
require('dotenv').config();

app.use(express.json());
app.use('/auth', authRoutes);

beforeAll(async() => {
    await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});;
    await User.deleteMany({});
});

afterAll(async() => {
    await mongoose.connection.close();
});

describe('User Registeration and Login', () => {
    test('should register a new user', async() => {
        const response = await request(app)
        .post('/auth/register')
        .send({
            username: 'testUser',
            password: 'Test123!',
        });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
    });

    test('should not register duplicated user', async () => {
        const response = await request(app)
        .post('/auth/register')
        .send({
            username: 'testUser',
            password: 'Test123!'
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Username is already taken');
    });

    test('should not register with wrong password format', async () => {
        const response = await request(app)
        .post('/auth/register')
        .send({
            username: 'testUser1',
            password: 'test123!'
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
    });

    test('should login with valid credentials', async() => {
        const response = await request(app)
        .post('/auth/login')
        .send({
            username: 'testUser',
            password: 'Test123!',
        });

        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeDefined();
    });

    test('should not login with invalid credentials', async() => {
        const response = await request(app)
        .post('/auth/login')
        .send({
            username: 'testUser',
            password: 'TestUser123.'
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Invalid credentials');
    });
});