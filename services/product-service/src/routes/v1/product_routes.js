const router = require('express').Router();
const authenticate = require('../../middleware/authenticate');
const productController = require('../../controllers/product_controller');

router.get('/', productController.index);
router.get('/:id', productController.show);
router.post('/', authenticate, productController.create);
router.put('/:id', authenticate, productController.update);
router.delete('/:id', authenticate, productController.remove);
router.patch('/:id/rating', productController.updateRating);

module.exports = router;