//Defines customer model
const Sequelize = require('sequelize');
const db = require('../util/database');

module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('customer', {
    customerid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postalcode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
    
  }, {
    tableName: 'customers',
    schema: 'sportspro', 
    timestamps: false,
  });

  Customer.associate = (models) => {
    Customer.hasMany(models.Incident, {
      foreignKey: 'customerid',
      as: 'incidents',
    });
  };

  return Customer;
};