import React, { useState, useEffect } from 'react';
import RecipeCard from './RecipeCard';
import { getRecipes, getCategories } from '../services/api';

const RecipeList = ({ onView, onEdit, onDelete, onFavorite, favorites, onAddNew }) => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      const res = await getRecipes(params);
      setRecipes(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch recipes. Please make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryList = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategoryList();
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRecipes();
  };

  const handleResetSearch = () => {
    setSearchTerm('');
    setSelectedCategory('All');
  };

  const isFav = (recipe) => {
    return favorites.some(
      (f) => f.recipeId === recipe.recipeId || f.recipeId === recipe._id
    );
  };

  return (
    <div className="recipe-list-view">
      <div className="view-header">
        <div>
          <h2>Digital Recipe Catalog</h2>
          <p className="subtitle">Discover, manage and share delicious food recipes</p>
        </div>
        <button className="btn-primary" onClick={onAddNew}>
          + Create New Recipe
        </button>
      </div>

      <div className="filter-bar">
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="search-input"
            placeholder="Search recipes by name or ingredient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn-search">Search</button>
          {searchTerm && (
            <button type="button" className="btn-clear" onClick={() => { setSearchTerm(''); fetchRecipes(); }}>
              Clear
            </button>
          )}
        </form>

        <div className="category-chips">
          <button
            className={`chip ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('All')}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              className={`chip ${selectedCategory === cat.categoryName ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.categoryName)}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="loading-spinner">Loading recipes...</div>
      ) : recipes.length === 0 ? (
        <div className="empty-state">
          <h3>No Recipes Found</h3>
          <p>Try clearing your search filters or add a new recipe.</p>
          <button className="btn-secondary" onClick={handleResetSearch}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe._id || recipe.recipeId}
              recipe={recipe}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onFavorite={onFavorite}
              isFavorite={isFav(recipe)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeList;
