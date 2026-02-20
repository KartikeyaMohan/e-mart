const addressService = require('../services/address_service');
const { success, error } = require('@emart/shared/utils/response');

const createAddress = async (req, res) => {
  try {
    const address = await addressService.createAddress(req.user.userId, req.body);
    return success(res, address, 'Address created', 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const getAddresses = async (req, res) => {
  try {
    const addresses = await addressService.getAddresses(req.user.userId);
    return success(res, addresses);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

module.exports = { createAddress, getAddresses };