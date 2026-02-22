const Brand = require('./brand');
const ProductType = require('./product_type');
const Product = require('./product');

const models = { Brand, ProductType, Product };

Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

module.exports = models;