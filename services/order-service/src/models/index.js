const Order = require('./order');
const Review = require('./review');

const models = { Order, Review };

Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

module.exports = models;