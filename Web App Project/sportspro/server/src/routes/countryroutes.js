const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();
const { body, validationResult } = require('express-validator');

//NOTE: No area exists in the web app yet to create new countries, but added for future development (in my own free time). 

router.use(authenticate);

//Links to country controller
const countryController = require('../controllers/countryController'); 

//Links to main controller
const controllermain = require('../controllers/controllerMain');

//Links to country model
const db = require('../models');
const Country = db.Country;

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
 * /countries:
 *   get:
 *     summary: Get all countries
 *     tags: [Countries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of countries
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */
//Get all countries 
router.get('/countries', authorize('ADMIN'), controllermain.getAll(Country)); 

/**
 * @swagger
 * /countries/{countrycode}:
 *   get:
 *     summary: Get a country by its code
 *     tags: [Countries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: countrycode
 *         required: true
 *         schema:
 *           type: string
 *         description: The country code (e.g., "AU")
 *     responses:
 *       200:
 *         description: Country found
 *       404:
 *         description: Country not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */
//Get country by country
router.get('/countries/:countrycode', authorize('ADMIN'), controllermain.getByPk(Country, 'countrycode')); 

/**
 * @swagger
 * /countries:
 *   post:
 *     summary: Create a new country
 *     tags: [Countries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - countryName
 *               - countryCode
 *             properties:
 *               countryName:
 *                 type: string
 *                 example: Australia
 *               countryCode:
 *                 type: string
 *                 example: AU
 *     responses:
 *       201:
 *         description: Country created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */
//Create a new country 
router.post('/countries', authorize('ADMIN'),
[
    body('countryName').notEmpty().withMessage('Country Name is required'),
    body('countryCode').isLength({ min: 2, max: 2}).withMessage('country Code is required'),
], 
validate,
countryController.createCountry);

module.exports = router;