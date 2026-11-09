import React from 'react';

const Navbar = ({ activeTab, setActiveTab, currentUser, onLogout }) => {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="brand" onClick={() => setActiveTab('recipes')}>
          <span className="brand-badge">M32</span>
          <span className="brand-title">RecipeHub</span>
        </div>

        <nav className="nav-links">
          <button
            className={`nav-btn ${activeTab === 'recipes' ? 'active' : ''}`}
            onClick={() => setActiveTab('recipes')}
          >
            Recipes
          </button>
          <button
            className={`nav-btn ${activeTab === 'add-recipe' ? 'active' : ''}`}
            onClick={() => setActiveTab('add-recipe')}
          >
            + Add Recipe
          </button>
          <button
            className={`nav-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </button>
          <button
            className={`nav-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites
          </button>
          <button
            className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>

          {/* Authentication Links */}
          {currentUser ? (
            <div className="nav-auth-user">
              <span className="nav-user-greeting">
                <span className="user-icon">👤</span>
                <span className="user-name">{currentUser.name}</span>
                {currentUser.role && (
                  <span className={`nav-role-badge role-${currentUser.role.toLowerCase()}`}>
                    {currentUser.role}
                  </span>
                )}
              </span>
              <button
                type="button"
                className="nav-btn nav-btn-logout"
                onClick={onLogout}
                title="Sign out of RecipeHub"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-auth-actions">
              <button
                className={`nav-btn nav-btn-login ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => setActiveTab('login')}
              >
                Sign In
              </button>
              <button
                className={`nav-btn nav-btn-register ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => setActiveTab('register')}
              >
                Register
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
