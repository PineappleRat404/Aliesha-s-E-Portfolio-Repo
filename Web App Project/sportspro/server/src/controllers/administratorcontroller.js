//Links to administrator model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Administrator } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET;

//NOTE: Get all functions are controlled by controllermain.js - keeps code manageable

exports.createAdministrator = async (req, res) => { 
    try {
        const { 
            username, 
            password 
        } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdministrator = await Administrator.create({ 
        username, 
        password:hashedPassword
    });

    //Generates token on registration
    const token = jwt.sign(
        { username: newAdministrator.username, role: 'administrator' },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

            return res.status(201).json({
      message: 'Administrator created!',
      administrator: {
        username: newAdministrator.username,
      },
      token
    });
        } catch(error) {
            //Error handling
            console.error('Error creating administrator:', error);
            return res.status(500).json({ message: 'Error creating administrator', error: error.message });
        }
};