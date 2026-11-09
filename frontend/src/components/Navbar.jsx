import React from 'react';
const Navbar = ({ activeTab, setActiveTab }) => {
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
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
