const router = require('express').Router();
const authenticate = require('../../middleware/authenticate');
const cartController = require('../../controllers/cart_controller');

router.use(authenticate); // all cart routes require auth

router.get('/', cartController.getCart);
router.post('/items', cartController.addItem);
router.patch('/items/:productId', cartController.updateItem);
router.delete('/items/:productId', cartController.removeItem);
router.delete('/', cartController.clearCart);

module.exports = router;