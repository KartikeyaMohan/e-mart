const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ProductType extends Model {
  static associate(models) {
    ProductType.hasMany(models.Product, { foreignKey: 'product_type_id', as: 'products' });
  }
}

ProductType.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  modelName: 'ProductType',
  tableName: 'product_types',
  timestamps: true,
  underscored: true
});

module.exports = ProductType;