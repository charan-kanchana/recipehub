import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        RecipeHub
      </Link>

      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        {user ? (
          <>
            <li>
              <Link to="/favorites">Favorites</Link>
            </li>
            <li>
              <Link to="/add-recipe">Add Recipe</Link>
            </li>

            {user.role && user.role.toLowerCase() === 'admin' && (
              <li>
                <Link to="/admin">Admin Dashboard</Link>
              </li>
            )}

            <li>
              <span className="user-info">
                {user.name} ({user.role})
              </span>
            </li>
            <li>
              <button onClick={handleLogoutClick} className="btn btn-secondary btn-sm">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;

