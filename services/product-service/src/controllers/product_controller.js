const productService = require('../services/product_service');
const { success, error } = require('@emart/shared/utils/response');

const index = async (req, res) => {
  try {
    const products = await productService.getAll(req.query);
    return success(res, products);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const show = async (req, res) => {
  try {
    const product = await productService.getById(req.params.id);
    return success(res, product);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const create = async (req, res) => {
  try {
    const { name, price, brand_id, product_type_id } = req.body;
    if (!name || !price || !brand_id || !product_type_id) {
      return error(res, 'name, price, brand_id and product_type_id are required', 400);
    }
    const product = await productService.create({ name, price, brand_id, product_type_id });
    return success(res, product, 'Product created', 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const update = async (req, res) => {
  try {
    const product = await productService.update(req.params.id, req.body);
    return success(res, product, 'Product updated');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const remove = async (req, res) => {
  try {
    await productService.remove(req.params.id);
    return success(res, null, 'Product deleted');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const updateRating = async (req, res) => {
  try {
    const { average_rating, review_count } = req.body;
    const product = await productService.updateRating(req.params.id, { average_rating, review_count });
    return success(res, product, 'Rating updated');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = { index, show, create, update, remove, updateRating };