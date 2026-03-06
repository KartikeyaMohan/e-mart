const orderService = require('../services/order_service');
const { success, error } = require('@emart/shared/utils/response');

const index = async (req, res) => {
  try {
    const orders = await orderService.getAll(req.user.userId);
    return success(res, orders);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const show = async (req, res) => {
  try {
    const order = await orderService.getById(req.params.id, req.user.userId);
    return success(res, order);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const create = async (req, res) => {
  try {
    const { product_id, address_id } = req.body;
    if (!product_id || !address_id) {
      return error(res, 'product_id and address_id are required', 400);
    }
    const order = await orderService.create({
      user_id: req.user.userId,
      product_id,
      address_id,
    });
    return success(res, order, 'Order placed', 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const updateStatus = async (req, res) => {
  try {
    const { track_status } = req.body;
    if (!track_status) return error(res, 'track_status is required', 400);
    const order = await orderService.updateStatus(req.params.id, req.user.userId, track_status);
    return success(res, order, 'Order status updated');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = { index, show, create, updateStatus };