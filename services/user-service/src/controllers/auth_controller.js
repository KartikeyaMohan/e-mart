const authService = require('../services/auth_service');
const { success, error } = require('@emart/shared/utils/response');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return error(res, 'name, email and password are required', 400);
    }
    const result = await authService.register({ name, email, password });
    return success(res, result, 'User registered successfully', 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return error(res, 'email and password are required', 400);
    }
    const result = await authService.login({ email, password });
    return success(res, result, 'Login successful');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const refresh = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'Refresh token required', 400);
    }

    const refreshToken = authHeader.split(' ')[1];
    if (!refreshToken) return error(res, 'Refresh token required', 400);
    const result = await authService.refreshTokens(refreshToken);
    return success(res, result, 'Tokens refreshed');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = { register, login, refresh };