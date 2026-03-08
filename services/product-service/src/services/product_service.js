const { Product, Brand, ProductType } = require('../models');
const { getImageUrl } = require('../utils/storage');

const defaultInclude = [
  { model: Brand, as: 'brand', attributes: ['id', 'name'] },
  { model: ProductType, as: 'product_type', attributes: ['id', 'name'] },
];

const formatProduct = async (product) => {
  const data = product.toJSON();
  data.image_url = await getImageUrl(data.image_key);
  return data;
};

const getAll = async ({ brand_id, product_type_id } = {}) => {
  const where = {};
  if (brand_id) where.brand_id = brand_id;
  if (product_type_id) where.product_type_id = product_type_id;

  const products = await Product.findAll({
    where,
    include: defaultInclude,
    order: [['name', 'ASC']],
  });

  return Promise.all(products.map(formatProduct));
};

const getById = async (id) => {
  const product = await Product.findByPk(id, { include: defaultInclude });
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return formatProduct(product);
};

const create = async ({ name, price, brand_id, product_type_id, image_key }) => {
  // Verify brand and product type exist
  const brand = await Brand.findByPk(brand_id);
  if (!brand) {
    const err = new Error('Brand not found');
    err.statusCode = 404;
    throw err;
  }

  const productType = await ProductType.findByPk(product_type_id);
  if (!productType) {
    const err = new Error('Product type not found');
    err.statusCode = 404;
    throw err;
  }

  const product = await Product.create({ name, price, brand_id, product_type_id, image_key });
  return getById(product.id);
};

const update = async (id, { name, price, brand_id, product_type_id, image_key }) => {
  const product = await getById(id);

  if (brand_id) {
    const brand = await Brand.findByPk(brand_id);
    if (!brand) {
      const err = new Error('Brand not found');
      err.statusCode = 404;
      throw err;
    }
  }

  if (product_type_id) {
    const productType = await ProductType.findByPk(product_type_id);
    if (!productType) {
      const err = new Error('Product type not found');
      err.statusCode = 404;
      throw err;
    }
  }

  const updateData = { name, price, brand_id, product_type_id };
  if (image_key) updateData.image_key = image_key;

  await product.update(updateData);
  return getById(id);
};

const remove = async (id) => {
  const product = await getById(id);
  await product.destroy();
};

const updateRating = async (id, { average_rating, review_count }) => {
  const product = await getById(id);
  await product.update({ average_rating, review_count });
  return product;
};

module.exports = { getAll, getById, create, update, remove, updateRating };