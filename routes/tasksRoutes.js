const express = require('express');
const { body, param } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const taskController = require('../controllers/taskController');

const router = express.Router();

router.post(
    '/create',
    authMiddleware,
    [
        body('title').not().isEmpty().withMessage('Title is required'),
        body('category').not().isEmpty().withMessage('Category must be filled'),
        body('host').not().isEmpty().withMessage('Host must not be empty'),
        body('dueDate').optional().isISO8601().toDate().withMessage('Due date must be a valid date'),
        body('assignees').optional().isArray().withMessage('Assignees should be an array of userIDs'),
    ],
    taskController.createTask
);

router.get('/retrieveAll', authMiddleware, taskController.getTasks);

router.get('/retrieveByID/:id', authMiddleware, [
    param('id').isMongoId().withMessage('Invalid Task ID')
], taskController.getTaskById);

router.put('/update/:id', authMiddleware, [
    param('id').isMongoId().withMessage('Invalid Task ID'),
    body('title').optional().not().isEmpty().withMessage('Title is required'),
    body('category').optional().not().isEmpty().withMessage('Category is required'),
    body('host').optional().not().isEmpty().withMessage('Host must not be empty'),
    body('dueDate').optional().isISO8601().toDate().withMessage('Due date must be a valid date'),
    body('assignees').optional().isArray().withMessage('Assignees should be an array of userIDs'),
], taskController.updateTask);

router.delete('/delete/:id', authMiddleware, [
    param('id').isMongoId().withMessage('Invalid Task ID')
], taskController.deleteTask);

module.exports = router;
