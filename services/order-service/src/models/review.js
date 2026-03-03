const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Review extends Model {
  static associate(models) {
    Review.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' });
  }
}

Review.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: { model: 'orders', key: 'id' },
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 },
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Review',
  tableName: 'reviews',
  timestamps: true,
  underscored: true,
});

module.exports = Review;