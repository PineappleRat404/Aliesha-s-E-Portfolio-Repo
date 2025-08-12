//Links to country model
const { Country } = require('../models');

//NOTE: Get all functions are controlled by controllermain.js - keeps code manageable

exports.createCountry = async (req, res) => { 
    try {
        const { countrycode, countryname } = req.body;

     const newCountry = await Country.create({ 
        countrycode, 
        countryname });

        return res.status(201).json({ message: 'Country created!', country: newCountry });
        } catch(error) { //error handling
            console.error('Error creating country:', error);
            return res.status(500).json({ message: 'Error creating country', error: error.message });
        }
};

exports.updateCountry = async (req, res) => {
    try { 
        const countryCodeInParams = req.params.countrycode;
        const { countryname } = req.body;
        const updateFields = {};

    if (countryname !== undefined) {
        updateFields.countryname = countryname;
    }

    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ message: 'No fields provided for update.' });
    }

    const [updatedRowsCount, updatedCountries] = await Country.update(updateFields,{
            where: { countrycode: countryCodeInParams },
            returning: true,
        });

        if (updatedRowsCount > 0) {
            return res.status(200).json({ message: 'Country updated!', country: updatedCountries[0] });
        } else {
            return res.status(404).json({ message: 'Country not found!' });
        }
    } catch(error) { //error handling
        console.error('Error updating country:', error);
        return res.status(500).json({ message: 'Error updating country', error: error.message });
    };
};

exports.deleteCountry = async (req, res) => {
    try { 
        const countryCodeParam = req.params.countrycode;

    const deletedRows = await Country.destroy({
        where: { countrycode: countryCodeParam }
    });

        if (deletedRows > 0) {
            return res.status(200).json({ message: 'Country deleted!' });
        } else {
            return res.status(404).json({ message: 'Country not found!' });
        }
    } catch(error) { //error handling
        console.error('Error deleting country:', error);
        return res.status(500).json({ message: 'Error deleting country', error: error.message });
    };
};