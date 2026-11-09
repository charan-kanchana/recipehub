import React, { useState, useEffect } from 'react';
import API from '../services/api';
import RecipeCard from '../components/RecipeCard';

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all categories once when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch recipes whenever search or selectedCategory changes
  useEffect(() => {
    fetchRecipes();
  }, [search, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }

      const res = await API.get('/recipes', { params });
      setRecipes(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Failed to load recipes. Please make sure the backend is running.');
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h1>Welcome to RecipeHub</h1>
        <p style={{ color: '#555' }}>
          Explore delicious home-cooked meals, save your favorites, and share your own recipes!
        </p>
      </div>

      {/* Search and Category Filter Section */}
      <div className="search-filter-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search recipes by name or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => {
            const catName = cat.name || cat.categoryName;
            return (
              <option key={cat._id} value={catName}>
                {catName}
              </option>
            );
          })}
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Loading & Recipes Display */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '20px' }}>Loading recipes...</p>
      ) : recipes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px' }}>
          <h3>No Recipes Found</h3>
          <p style={{ color: '#666', marginTop: '5px' }}>
            Try adjusting your search terms or filter by another category.
          </p>
        </div>
      ) : (
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;

