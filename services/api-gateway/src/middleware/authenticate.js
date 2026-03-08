const createAuthMiddleware = require('@emart/shared/middleware/authenticate');
const config = require('../config');

const authenticate = createAuthMiddleware(config.jwt.secret);

// Wrap it to also forward the decoded user id to downstream services
module.exports = (req, res, next) => {
  authenticate(req, res, () => {
    req.headers['x-user-id'] = String(req.user.userId);
    next();
  });
};