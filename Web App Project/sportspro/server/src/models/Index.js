const Sequelize = require('sequelize');
const config = require('../util/database'); 

const sequelize = config; 

// Import model definition functions
const TechnicianModel = require('./Technician');
const CustomerModel = require('./Customer');
const ProductModel = require('./Product'); 
const IncidentModel = require('./Incident'); 
const CountryModel = require('./Country');
const RegistrationModel = require('./Registration');
const AdministratorModel = require('./Administrator');

// Initialize models
const Technician = TechnicianModel(sequelize, Sequelize.DataTypes);
const Customer = CustomerModel(sequelize, Sequelize.DataTypes);
const Product = ProductModel(sequelize, Sequelize.DataTypes); 
const Incident = IncidentModel(sequelize, Sequelize.DataTypes); 
const Country = CountryModel(sequelize, Sequelize.DataTypes);
const Registration = RegistrationModel(sequelize, Sequelize.DataTypes);
const Administrator = AdministratorModel(sequelize, Sequelize.DataTypes);

//Association setups
const models = {
  Technician,
  Incident,
  Customer,
  Product,
  Country,
  Registration,
  Administrator
};

Object.values(models).forEach(model => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  Sequelize,
  ...models
};
