//Defines technicians model
const Sequelize = require('sequelize');
const db = require('../util/database');

module.exports = (sequelize, DataTypes) => {
  const Technician = sequelize.define('technician', {
    techid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'technicians',
    schema: 'sportspro', 
    timestamps: false,
  });

  Technician.associate = (models) => {
    Technician.hasMany(models.Incident, {
      foreignKey: 'techid',
      as: 'incidents',
    });
  };

  return Technician;
};