const { DataTypes } = require('sequelize');
const sequelize = require('../util/database'); 
const { Role } = require('../constants');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  role: {
    type: DataTypes.ENUM(...Object.values(Role)),
    defaultValue: Role.USER,
    allowNull: false,
  },
}, {
  tableName: 'users', 
});

module.exports = User;
