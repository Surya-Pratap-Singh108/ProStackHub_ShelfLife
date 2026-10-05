const ShelfBook = require('../models/ShelfBook');

// POST /api/shelf — add book to shelf
const addBook = async (req, res) => {
  const { googleBooksId, title, author, cover, isbn, status, currentPage, totalPages, rating, review } = req.body;
  if (!googleBooksId || !title) {
    return res.status(400).json({ message: 'googleBooksId and title are required' });
  }

  try {
    const existing = await ShelfBook.findOne({ userId: req.user._id, googleBooksId });
    if (existing) return res.status(400).json({ message: 'Book already on your shelf' });

    const book = await ShelfBook.create({
      userId: req.user._id,
      googleBooksId,
      title,
      author: author || '',
      cover: cover || '',
      isbn: isbn || '',
      status: status || 'Want to Read',
      currentPage: currentPage || 0,
      totalPages: totalPages || 0,
      rating: rating || null,
      review: review || '',
    });
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/shelf — get current user's shelf
const getShelf = async (req, res) => {
  try {
    const books = await ShelfBook.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/shelf/:id
const getBook = async (req, res) => {
  try {
    const book = await ShelfBook.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/shelf/:id
const updateBook = async (req, res) => {
  try {
    const book = await ShelfBook.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const allowedFields = ['status', 'currentPage', 'totalPages', 'rating', 'review'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) book[field] = req.body[field];
    });

    // Clamp currentPage to totalPages
    if (book.currentPage > book.totalPages && book.totalPages > 0) {
      book.currentPage = book.totalPages;
    }

    // Validate rating
    if (book.rating !== null && (book.rating < 1 || book.rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/shelf/:id
const deleteBook = async (req, res) => {
  try {
    const book = await ShelfBook.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await book.deleteOne();
    res.json({ message: 'Book removed from shelf' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addBook, getShelf, getBook, updateBook, deleteBook };
