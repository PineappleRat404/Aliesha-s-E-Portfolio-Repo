const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();
const { body, validationResult } = require('express-validator');

router.use(authenticate);

//Links to product controller
const productController = require('../controllers/productController'); 

//Links to main controller
const controllermain = require('../controllers/controllerMain');

//Links to product model
const db = require('../models');
const Product = db.Product; 

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
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products retrieved successfully
 *       401:
 *         description: Unauthorized
 */
//Get all products 
router.get('/products', authorize('ADMIN', 'CUSTOMER', 'TECHNICIAN'), controllermain.getAll(Product)); 

/**
 * @swagger
 * /products/{productcode}:
 *   get:
 *     summary: Get a product by code
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productcode
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Product code
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
//Get product by code 
router.get('/products/:productcode', authorize('ADMIN', 'CUSTOMER', 'TECHNICIAN'), controllermain.getByPk(Product, 'productcode')); 

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productcode
 *               - name
 *               - version
 *               - releasedate
 *             properties:
 *               productcode:
 *                 type: string
 *                 example: ABC123
 *               name:
 *                 type: string
 *                 example: WidgetX
 *               version:
 *                 type: string
 *                 example: 1.0.0
 *               releasedate:
 *                 type: string
 *                 example: 2024-01-01
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
//Create a new product 
router.post('/products', authorize('ADMIN'),
[
    body('productcode').notEmpty().withMessage('Product Code is required'),
    body('name').notEmpty().withMessage('Product Name is required'),
    body('version').notEmpty().withMessage('Version Number is required'),
    body('releasedate').notEmpty().withMessage('Release Date is required')
],
validate, 
productController.createProduct);

/**
 * @swagger
 * /products/{productcode}:
 *   delete:
 *     summary: Delete a product by code
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productcode
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Product code
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
//Delete product 
router.delete('/products/:productcode', authorize('ADMIN'), productController.deleteProduct); 

module.exports = router;