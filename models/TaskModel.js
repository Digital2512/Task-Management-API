const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        default: 'Description',
    },
    status:{
        type: String,
        enum: ['INBOX', 'PLANNED', 'IN-PROGRESS', 'COMPLETED', 'CANCELLED'],
        default: 'INBOX',
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    dueDate: {
        type: Date,
        default: new Date(),
    },
    host:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assignees: [{
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        ref: 'User',
    }]
}, {timestamps: true});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;