const Task = require('../models/TaskModel');
const Category = require('../models/CategoryModel');
const { validationResult } = require('express-validator');

exports.createTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { categoryName, ...taskData } = req.body;

        let categoryID;

        if (categoryName) {
            const category = await Category.findOne({ name: categoryName.toUpperCase() });
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            categoryID = category._id;
        }

        const task = new Task({
            ...taskData,
            category: categoryID, // Ensure this is assigned
            host: req.userId, // Current logged-in user is the host
        });

        await task.save();
        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
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
        console.error('Error creating task:', error);
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
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getTasksByCategoryID = async (req, res) => {
    console.log('Fetching task with ID:', req.params.id);
    try {
        const task = await Task.findOne({
            category: req.params.categoryID,
            $or: [{ host: req.userId }, { assignees: req.userId }]
        });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updateTask = async (req, res) => {
    console.log('Updating task with ID:', req.params.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {categoryName, title, host, assignees, dueDate, status, description} = req.body;

        const updateTask = await Task.findOne({_id: req.params.id});

        if(!updateTask){
            return res.status(404).json({message: 'Task not found or you do not have permission to alter it'});
        }

        let categoryUpdateID = updateTask.category;

        if(categoryName){
            const category = await Category.findOne({
                name: categoryName
            });

            if(!category){
                return res.status(404).json({message: 'Category not found'});
            }

            categoryUpdateID = category._id;
        }

        const updateData = {
            title: title || updateTask.title,
            status: status || updateTask.status,
            dueDate: dueDate || updateTask.dueDate,
            assignees: assignees && assignees.length > 0 ? assignees: updateTask.assignees,
            category: categoryUpdateID ,
            host: host || updateTask.host,
            description: description || updateTask.description,

        };

        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, host: req.userId },
            { $set: updateData },
            { new: true }
        );

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteTask = async (req, res) => {
    console.log('Deleting task with ID:', req.params.id);
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            host: req.userId 
        });
        if (!task) {
            return res.status(404).json({ message: 'Task not found or you do not have permission to delete it' });
        }

        res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
