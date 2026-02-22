const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Brand extends Model {
  static associate(models) {
    Brand.hasMany(models.Product, { foreignKey: 'brand_id', as: 'products' });
  }
}

Brand.init({
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
  modelName: 'Brand',
  tableName: 'brands',
  timestamps: true,
  underscored: true,
});

module.exports = Brand;