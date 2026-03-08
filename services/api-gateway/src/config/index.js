require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  services: {
    userServiceUrl: process.env.USER_SERVICE_URL,
    productServiceUrl: process.env.PRODUCT_SERVICE_URL,
    orderServiceUrl: process.env.ORDER_SERVICE_URL,
  },
};