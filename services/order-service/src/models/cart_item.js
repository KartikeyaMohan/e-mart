const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class CartItem extends Model {
  static associate(models) {
    CartItem.belongsTo(models.Cart, { foreignKey: 'cart_id', as: 'cart' });
  }
}

CartItem.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cart_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'carts', key: 'id' },
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: { min: 1 },
  },
}, {
  sequelize,
  modelName: 'CartItem',
  tableName: 'cart_items',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['cart_id', 'product_id'],
    },
  ],
  underscored: true
});

module.exports = CartItem;