const router = require('express').Router();
const UserController = require('./../controllers/UserController');

router.get('/', UserController.getAll);
router.get('/:userId', UserController.getSingleById);

router.post('/:userId/return/:bookId', UserController.returnBook);
router.delete('/:userId/return/:bookId', UserController.returnBook);

router.post('/:userId/borrow/:bookId', UserController.borrowBook);
router.put('/:userId/borrow/:bookId', UserController.borrowBook);

router.post('/', UserController.create);
router.put('/', UserController.create);

module.exports = router;