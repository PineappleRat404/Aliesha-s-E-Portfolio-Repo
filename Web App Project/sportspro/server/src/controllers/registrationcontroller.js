//Links to registration model
const { Registration } = require('../models');

//NOTE: Get all functions are controlled by controllermain.js - keeps code manageable

exports.createRegistration = async (req, res) => {
    try {
        const { customerid, productcode, registrationdate } = req.body;

        const newRegistration = await Registration.create({ 
            customerid, 
            productcode, 
            registrationdate 
        });

        return res.status(201).json({ message: 'Registration created!', registration: newRegistration });
        } catch(error) {
            console.error('Error creating registration:', error);
            return res.status(500).json({ message: 'Error creating registration', error: error.message });
        };
};