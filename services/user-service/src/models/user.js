'use strict';

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {
  static associate(models) {
    User.hasMany(models.Address, { foreignKey: 'user_id', as: 'addresses' });
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
  underscored: true,
});

module.exports = User;