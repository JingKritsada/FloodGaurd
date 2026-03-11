const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const ExampleController = require('../controllers/ExampleController');
const { validation } = require('../middlewares/validationMiddleware');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Apply authentication middleware globally
router.use(authenticateToken);

// Define routes
router.post('/', [
    body('field_1')
        .trim()
        .isLength({ min: 1, max: 255 })
        .withMessage('Field 1 is required and must be between 1 and 255 characters'),
    body('field_2')
        .optional()
        .trim()
        .isLength({ max: 255 })
        .withMessage('Field 2 must be less than 255 characters'),
    body('field_3')
        .optional()
        .isNumeric()
        .withMessage('Field 3 must be a number'),
], validation, ExampleController.createExample);

router.get('/', ExampleController.getAllExamples);
router.get('/:id', ExampleController.getExampleById);

router.put('/:id', [
    body('field_1')
        .optional()
        .trim()
        .isLength({ min: 1, max: 255 })
        .withMessage('Field 1 must be between 1 and 255 characters'),
    body('field_2')
        .optional()
        .trim()
        .isLength({ max: 255 })
        .withMessage('Field 2 must be less than 255 characters'),
    body('field_3')
        .optional()
        .isNumeric()
        .withMessage('Field 3 must be a number'),
], validation, ExampleController.updateExample);

module.exports = router;
