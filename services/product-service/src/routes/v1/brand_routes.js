const router = require('express').Router();
const authenticate = require('../../middleware/authenticate');
const brandController = require('../../controllers/brand_controller');

router.get('/', brandController.index);
router.get('/:id', brandController.show);
router.post('/', authenticate, brandController.create);
router.put('/:id', authenticate, brandController.update);
router.delete('/:id', authenticate, brandController.remove);

module.exports = router;