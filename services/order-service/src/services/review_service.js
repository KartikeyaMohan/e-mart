const { Review, Order } = require('../models');

const getByProductId = (product_id) => {
  return Review.findAll({
    where: { product_id },
    order: [['created_at', 'DESC']],
  });
};

const create = async ({ order_id, score, description, user_id }) => {
  // Verify the order belongs to the user making the review
  const order = await Order.findOne({ where: { id: order_id, user_id } });
  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }

  // Order must be delivered before it can be reviewed
  if (order.track_status !== 'delivered') {
    const err = new Error('Order must be delivered before it can be reviewed');
    err.statusCode = 400;
    throw err;
  }

  // Check if review already exists for this order
  const existing = await Review.findOne({ where: { order_id } });
  if (existing) {
    const err = new Error('A review already exists for this order');
    err.statusCode = 409;
    throw err;
  }

  return Review.create({ order_id, product_id: order.product_id, score, description });
};

module.exports = { getByProductId, create };