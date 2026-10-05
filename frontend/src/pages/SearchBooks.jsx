import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function SearchBooks() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addedIds, setAddedIds] = useState(new Set());
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setError('');
    setLoading(true);
    try {
      const { data } = await api.get(`/books/search?q=${encodeURIComponent(query)}`);
      setResults(data);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (book) => {
    try {
      await api.post('/shelf', {
        googleBooksId: book.googleBooksId,
        title: book.title,
        author: book.author,
        cover: book.cover,
        isbn: book.isbn,
        totalPages: book.totalPages,
        status: 'Want to Read',
      });
      setAddedIds((prev) => new Set(prev).add(book.googleBooksId));
      navigate('/shelf');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add book');
    }
  };

  return (
    <div className="page">
      <h2>Search Books</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author, or ISBN..."
          className="search-input"
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {results.length > 0 && (
        <div className="book-grid">
          {results.map((book) => (
            <div key={book.googleBooksId} className="book-card">
              {book.cover && (
                <img src={book.cover} alt={book.title} className="book-cover" />
              )}
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.author}</p>
                {book.isbn && <p className="book-isbn">ISBN: {book.isbn}</p>}
                {book.totalPages > 0 && <p className="book-pages">{book.totalPages} pages</p>}
                <button
                  className="btn-primary"
                  onClick={() => handleAdd(book)}
                  disabled={addedIds.has(book.googleBooksId)}
                >
                  {addedIds.has(book.googleBooksId) ? 'Added' : 'Add to Shelf'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
