//Defines registration model
const Sequelize = require('sequelize');
const db = require('../util/database');

module.exports = (sequelize, DataTypes) => {
  const Registration = sequelize.define('registration', {
    customerid: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true, // part of composite primary key
    },
    productcode: { 
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true, // part of composite primary key
    },
    registrationdate: { 
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  }, {
    schema: 'sportspro',
    tableName: 'registrations', 
    timestamps: false, 
    id: false,
  });

  return Registration;
};