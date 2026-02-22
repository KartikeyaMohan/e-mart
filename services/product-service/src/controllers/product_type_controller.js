const productTypeService = require('../services/product_type_service');
const { success, error } = require('@emart/shared/utils/response');

const index = async (req, res) => {
  try {
    const productTypes = await productTypeService.getAll();
    return success(res, productTypes);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const show = async (req, res) => {
  try {
    const productType = await productTypeService.getById(req.params.id);
    return success(res, productType);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const create = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return error(res, 'name is required', 400);
    const productType = await productTypeService.create({ name });
    return success(res, productType, 'Product type created', 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = { index, show, create };