const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Destructure models directly from the models/index.js export
const { Customer, Technician, Administrator, sequelize } = require('../models'); 

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; 

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Checks customer
    const customer = await Customer.findOne({ where: { email } });
    if (customer && await bcrypt.compare(password, customer.password)) {
      const token = jwt.sign({ id: customer.customerid, role: 'CUSTOMER' }, JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token });
    }

    // Checks technician
    const technician = await Technician.findOne({ where: { email } });
    if (technician && await bcrypt.compare(password, technician.password)) {
      const token = jwt.sign({ id: technician.techid, role: 'TECHNICIAN' }, JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token });
    }

    // Checks administrator
    const admin = await Administrator.findOne({ where: { username: email } });
    if (admin && await bcrypt.compare(password, admin.password)) {
      const token = jwt.sign({ id: admin.username, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token });
    }

    return res.status(401).json({ message: 'Invalid email or password' });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error', details: err.message }); 
  }
};