const router = require('express').Router();
const authenticate = require('../../middleware/authenticate');
const reviewController = require('../../controllers/review_controller');

router.get('/product/:productId', reviewController.getByProduct);
router.post('/', authenticate, reviewController.create);

module.exports = router;