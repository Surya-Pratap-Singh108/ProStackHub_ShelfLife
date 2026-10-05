const express = require('express');
const router = express.Router();
const { searchBooks } = require('../controllers/booksController');
const { protect } = require('../middleware/auth');

router.get('/search', protect, searchBooks);

module.exports = router;
