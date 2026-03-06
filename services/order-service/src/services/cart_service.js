const { Cart, CartItem } = require('../models');

// Fetch cart for user, creating one if it doesn't exist yet
const getOrCreateCart = async (userId) => {
  const [cart] = await Cart.findOrCreate({
    where: { user_id: userId },
    defaults: { user_id: userId },
  });
  return cart;
};

const getCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  return Cart.findByPk(cart.id, {
    include: [{ model: CartItem, as: 'items' }],
  });
};

const addItem = async (userId, { product_id, quantity = 1 }) => {
  const cart = await getOrCreateCart(userId);

  // If product already in cart, increment quantity instead of inserting a new row
  const existingItem = await CartItem.findOne({
    where: { cart_id: cart.id, product_id },
  });

  if (existingItem) {
    await existingItem.update({ quantity: existingItem.quantity + quantity });
    return existingItem;
  }

  return CartItem.create({ cart_id: cart.id, product_id, quantity });
};

const updateItem = async (userId, productId, { quantity }) => {
  const cart = await getOrCreateCart(userId);

  const item = await CartItem.findOne({
    where: { cart_id: cart.id, product_id: productId },
  });

  if (!item) {
    const err = new Error('Item not found in cart');
    err.statusCode = 404;
    throw err;
  }

  await item.update({ quantity });
  return item;
};

const removeItem = async (userId, productId) => {
  const cart = await getOrCreateCart(userId);

  const deleted = await CartItem.destroy({
    where: { cart_id: cart.id, product_id: productId },
  });

  if (!deleted) {
    const err = new Error('Item not found in cart');
    err.statusCode = 404;
    throw err;
  }
};

const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  await CartItem.destroy({ where: { cart_id: cart.id } });
};

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };