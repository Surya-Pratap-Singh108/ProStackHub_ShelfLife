import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    status: '',
    currentPage: 0,
    totalPages: 0,
    rating: '',
    review: '',
  });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await api.get(`/shelf/${id}`);
        setBook(data);
        setForm({
          status: data.status,
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          rating: data.rating || '',
          review: data.review || '',
        });
      } catch (err) {
        setError('Failed to load book');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      // Prevent currentPage from exceeding totalPages
      if (name === 'currentPage' || name === 'totalPages') {
        const cp = parseInt(name === 'currentPage' ? value : prev.currentPage) || 0;
        const tp = parseInt(name === 'totalPages' ? value : prev.totalPages) || 0;
        updated.currentPage = tp > 0 ? Math.min(cp, tp) : cp;
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        status: form.status,
        currentPage: parseInt(form.currentPage) || 0,
        totalPages: parseInt(form.totalPages) || 0,
        rating: form.rating !== '' ? parseInt(form.rating) : null,
        review: form.review,
      };
      await api.patch(`/shelf/${id}`, payload);
      navigate('/shelf');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="status-msg">Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!book) return null;

  const progress =
    form.status === 'Reading' && parseInt(form.totalPages) > 0
      ? Math.min(Math.round((parseInt(form.currentPage) / parseInt(form.totalPages)) * 100), 100)
      : null;

  return (
    <div className="page">
      <button className="btn-back" onClick={() => navigate('/shelf')}>← Back to Shelf</button>
      <div className="book-detail">
        {book.cover && (
          <img src={book.cover} alt={book.title} className="book-cover-large" />
        )}
        <div className="book-detail-info">
          <h2>{book.title}</h2>
          <p className="book-author">{book.author}</p>
          {book.isbn && <p className="book-isbn">ISBN: {book.isbn}</p>}

          <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="Want to Read">Want to Read</option>
                <option value="Reading">Reading</option>
                <option value="Read">Read</option>
              </select>
            </div>

            {form.status === 'Reading' && (
              <div className="reading-section">
                <div className="form-group">
                  <label>Total Pages</label>
                  <input
                    type="number"
                    name="totalPages"
                    value={form.totalPages}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Current Page</label>
                  <input
                    type="number"
                    name="currentPage"
                    value={form.currentPage}
                    onChange={handleChange}
                    min="0"
                    max={form.totalPages || undefined}
                  />
                </div>
                {progress !== null && (
                  <div className="progress-section">
                    <div className="progress-bar-container">
                      <div className="progress-bar" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="progress-text">
                      {form.currentPage} / {form.totalPages} pages ({progress}%)
                    </p>
                  </div>
                )}
              </div>
            )}

            {form.status === 'Read' && (
              <div className="review-section">
                <div className="form-group">
                  <label>Rating (1–5)</label>
                  <select name="rating" value={form.rating} onChange={handleChange}>
                    <option value="">No rating</option>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} {'★'.repeat(n)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Review</label>
                  <textarea
                    name="review"
                    value={form.review}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Write your review..."
                  />
                </div>
              </div>
            )}

            {error && <p className="error">{error}</p>}

            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
