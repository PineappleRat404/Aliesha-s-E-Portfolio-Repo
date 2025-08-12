const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();
const { body, validationResult } = require('express-validator');

router.use(authenticate);

//Links to administrator controller
const administratorController = require('../controllers/administratorController'); 

//Links to main controller
const controllermain = require('../controllers/controllerMain');

//Links to administrator model
const db = require('../models');
const Administrator = db.Administrator; 

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
 * /administrators:
 *   get:
 *     summary: Get all administrators
 *     tags: [Administrators]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of administrators
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */
//Get all administrators 
router.get('/administrators', authorize('ADMIN'), controllermain.getAll(Administrator)); 

/**
 * @swagger
 * /administrators/{username}:
 *   get:
 *     summary: Get administrator by username
 *     tags: [Administrators]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Administrator's username
 *     responses:
 *       200:
 *         description: Administrator found
 *       404:
 *         description: Administrator not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */
//Get administrator by username
router.get('/administrators/:username', authorize('ADMIN'), controllermain.getByPk(Administrator, 'username'));

/**
 * @swagger
 * /administrators:
 *   post:
 *     summary: Create a new administrator
 *     tags: [Administrators]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin123
 *               password:
 *                 type: string
 *                 example: secretpass
 *     responses:
 *       201:
 *         description: Administrator created
 *       500:
 *         description: Server error
 */

//Create a new Administrator
router.post('/administrators', authorize('ADMIN'),
[
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role').isIn(['ADMIN', 'TECHNICIAN', 'CUSTOMER']).withMessage('Invalid role') 
],
validate,
administratorController.createAdministrator);

module.exports = router;