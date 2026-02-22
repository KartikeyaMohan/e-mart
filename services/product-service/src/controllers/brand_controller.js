const brandService = require('../services/brand_service');
const { success, error } = require('@emart/shared/utils/response');

const index = async (req, res) => {
  try {
    const brands = await brandService.getAll();
    return success(res, brands);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const show = async (req, res) => {
  try {
    const brand = await brandService.getById(req.params.id);
    return success(res, brand);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const create = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return error(res, 'name is required', 400);
    const brand = await brandService.create({ name });
    return success(res, brand, 'Brand created', 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const update = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return error(res, 'name is required', 400);
    const brand = await brandService.update(req.params.id, { name });
    return success(res, brand, 'Brand updated');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const remove = async (req, res) => {
  try {
    await brandService.remove(req.params.id);
    return success(res, null, 'Brand deleted');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = { index, show, create, update, remove };