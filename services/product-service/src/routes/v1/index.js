const router = require('express').Router();

router.use('/brands', require('./brand_routes'));
router.use('/product-types', require('./product_type_routes'));
router.use('/products', require('./product_routes'));

module.exports = router;