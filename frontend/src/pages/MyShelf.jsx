import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function MyShelf() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShelf = async () => {
      try {
        const { data } = await api.get('/shelf');
        setBooks(data);
      } catch (err) {
        setError('Failed to load shelf');
      } finally {
        setLoading(false);
      }
    };
    fetchShelf();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this book from your shelf?')) return;
    try {
      await api.delete(`/shelf/${id}`);
      setBooks(books.filter((b) => b._id !== id));
    } catch {
      alert('Failed to delete book');
    }
  };

  if (loading) return <p className="status-msg">Loading shelf...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="page">
      <h2>My Shelf</h2>
      {books.length === 0 ? (
        <p className="status-msg">Your shelf is empty. <a href="/search">Search for books</a> to add.</p>
      ) : (
        <div className="book-grid">
          {books.map((book) => (
            <div key={book._id} className="book-card">
              {book.cover && (
                <img src={book.cover} alt={book.title} className="book-cover" />
              )}
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.author}</p>
                <span className={`status-badge status-${book.status.replace(/\s/g, '-').toLowerCase()}`}>
                  {book.status}
                </span>

                {book.status === 'Reading' && book.totalPages > 0 && (
                  <div className="progress-section">
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar"
                        style={{
                          width: `${Math.min((book.currentPage / book.totalPages) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <p className="progress-text">
                      {book.currentPage} / {book.totalPages} pages (
                      {Math.round((book.currentPage / book.totalPages) * 100)}%)
                    </p>
                  </div>
                )}

                {book.rating && (
                  <p className="book-rating">Rating: {'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}</p>
                )}

                {book.review && (
                  <p className="book-review">"{book.review}"</p>
                )}

                <div className="book-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => navigate(`/shelf/${book._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(book._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
