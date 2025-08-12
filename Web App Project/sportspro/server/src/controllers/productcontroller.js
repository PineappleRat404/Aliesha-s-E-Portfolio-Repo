//Links to product model
const { Product } = require('../models');
//Links to incident & registration model - allows for deletion of products
const { Incident } = require('../models');
const { Registration } = require('../models');

//NOTE: Get all functions are controlled by controllermain.js - keeps code manageable

exports.createProduct = async (req, res) => { 
    try {
        const { productcode, name, version, releasedate } = req.body;

    const newProduct = await Product.create({ 
        productcode, 
        name, 
        version, 
        releasedate })

        return res.status(201).json({ message: 'Product created!', product: newProduct });
        } catch(error) { //Error handling
            console.error('Error creating product:', error.stack); 
            return res.status(500).json({ message: 'Error creating product', error: error.message });
        };
}


exports.deleteProduct = async (req, res) => {
    try { 
        const productCodeParam = req.params.productcode;

        await Incident.destroy({
            where: { productcode: productCodeParam }
        })

        await Registration.destroy({
            where: { productcode: productCodeParam }
        })

        const deletedRows = await Product.destroy({
            where: { productcode: productCodeParam }
        })

        if (deletedRows > 0) {
            return res.status(200).json({ message: 'Product deleted!' });
        } else {
            return res.status(404).json({ message: 'Product not found!' });
        }
    } catch(error) { // Error handling 
        console.error('Error deleting product:', error);
        return res.status(500).json({ message: 'Error deleting product', error: error.message });
    };
}