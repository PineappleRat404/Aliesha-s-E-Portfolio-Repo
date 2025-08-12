//Defines product model
const Sequelize = require('sequelize');
const db = require('../util/database');

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('product', {
    productcode: { 
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    version: { 
      type: DataTypes.STRING,
      allowNull: true,
    },
    releasedate: { 
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  }, {
    tableName: 'products', 
    schema: 'sportspro', 
    timestamps: false,
  });

  Product.associate = (models) => {
    Product.hasMany(models.Incident, {
      foreignKey: 'productcode',
      as: 'incidents'
    });
  };

  return Product;
};