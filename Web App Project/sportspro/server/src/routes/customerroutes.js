const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();
const { body, validationResult } = require('express-validator');

router.use(authenticate);

//Links to customer controller
const customerController = require('../controllers/customerController');

//Links to main controller
const controllermain = require('../controllers/controllerMain');

//Links to customer model
const db = require('../models');
const Customer = db.Customer;

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
 * /customers/login:
 *   post:
 *     summary: Log in as a customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: userpass123
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       401:
 *         description: Invalid credentials or unauthorized
 */
//Customer Login
router.post('/customers/login', authorize('CUSTOMER'), customerController.loginCustomer);

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of customers
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */
//Get all customers 
router.get('/customers', authorize('ADMIN', 'TECHNICIAN', 'CUSTOMER'), controllermain.getAll(Customer));

/**
 * @swagger
 * /customers/{customerid}:
 *   get:
 *     summary: Get a customer by ID
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerid
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the customer
 *     responses:
 *       200:
 *         description: Customer found
 *       404:
 *         description: Customer not found
 */
// Get customer by ID
router.get('/customers/:customerid', authorize('ADMIN', 'TECHNICIAN', 'CUSTOMER'), controllermain.getByPk(Customer, 'customerid'));

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - address
 *               - city
 *               - state
 *               - postalcode
 *               - countrycode
 *               - phone
 *               - email
 *               - password
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: Jane
 *               lastname:
 *                 type: string
 *                 example: Doe
 *               address:
 *                 type: string
 *                 example: 123 Main Street
 *               city:
 *                 type: string
 *                 example: Brisbane
 *               state:
 *                 type: string
 *                 example: QLD
 *               postalcode:
 *                 type: string
 *                 example: 4000
 *               countrycode:
 *                 type: string
 *                 example: AU
 *               phone:
 *                 type: string
 *                 example: "0412345678"
 *               email:
 *                 type: string
 *                 example: jane.doe@example.com
 *               password:
 *                 type: string
 *                 example: securepassword
 *     responses:
 *       201:
 *         description: Customer created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */
// Create a new customer
router.post('/customers', authorize('ADMIN'),
[
    body('firstname').notEmpty().withMessage('First Name is required'),
    body('lastname').notEmpty().withMessage('Last Name is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('postalcode').notEmpty().withMessage('Postal Code is required'),
    body('countrycode').notEmpty().withMessage('Country Code is required'),
    body('phone').notEmpty().withMessage('Phone Number is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
],
validate,
customerController.createCustomer);

/**
 * @swagger
 * /customers/{customerid}:
 *   put:
 *     summary: Update a customer's information
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerid
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               postalcode:
 *                 type: string
 *               countrycode:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer updated
 *       400:
 *         description: Validation or input error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Customer not found
 */
// Update customer information 
router.put('/customers/:customerid', authorize('ADMIN'), customerController.updateCustomer);

module.exports = router;