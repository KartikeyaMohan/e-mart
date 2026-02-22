const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Product extends Model {
  static associate(models) {
    Product.belongsTo(models.Brand, { foreignKey: 'brand_id', as: 'brand' });
    Product.belongsTo(models.ProductType, { foreignKey: 'product_type_id', as: 'product_type' });
  }
}

Product.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  brand_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'brands', key: 'id' },
  },
  product_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'product_types', key: 'id' },
  },
}, {
  sequelize,
  modelName: 'Product',
  tableName: 'products',
  timestamps: true,
  underscored: true
});

module.exports = Product;