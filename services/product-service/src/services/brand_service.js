const { Brand, Product } = require('../models');

const getAll = () => {
  return Brand.findAll({ order: [['name', 'ASC']] });
};

const getById = async (id) => {
  const brand = await Brand.findByPk(id);
  if (!brand) {
    const err = new Error('Brand not found');
    err.statusCode = 404;
    throw err;
  }
  return brand;
};

const create = async ({ name }) => {
  const existing = await Brand.findOne({ where: { name } });
  if (existing) {
    const err = new Error('Brand with this name already exists');
    err.statusCode = 409;
    throw err;
  }
  return Brand.create({ name });
};

const update = async (id, { name }) => {
  const brand = await getById(id);
  await brand.update({ name });
  return brand;
};

const remove = async (id) => {
  const brand = await getById(id);
  const productCount = await Product.count({ where: { brand_id: id } });
  if (productCount > 0) {
    const err = new Error('Cannot delete brand with existing products');
    err.statusCode = 409;
    throw err;
  }
  await brand.destroy();
};

module.exports = { getAll, getById, create, update, remove };