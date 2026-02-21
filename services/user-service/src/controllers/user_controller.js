const { User } = require('../models');
const { success, error } = require('@emart/shared/utils/response');

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: ['id', 'name', 'email'],
    });
    if (!user) return error(res, 'User not found', 404);
    return success(res, user);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

module.exports = { getProfile };