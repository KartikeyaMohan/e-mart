const jwt = require('jsonwebtoken');

const createAuthMiddleware = (jwtSecret) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Access token required' });
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded;
      next();
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid or expired access token' });
    }
  };
};

module.exports = createAuthMiddleware;