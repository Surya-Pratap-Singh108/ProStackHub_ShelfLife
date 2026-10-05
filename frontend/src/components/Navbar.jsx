import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">ShelfLife</Link>
      {user ? (
        <div className="navbar-links">
          <Link to="/shelf">My Shelf</Link>
          <Link to="/search">Search Books</Link>
          <span className="navbar-user">{user.name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      ) : (
        <div className="navbar-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
}
