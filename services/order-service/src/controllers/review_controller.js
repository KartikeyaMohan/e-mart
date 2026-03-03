const reviewService = require('../services/review_service');
const { success, error } = require('@emart/shared/utils/response');

const getByProduct = async (req, res) => {
  try {
    const reviews = await reviewService.getByProductId(req.params.productId);
    return success(res, reviews);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const create = async (req, res) => {
  try {
    const { order_id, score, description } = req.body;
    if (!order_id || !score) return error(res, 'order_id and score are required', 400);
    const review = await reviewService.create({
      order_id,
      score,
      description,
      user_id: req.user.userId,
    });
    return success(res, review, 'Review submitted', 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = { getByProduct, create };