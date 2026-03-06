const Order = require('./order');
const Review = require('./review');
const Cart = require('./cart');
const CartItem = require('./cart_item');

const models = { Order, Review, Cart, CartItem };

Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

module.exports = models;