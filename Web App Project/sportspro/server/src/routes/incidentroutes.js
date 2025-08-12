const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();
const { body, validationResult } = require('express-validator');

router.use(authenticate);

//Links to incident controller
const incidentController = require('../controllers/incidentController'); 

//Links to main controller
const controllermain = require('../controllers/controllerMain');

//Links to incident model
const db = require('../models'); 
const Incident = db.Incident; 

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
 * /incidents/assigned:
 * get:
 * summary: Get incidents assigned to the current user
 * tags: [Incidents]
 * responses:
 * 200:
 * description: List of assigned incidents
 * 403:
 * description: Unauthorized
 */
// Get assigned incidents 
router.get('/assigned', authorize('ADMIN', 'CUSTOMER', 'TECHNICIAN'), incidentController.getAssignedIncidents);

/**
 * @swagger
 * /incidents/unassigned:
 * get:
 * summary: Get all unassigned incidents
 * tags: [Incidents]
 * responses:
 * 200:
 * description: List of unassigned incidents
 * 403:
 * description: Unauthorized
 */
// Fetches unassigned incidents 
router.get('/unassigned', authorize('ADMIN', 'TECHNICIAN'), incidentController.getUnassignedIncidents);

/**
 * @swagger
 * /incidents:
 * get:
 * summary: Get all incidents
 * tags: [Incidents]
 * responses:
 * 200:
 * description: List of all incidents
 * 500:
 * description: Internal server error
 */
//Get all incidents 
router.get('/', authorize('ADMIN', 'CUSTOMER', 'TECHNICIAN'), function(req, res, next) { 
    try {
       const handler = controllermain.getAll(Incident);
       handler(req, res); 
    } catch (error) {
       console.error("Error setting up or running /incidents/ GET route:", error);
       res.status(500).json({ message: "Internal server error." });
    }
});

/**
 * @swagger
 * /incidents/{incidentid}:
 * get:
 * summary: Get an incident by ID
 * tags: [Incidents]
 * parameters:
 * - in: path
 * name: incidentid
 * required: true
 * schema:
 * type: integer
 * description: ID of the incident
 * responses:
 * 200:
 * description: Incident data
 * 404:
 * description: Incident not found
 */
//Get incident by id 
router.get('/:incidentid', authorize('ADMIN', 'CUSTOMER', 'TECHNICIAN'), function(req, res, next) {
    try {
        const handler = controllermain.getByPk(Incident, 'incidentid');
        handler(req, res);
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
});

/**
 * @swagger
 * /incidents:
 * post:
 * summary: Create a new incident
 * tags: [Incidents]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - customerid
 * - productcode
 * - dateopened
 * - title
 * - description
 * properties:
 * customerid:
 * type: integer
 * techid:
 * type: integer
 * nullable: true
 * productcode:
 * type: string
 * dateopened:
 * type: string
 * format: date
 * dateclosed:
 * type: string
 * format: date
 * nullable: true 
 * title:
 * type: string
 * description:
 * type: string
 * responses:
 * 201:
 * description: Incident created
 * 400:
 * description: Validation error
 */
//Create a new Incident 
router.post('/', authorize('ADMIN', 'TECHNICIAN'),
[
    body('customerid').isInt().withMessage('Customer ID required'),
    body('techid').optional({ nullable: true }).isInt().withMessage('Technician ID must be an integer if provided'),
    body('productcode').notEmpty().withMessage('Product Code is required'),
    body('dateopened').notEmpty().withMessage('Date Opened is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Please enter a description'),
],
validate, 
incidentController.createIncident);

/**
 * @swagger
 * /incidents/{incidentid}:
 * put:
 * summary: Update an existing incident
 * tags: [Incidents]
 * parameters:
 * - in: path
 * name: incidentid
 * required: true
 * schema:
 * type: integer
 * description: ID of the incident
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * customerid:
 * type: integer
 * productcode:
 * type: string
 * techid:
 * type: integer
 * nullable: true
 * dateopened:
 * type: string
 * format: date
 * dateclosed:
 * type: string
 * format: date
 * nullable: true 
 * title:
 * type: string
 * description:
 * type: string
 * responses:
 * 200:
 * description: Incident updated
 * 400:
 * description: No fields provided
 * 404:
 * description: Incident not found
 */
//Update incident 
router.put('/:incidentid', authorize('ADMIN', 'TECHNICIAN'),
[
    body('customerid').optional().isInt().withMessage('Customer ID must be a number'),
    body('techid').optional({ nullable: true }).isInt().withMessage('Technician ID must be a number if provided'),
    body('productcode').optional().notEmpty().withMessage('Product code is required'),
    body('dateopened').optional().notEmpty().withMessage('Date Opened is required'),
    body('title').optional().notEmpty().withMessage('Title is required'),
    body('description').optional().notEmpty().withMessage('Please enter a description'),
],
validate, 
incidentController.updateIncident); 

module.exports = router;
