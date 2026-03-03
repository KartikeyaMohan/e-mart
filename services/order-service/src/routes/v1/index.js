const router = require('express').Router();

router.use('/orders', require('./order_routes'));
router.use('/reviews', require('./review_routes'));

module.exports = router;