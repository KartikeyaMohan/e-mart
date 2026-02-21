const router = require('express').Router();
const authenticate = require('../../middleware/authenticate');
const userController = require('../../controllers/user_controller');

router.get('/profile', authenticate, userController.getProfile);

module.exports = router;