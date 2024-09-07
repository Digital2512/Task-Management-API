const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = require('../app');
const Task = require('../models/TaskModel');
const Test = require('supertest/lib/test');

const mongoURI = process.env.MONGO_URI;

let token;
const userID1 = '66dc7f01e39fa2e10d324daf';
const userID2 = '66dc7ed446011937cb54283f';

beforeAll(async () => {
    await mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});

    const response = await request(app)
        .post('/api/users/login')
        .send({ username: 'testUser', password: 'testUser123!' });
    token = response.body.token;
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe('Task Manipulation', () => {
    test('should create a task without assignees', async () => {
        const response = await request(app)
            .post('/api/tasks/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'New Task without assignees',
                category: 'PERSONAL',
                dueDate: new Date(),
                host: userID1,
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe('New Task without assignees');
        expect(response.body.category).toBe('INBOX');
        expect(response.body.host).toBe(userID1);
    });

    test('should create a task with assignees', async () => {
        const response = await request(app)
            .post('/api/tasks/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'New Task with assignees',
                category: 'GROUP',
                dueDate: new Date(),
                host: userID1,
                assignees: [userID2]
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe('New Task with assignees');
        expect(response.body.category).toBe('INBOX');
        expect(response.body.host).toBe(userID1);
        expect(response.body.assignees).toEqual(
            expect.arrayContaining([userID2])
        );
    });

    test('should get all the tasks for the user', async () => {
        const response = await request(app)
            .get('/api/tasks/retrieveAll')
            .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    test('should get a task by the ID', async () => {
        const taskID = '66dc8490f8ca079e79948e9b';
        const response = await request(app)
            .get(`/api/tasks/retrieveByID/${taskID}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined(); // Assuming response should have a body
    });

    test('should update a task', async() => {
        const taskID = '66dc8490f8ca079e79948e9d';
        const response = await request(app)
            .put(`/api/tasks/update/${taskID}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Updated task',
                status: 'IN-PROGRESS',
                assignees: [userID1, userID2]
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe('Updated task');
        expect(response.body.status).toBe('IN-PROGRESS');
    });

    test('should delete a task', async() => {
        const taskID = '66dc8490f8ca079e79948e9b';
        const response = await request(app)
            .delete(`/api/tasks/delete/${taskID}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Task deleted');
    });
});
