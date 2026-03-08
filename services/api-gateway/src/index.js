const express = require('express');
const helmet = require('helmet');
const config = require('./config');
const { defaultLimiter } = require('./middleware/rate_limiter');

const app = express();

// Security headers
app.use(helmet());

// Apply default rate limiter to all routes
app.use(defaultLimiter);

app.use(express.json());

// Health check — does not proxy, answered by gateway itself
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'api-gateway',
    upstreams: {
      userService: config.services.userServiceUrl,
      productService: config.services.productServiceUrl,
      orderService: config.services.orderServiceUrl,
    },
  });
});

app.use((req, res, next) => {
  console.log(`[Gateway] ${req.method} ${req.path}`);
  next();
});

// All /api routes proxied to appropriate service
app.use(require('./routes'));

// 404 — no route matched
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(config.port, () => {
  console.log(`API Gateway running on port ${config.port}`);
});