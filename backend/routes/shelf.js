const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  addBook,
  getShelf,
  getBook,
  updateBook,
  deleteBook,
} = require('../controllers/shelfController');

router.use(protect);

router.post('/', addBook);
router.get('/', getShelf);
router.get('/:id', getBook);
router.patch('/:id', updateBook);
router.delete('/:id', deleteBook);

module.exports = router;
