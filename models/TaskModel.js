const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
    },
    status:{
        type: String,
        enum: ['INBOX', 'PLANNED', 'IN-PROGRESS', 'COMPLETED', 'CANCELLED'],
        default: 'INBOX',
    },
    dueDate: {
        type: Date,
    },
    host:{
        tyrpe: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assignees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
}, {timestamps: true});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;