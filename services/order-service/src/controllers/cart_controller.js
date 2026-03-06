const cartService = require('../services/cart_service');
const { success, error } = require('@emart/shared/utils/response');

const getCart = async (req, res) => {
  try {
    const cart = await cartService.getCart(req.user.userId);
    return success(res, cart);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const addItem = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    if (!product_id) return error(res, 'product_id is required', 400);
    const item = await cartService.addItem(req.user.userId, { product_id, quantity });
    return success(res, item, 'Item added to cart', 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const updateItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) return error(res, 'quantity must be at least 1', 400);
    const item = await cartService.updateItem(req.user.userId, req.params.productId, { quantity });
    return success(res, item, 'Cart item updated');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const removeItem = async (req, res) => {
  try {
    await cartService.removeItem(req.user.userId, req.params.productId);
    return success(res, null, 'Item removed from cart');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const clearCart = async (req, res) => {
  try {
    await cartService.clearCart(req.user.userId);
    return success(res, null, 'Cart cleared');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };