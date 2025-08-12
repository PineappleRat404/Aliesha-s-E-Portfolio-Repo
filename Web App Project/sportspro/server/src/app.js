const express = require('express');
const cors = require('cors');
const { swaggerUi, specs } = require('./swagger');
const { authenticate, authorize } = require('./middleware/auth');

const app = express();

app.use(cors({ origin: 'http://localhost:8080' })); 

const port = 3001;

// Middleware to parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
console.log('Swagger loaded');

// Routes and models
const sequelize = require('./util/database');

const Technician = require('./models/Technician');
const Incident = require('./models/Incident');
const Customer = require('./models/Customer');
const Country = require('./models/Country');
const Registration = require('./models/Registration');
const Product = require('./models/Product');
const Administrator = require('./models/Administrator');

const customerRoutes = require('./routes/customerRoutes');
const productRoutes = require('./routes/productRoutes');
const technicianRoutes = require('./routes/technicianRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const countryRoutes = require('./routes/countryRoutes');
const administratorRoutes = require('./routes/administratorRoutes');
const loginRoutes = require('./routes/loginRoutes');

// Public routes that don't require authentication
app.use('/api/v1', loginRoutes);

// Authentication middleware for all routes below
app.use(authenticate);

// Protected routes
app.use('/api/v1', customerRoutes);
app.use('/api/v1', productRoutes);
app.use('/api/v1/technicians', technicianRoutes);
app.use('/api/v1/incidents', incidentRoutes);
app.use('/api/v1', registrationRoutes);
app.use('/api/v1', countryRoutes);
app.use('/api/v1', administratorRoutes);

// Authenticate DB connection and start server
sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
        process.exit(1); // Exit if DB connection fails
    });
