const axios = require('axios');

// GET /api/books/search?q=
const searchBooks = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'Query parameter q is required' });

  try {
    const url = 'https://www.googleapis.com/books/v1/volumes';
    const params = { q, maxResults: 10 };
    if (process.env.GOOGLE_BOOKS_API_KEY) {
      params.key = process.env.GOOGLE_BOOKS_API_KEY;
    }

    const { data } = await axios.get(url, { params });
    const items = data.items || [];

    const books = items.map((item) => {
      const info = item.volumeInfo || {};
      const identifiers = info.industryIdentifiers || [];
      const isbn13 = identifiers.find((i) => i.type === 'ISBN_13');
      const isbn10 = identifiers.find((i) => i.type === 'ISBN_10');
      const isbn = isbn13 ? isbn13.identifier : isbn10 ? isbn10.identifier : '';

      return {
        googleBooksId: item.id,
        title: info.title || 'Unknown Title',
        author: info.authors ? info.authors.join(', ') : 'Unknown Author',
        cover: info.imageLinks ? info.imageLinks.thumbnail || info.imageLinks.smallThumbnail || '' : '',
        isbn,
        totalPages: info.pageCount || 0,
      };
    });

    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch books from Google Books API' });
  }
};

module.exports = { searchBooks };
