const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = require('../app');
const Category = require('../models/CategoryModel');
const Test = require('supertest/lib/test');

const mongoURI = process.env.MONGO_URI;

const categoryID = '66dc8fb13bb17b72bc79efc8';

beforeAll(async () => {
    await mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe('Category Management', () => {
    test('should create a category', async () => {
        const response = await request(app)
            .post('/api/categories/create')
            .send({
                name: 'PERSONAL',
                description: 'Personal tasks'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe('PERSONAL');
    });

    test('should list all the categories', async () => {
        const response = await request(app)
            .get('/api/categories/retrieve')

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    test('should update a category', async () => {
        const response = await request(app)
            .put(`/api/categories/update/${categoryID}`)
            .send({ description: 'Updated description' });
        
        expect(response.statusCode).toBe(200);
        expect(response.body.description).toBe('Updated description');
    });

    test('should delete a category', async() => {
        const response = await request(app)
            .delete(`/api/categories/delete/${categoryID}`)

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Category deleted');
    });
});
