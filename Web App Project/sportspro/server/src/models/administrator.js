//Defines administrator model
const Sequelize = require('sequelize');
const db = require('../util/database');

module.exports = (sequelize, DataTypes) => {
  const Administrator = sequelize.define('administrator', {
    username: { 
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    password: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    schema: 'sportspro',
    tableName: 'administrators', 
    timestamps: false,
    id: false, 
  });

  return Administrator;
};