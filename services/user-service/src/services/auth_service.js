const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const { User } = require('../models');

const SALT_ROUNDS = 12;

const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

const comparePassword = (password, hash) => bcrypt.compare(password, hash);

const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiresIn,
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwt.refreshSecret);
};

const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    const err = new Error('Email already in use');
    err.statusCode = 409;
    throw err;
  }

  const hashed = await hashPassword(password);
  const user = await User.create({ name, email, password: hashed });

  const payload = { userId: user.id };
  return {
    user: { id: user.id, name: user.name, email: user.email },
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const payload = { userId: user.id };
  return {
    user: { id: user.id, name: user.name, email: user.email },
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

const refreshTokens = async (token) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    const err = new Error('Invalid or expired refresh token');
    err.statusCode = 401;
    throw err;
  }

  const user = await User.findByPk(decoded.userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  const payload = { userId: user.id };
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

module.exports = { register, login, refreshTokens };