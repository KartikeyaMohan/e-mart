const { Order, Review } = require('../models');

const VALID_STATUSES = ['initiated', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const getAll = (userId) => {
  return Order.findAll({
    where: { user_id: userId },
    include: [{ model: Review, as: 'review' }],
    order: [['created_at', 'DESC']],
  });
};

const getById = async (id, userId) => {
  const order = await Order.findOne({
    where: { id, user_id: userId },
    include: [{ model: Review, as: 'review' }],
  });
  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }
  return order;
};

const create = async ({ user_id, product_id, address_id }) => {
  return Order.create({ user_id, product_id, address_id });
};

const updateStatus = async (id, userId, track_status) => {
  if (!VALID_STATUSES.includes(track_status)) {
    const err = new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
    err.statusCode = 400;
    throw err;
  }
  const order = await getById(id, userId);
  await order.update({ track_status });
  return order;
};

module.exports = { getAll, getById, create, updateStatus };