const router = require('express').Router();
const authenticate = require('../../middleware/authenticate');
const addressController = require('../../controllers/address_controller');

router.use(authenticate);

router.post('/', addressController.createAddress);
router.get('/', addressController.getAddresses);

module.exports = router;