const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();
const { body, validationResult } = require('express-validator');

router.use(authenticate);

//Links to registration controller
const registrationController = require('../controllers/registrationController');

//Links to main controller
const controllermain = require('../controllers/controllerMain');

//Links to registration model
const db = require('../models');
const Registration = db.Registration; 

// Validation Middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * @swagger
 * /registrations:
 *   get:
 *     summary: Get all registrations
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of registrations retrieved successfully
 *       401:
 *         description: Unauthorized
 */
//Get all registrations
router.get('/registrations', authorize('ADMIN'), controllermain.getAll(Registration));

/**
 * @swagger
 * /registrations:
 *   post:
 *     summary: Create a new registration
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerid
 *               - productcode
 *               - registrationdate
 *             properties:
 *               customerid:
 *                 type: integer
 *                 example: 123
 *               productcode:
 *                 type: string
 *                 example: ABC123
 *               registrationdate:
 *                 type: string
 *                 format: date
 *                 example: 2024-07-01
 *     responses:
 *       201:
 *         description: Registration created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
//Create a new registration
router.post('/registrations', authorize('ADMIN', 'CUSTOMER'),
[
    body('customerid').notEmpty().withMessage('Customer ID is required'),
    body('productcode').notEmpty().withMessage('Product Code is required'),
    body('registrationdate').notEmpty().withMessage('Registration date is required'), 
],
validate, 
registrationController.createRegistration);

module.exports = router;