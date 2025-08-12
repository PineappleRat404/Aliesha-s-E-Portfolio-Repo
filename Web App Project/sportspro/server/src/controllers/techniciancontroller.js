//Links to technician model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Technician } = require('../models');
const { Incident } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET;

//NOTE: Get all functions are controlled by controllermain.js - keeps code manageable

exports.createTechnician = async (req, res) => {
    try { 
        const { 
            firstname, 
            lastname, 
            email, 
            phone, 
            password 
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const newTechnician = await Technician.create({ 
            firstname, 
            lastname, 
            email, 
            phone, 
            password: hashedPassword 
        });

        //Generates token on registration
        const token = jwt.sign(
            { id: newTechnician.techid, role: 'technician' },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        const techData = { ...newTechnician.get(), password: undefined };

        return res.status(201).json({ 
            message: 'Technician created!', 
            technician: newTechnician,
            token 
            });
        } catch(error) { // Error handling 
            console.error('Error creating technician:', error);
            return res.status(500).json({ message: 'Error creating technician', error: error.message });
        };
};

exports.deleteTechnician = async (req, res) => {
    try {  
        const techid = req.params.techid;

        await Incident.destroy({
            where: { techid: techid }
        })

        const deletedRows = await Technician.destroy({
            where: { techid: techid }
        })

        if (deletedRows > 0) {
            return res.status(200).json({ message: 'Technician deleted!' });
        } else { //error handling
            return res.status(404).json({ message: 'Technician not found!' });
        }
    } catch(error) { //error handling
        console.error('Error deleting technician:', error);
        return res.status(500).json({ message: 'Error deleting technician', error: error.message });
    };
};
