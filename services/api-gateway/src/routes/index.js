const router = require('express').Router();
const proxy = require('express-http-proxy');
const authenticate = require('../middleware/authenticate');
const { authLimiter } = require('../middleware/rate_limiter');
const config = require('../config');

const proxyWithPath = (serviceUrl) => {
  return proxy(serviceUrl, {
    proxyReqPathResolver: (req) => {
      console.log(`[Proxy] Forwarding to ${serviceUrl}${req.originalUrl}`);
      return req.originalUrl;
    },
    proxyErrorHandler: (err, res, next) => {
      console.error(`[Proxy Error]`, err.message);
      res.status(502).json({ success: false, message: `Upstream error: ${err.message}` });
    },
  });
};

// ─── User Service ─────────────────────────────────────────────────────────────

router.use(
  '/api/v1/auth',
  authLimiter,
  proxyWithPath(config.services.userServiceUrl)
);

router.use(
  '/api/v1/users',
  authenticate,
  proxyWithPath(config.services.userServiceUrl)
);

router.use(
  '/api/v1/addresses',
  authenticate,
  proxyWithPath(config.services.userServiceUrl)
);

// ─── Product Service ──────────────────────────────────────────────────────────

router.use(
  '/api/v1/products',
  authenticate,
  proxyWithPath(config.services.productServiceUrl)
);

router.use(
  '/api/v1/brands',
  authenticate,
  proxyWithPath(config.services.productServiceUrl)
);

router.use(
  '/api/v1/product-types',
  authenticate,
  proxyWithPath(config.services.productServiceUrl)
);

// ─── Order Service ────────────────────────────────────────────────────────────

router.use(
  '/api/v1/orders',
  authenticate,
  proxyWithPath(config.services.orderServiceUrl)
);

router.use(
  '/api/v1/cart',
  authenticate,
  proxyWithPath(config.services.orderServiceUrl)
);

router.use(
  '/api/v1/reviews',
  authenticate,
  proxyWithPath(config.services.orderServiceUrl)
);

module.exports = router;