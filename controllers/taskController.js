const Task = require('../models/TaskModel');
const { validationResult } = require('express-validator');

exports.createTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const task = new Task({
            ...req.body,
            host: req.userId
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            $or: [{ host: req.userId }, { assignees: req.userId }]
        });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getTaskById = async (req, res) => {
    console.log('Fetching task with ID:', req.params.id);
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            $or: [{ host: req.userId }, { assignees: req.userId }]
        });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateTask = async (req, res) => {
    console.log('Updating task with ID:', req.params.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, host: req.userId },
            { $set: req.body },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found or you do not have permission to update it' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteTask = async (req, res) => {
    console.log('Deleting task with ID:', req.params.id);
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            host: req.userId // Corrected to use host instead of user
        });
        if (!task) {
            return res.status(404).json({ message: 'Task not found or you do not have permission to delete it' });
        }

        res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
