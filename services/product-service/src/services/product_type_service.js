const { ProductType, Product } = require('../models');

const getAll = () => {
  return ProductType.findAll({ order: [['name', 'ASC']] });
};

const getById = async (id) => {
  const productType = await ProductType.findByPk(id);
  if (!productType) {
    const err = new Error('Brand not found');
    err.statusCode = 404;
    throw err;
  }
  return productType;
};

const create = async ({ name }) => {
  const existing = await ProductType.findOne({ where: { name } });
  if (existing) {
    const err = new Error('Brand with this name already exists');
    err.statusCode = 409;
    throw err;
  }
  return ProductType.create({ name });
};

const update = async (id, { name }) => {
  const productType = await getById(id);
  await productType.update({ name });
  return productType;
};

const remove = async (id) => {
  const productType = await getById(id);
  const productCount = await Product.count({ where: { product_type_id: id } });
  if (productCount > 0) {
    const err = new Error('Cannot delete brand with existing products');
    err.statusCode = 409;
    throw err;
  }
  await productType.destroy();
};

module.exports = { getAll, getById, create, update, remove };