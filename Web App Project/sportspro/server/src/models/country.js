//Defines country model
const Sequelize = require('sequelize');
const db = require('../util/database');

module.exports = (sequelize, DataTypes) => {
  const Country = sequelize.define('country', {
    countrycode: { 
      type: DataTypes.STRING(2),
      allowNull: false,
      primaryKey: true,
    },
    countryname: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    schema: 'sportspro',
    tableName: 'countries', 
    timestamps: false,
  });

  return Country;
};