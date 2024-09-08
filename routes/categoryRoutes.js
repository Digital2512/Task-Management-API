const express = require('express');
const { body, param } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.post(
    '/create',
    [
        body('name').not().isEmpty().withMessage('Name is required'),
        body('description').optional().isString().withMessage('Description must be a string'),
    ],
    categoryController.createCategory
);

router.get('/retrieve', categoryController.getCategories);

router.put('/update/:id', [
    param('id').isMongoId().withMessage('Invalid Category ID'),
    body('name').optional().not().isEmpty().withMessage('Name is required'),
    body('description').optional().not().isEmpty().isString().withMessage('Description must be a string'),
], categoryController.updateCategory);

router.delete('/delete/:id', [
    param('id').isMongoId().withMessage('Invalid Category ID')
], categoryController.deleteCategory);

module.exports = router;
