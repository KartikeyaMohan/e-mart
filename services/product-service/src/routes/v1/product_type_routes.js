const router = require('express').Router();
const authenticate = require('../../middleware/authenticate');
const productTypeController = require('../../controllers/product_type_controller');

router.get('/', productTypeController.index);
router.get('/:id', productTypeController.show);
router.post('/', authenticate, productTypeController.create);

module.exports = router;