const { Address } = require('../models');

const createAddress = async (userId, body) => {
  if (body.is_default) {
    await Address.update({ is_default: false }, { where: { user_id: userId } });
  }

  const address = await Address.create({ ...body, user_id: userId });
  return address;
};

const getAddresses = async (userId) => {
  return Address.findAll({
    where: { user_id: userId },
    order: [['is_default', 'DESC'], ['created_at', 'DESC']],
  });
};

module.exports = { createAddress, getAddresses };