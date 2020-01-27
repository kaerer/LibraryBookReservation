const router = require('express').Router();
const BookController = require('./../controllers/BookController');

router.get('/', BookController.getAll);
router.get('/:bookId', BookController.getSingleById);

router.post('/', BookController.create);
router.put('/', BookController.create);

module.exports = router;