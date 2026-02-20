const User = require('./user');
const Address = require('./address');

const models = { User, Address };

Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

module.exports = models;