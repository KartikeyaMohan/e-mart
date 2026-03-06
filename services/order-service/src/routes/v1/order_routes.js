const router = require('express').Router();
const authenticate = require('../../middleware/authenticate');
const orderController = require('../../controllers/order_controller');

router.use(authenticate);

router.get('/', orderController.index);
router.get('/:id', orderController.show);
router.post('/', orderController.create);
router.patch('/:id/status', orderController.updateStatus);

module.exports = router;