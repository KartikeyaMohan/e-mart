const router = require('express').Router();
const authenticate = require('../../middleware/authenticate');
const productController = require('../../controllers/product_controller');
const { upload } = require('../../utils/storage');

router.get('/', productController.index);
router.get('/:id', productController.show);
router.post('/', authenticate, upload.single('image'), productController.create);
router.put('/:id', authenticate, upload.single('image'), productController.update);
router.delete('/:id', authenticate, productController.remove);
router.patch('/:id/rating', productController.updateRating);

module.exports = router;