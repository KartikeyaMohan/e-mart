const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Order extends Model {
  static associate(models) {
    Order.hasOne(models.Review, { foreignKey: 'order_id', as: 'review' });
  }
}

Order.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  track_status: {
    type: DataTypes.ENUM('initiated', 'confirmed', 'shipped', 'delivered', 'cancelled'),
    allowNull: false,
    defaultValue: 'initiated',
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  address_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'orders',
  timestamps: true,
  underscored: true,
});

module.exports = Order;