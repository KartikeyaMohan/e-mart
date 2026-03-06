const router = require('express').Router();

router.use('/orders', require('./order_routes'));
router.use('/reviews', require('./review_routes'));
router.use('/cart', require('./cart_routes'));

module.exports = router;