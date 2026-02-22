const createAuthMiddleware = require('@emart/shared/middleware/authenticate');
const config = require('../config');

module.exports = createAuthMiddleware(config.jwt.secret);