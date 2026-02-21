const router = require('express').Router();

router.use('/auth', require('./auth_routes'));
router.use('/users', require('./user_routes'));
router.use('/addresses', require('./address_routes'));

module.exports = router;