//Links to customer model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Customer } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET;

// NOTE: Get all functions are controlled by controllermain.js - keeps code manageable

exports.createCustomer = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      address,
      city,
      state,
      postalcode,
      countrycode,
      phone,
      email,
      password
    } = req.body;

    if (!password || !email || !firstname || !lastname) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCustomer = await Customer.create({
      firstname,
      lastname,
      address,
      city,
      state,
      postalcode,
      countrycode,
      phone,
      email,
      password: hashedPassword
    });

    //Generates token on registration
    const token = jwt.sign(
      { id: newCustomer.customerid, role: 'customer' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(201).json({
      message: 'Customer created!',
      customer: {
        id: newCustomer.customerid,
        firstname,
        lastname,
        email
      },
      token
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    return res.status(500).json({ message: 'Error creating customer', error: error.message });
  }
};


exports.updateCustomer = async (req, res) => {
  try {
    const customerid = req.params.customerid;
    const {
      firstname,
      lastname,
      address,
      city,
      state,
      postalcode,
      countrycode,
      phone,
      email,
      password
    } = req.body;

    const updateFields = {};
    if (firstname !== undefined) updateFields.firstname = firstname;
    if (lastname !== undefined) updateFields.lastname = lastname;
    if (address !== undefined) updateFields.address = address;
    if (city !== undefined) updateFields.city = city;
    if (state !== undefined) updateFields.state = state;
    if (postalcode !== undefined) updateFields.postalcode = postalcode;
    if (countrycode !== undefined) updateFields.countrycode = countrycode;
    if (phone !== undefined) updateFields.phone = phone;
    if (email !== undefined) updateFields.email = email;
    if (password !== undefined) {
      updateFields.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No fields provided for update.' });
    }

    const [updatedRowsCount, updatedCustomers] = await Customer.update(
      updateFields,
      {
        where: { customerid },
        returning: true,
      });

    if (updatedRowsCount > 0) {
      const updated = updatedCustomers[0].toJSON();
      delete updated.password;
      return res.status(200).json({ message: 'Customer updated!', customer: updated });
    } else {
      return res.status(404).json({ message: 'Customer not found!' });
    }
  } catch (error) {
    console.error('Error updating customer:', error);
    return res.status(500).json({ message: 'Error updating customer', error: error.message });
  }
};


exports.loginCustomer = async (req, res) => {
  const { email, password } = req.body;

  try {
    const customer = await Customer.findOne({ where: { email } });

    if (!customer) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: customer.customerid, role: 'customer' },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      customer: {
        id: customer.customerid,
        firstname: customer.firstname,
        lastname: customer.lastname,
        email: customer.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'An error occurred during login.' });
  }
};

/**
 * API documentation
 * /customers/{customerid}:
 *   delete:
 *     summary: Delete a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: customerid
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the customer to delete
 *     responses:
 *       200:
 *         description: Customer deleted
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Server error
 */
exports.deleteCustomer = async (req, res) => {
  try {
    const customerid = req.params.customerid;

    const deletedRows = await Customer.destroy({
      where: { customerid }
    });

    if (deletedRows > 0) {
      return res.status(200).json({ message: 'Customer deleted!' });
    } else {
      return res.status(404).json({ message: 'Customer not found!' });
    }
  } catch (error) {
    console.error('Error deleting customer:', error);
    return res.status(500).json({ message: 'Error deleting customer', error: error.message });
  }
};


exports.logoutCustomer = async (req, res) => {
  return res.status(200).json({ message: 'Logout successful.' });
};