const mongoose = require('mongoose');

const shelfBookSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    googleBooksId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, default: '' },
    cover: { type: String, default: '' },
    isbn: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Want to Read', 'Reading', 'Read'],
      default: 'Want to Read',
    },
    currentPage: { type: Number, default: 0, min: 0 },
    totalPages: { type: Number, default: 0, min: 0 },
    rating: { type: Number, min: 1, max: 5, default: null },
    review: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShelfBook', shelfBookSchema);
