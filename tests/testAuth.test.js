const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = require('../app'); 
const User = require('../models/UserModel');

const mongoURI = process.env.MONGO_URI;

beforeAll(async () => {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe('User Registeration and Login Tests', () => {
    test('should register a new user successfully', async () => {
        const response = await request(app)
            .post('/api/users/register')
            .send({
                username: 'testUser',
                password: 'testUser123!'
            });
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('User registeration successful');
    });

    test('should not allow registration with a duplicated username', async () => {

        const response = await request(app)
            .post('/api/users/register')
            .send({
                username: 'testUser',
                password: 'testUser123!'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Username is already in use');
    });

    test('should not allow registration with an invalid password', async () => {
        const response = await request(app)
            .post('/api/users/register')
            .send({
                username: 'testUser1',
                password: 'testuser123'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Password does not follow the format');
    });

    test('should login with correct credentials', async () => {
        const response = await request(app)
            .post('/api/users/login')
            .send({
                username: 'testUser',
                password: 'testUser123!',
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Login successful');
        expect(response.body.token).toBeDefined();
    });

    test('should not login with incorrect credentials', async () => {
        const response = await request(app)
            .post('/api/users/login')
            .send({
                username: 'testUser',
                password: 'testuser123.'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Invalid credentials');
    });
});
