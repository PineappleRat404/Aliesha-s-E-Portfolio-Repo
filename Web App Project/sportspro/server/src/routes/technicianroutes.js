const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();
const { body, validationResult } = require('express-validator');

router.use(authenticate);

//Links to technician controller
const technicianController = require('../controllers/technicianController');

//Links to main controller
const controllermain = require('../controllers/controllerMain');

//Links to technician model
const db = require('../models');
const Technician = db.Technician; 

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
 * /technicians:
 * get:
 * summary: Get all technicians
 * tags: [Technicians]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: List of technicians retrieved successfully
 * 401:
 * description: Unauthorized
 */
//Get all technicians
router.get('/', authorize('ADMIN', 'TECHNICIAN', 'CUSTOMER'), controllermain.getAll(Technician));

/**
 * @swagger
 * /technicians/{techid}:
 * get:
 * summary: Get a technician by ID
 * tags: [Technicians]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: techid
 * schema:
 * type: integer
 * required: true
 * description: ID of the technician
 * responses:
 * 200:
 * description: Technician data retrieved successfully
 * 401:
 * description: Unauthorized
 * 404:
 * description: Technician not found
 */
//Get technician by ID
router.get('/:techid', authorize('ADMIN', 'TECHNICIAN', 'CUSTOMER'), controllermain.getByPk(Technician, 'techid'));

/**
 * @swagger
 * /technicians:
 * post:
 * summary: Create a new technician
 * tags: [Technicians]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - firstname
 * - lastname
 * - email
 * - phone
 * - password
 * properties:
 * firstname:
 * type: string
 * example: John
 * lastname:
 * type: string
 * example: Doe
 * email:
 * type: string
 * format: email
 * example: john.doe@example.com
 * phone:
 * type: string
 * example: "+1234567890"
 * password:
 * type: string
 * example: secretpass123
 * responses:
 * 201:
 * description: Technician created successfully
 * 400:
 * description: Validation error
 * 401:
 * description: Unauthorized
 */
//Create a new technician
router.post('/', authorize('ADMIN'),
[
    body('firstname').notEmpty().withMessage('First Name is required'),
    body('lastname').notEmpty().withMessage('Last Name is required'),
    body('email').isEmail().withMessage('Email Address is required'),
    body('phone').notEmpty().withMessage('Phone Number is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'), 
],
validate,  
technicianController.createTechnician);

/**
 * @swagger
 * /technicians/{techid}:
 * delete:
 * summary: Delete a technician by ID
 * tags: [Technicians]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: techid
 * schema:
 * type: integer
 * required: true
 * description: ID of the technician
 * responses:
 * 200:
 * description: Technician deleted successfully
 * 401:
 * description: Unauthorized
 * 404:
 * description: Technician not found
 */
//Delete technician 
router.delete('/:techid', authorize('ADMIN'), technicianController.deleteTechnician);

module.exports = router;
