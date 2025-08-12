//Defines incident model
const Sequelize = require('sequelize');
const db = require('../util/database');

module.exports = (sequelize, DataTypes) => {
  const Incident = sequelize.define('incident', {
    incidentid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    customerid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productcode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    techid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'technicians',
        key: 'techid',
      }
    },
    dateopened: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dateclosed: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  }, {
    tableName: 'incidents',
    schema: 'sportspro', 
    timestamps: false,
  });

  //Defines customer, product and technician associations
  Incident.associate = (models) => {
    Incident.belongsTo(models.Customer, {
      foreignKey: 'customerid',
      as: 'customer',
    });

    Incident.belongsTo(models.Technician, {
      foreignKey: 'techid',
      as: 'technician',
    });

    Incident.belongsTo(models.Product, {
      foreignKey: 'productcode',
      as: 'product',
    });
  };

  return Incident;
};
