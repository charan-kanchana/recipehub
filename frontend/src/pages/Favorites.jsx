import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import RecipeCard from '../components/RecipeCard';

function Favorites({ user }) {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchFavorites();
  }, [user, navigate]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await API.get('/recipes/favorites');
      setFavorites(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Failed to load your favorite recipes.');
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>My Favorite Recipes</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Here are the recipes you have saved for quick access anytime.
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p>Loading your saved recipes...</p>
      ) : favorites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#fff', border: '1px solid #ddd', borderRadius: '4px' }}>
          <h3>No Favorites Saved Yet</h3>
          <p style={{ color: '#666', margin: '10px 0 20px 0' }}>
            Browse through delicious recipes and click "Save to Favorites" to view them here.
          </p>
          <Link to="/" className="btn">
            Browse Recipes
          </Link>
        </div>
      ) : (
        <div className="recipes-grid">
          {favorites.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;

