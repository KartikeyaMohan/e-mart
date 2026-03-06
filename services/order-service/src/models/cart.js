const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Cart extends Model {
  static associate(models) {
    Cart.hasMany(models.CartItem, { foreignKey: 'cart_id', as: 'items' });
  }
}

Cart.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,       // enforces one cart per user at the DB level
  },
}, {
  sequelize,
  modelName: 'Cart',
  tableName: 'carts',
  timestamps: true,
  underscored: true
});

module.exports = Cart;