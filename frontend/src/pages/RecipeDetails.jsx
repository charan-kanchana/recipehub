import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

function RecipeDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRecipeDetails();
    if (user) {
      checkFavoriteStatus();
    }
  }, [id, user]);

  const fetchRecipeDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/recipes/${id}`);
      setRecipe(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching recipe:', err);
      setError('Recipe not found or failed to load.');
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const res = await API.get('/recipes/favorites');
      const isFav = res.data.some(
        (fav) => fav._id === id || fav.recipeId === id || (recipe && fav.recipeId === recipe.recipeId)
      );
      setIsFavorite(isFav);
    } catch (err) {
      console.error('Error checking favorite:', err);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      alert('Please log in to save recipes to your favorites!');
      return;
    }

    try {
      const res = await API.post(`/recipes/${id}/favorite`);
      setIsFavorite(res.data.isFavorite);
      setMessage(res.data.message);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Favorite toggle failed:', err);
      alert('Could not update favorite status');
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this recipe? This action cannot be undone.'
    );
    if (!confirmDelete) return;

    try {
      await API.delete(`/recipes/${id}`);
      alert('Recipe deleted successfully');
      navigate('/');
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete recipe');
    }
  };

  if (loading) {
    return <div className="container"><p>Loading recipe details...</p></div>;
  }

  if (error || !recipe) {
    return (
      <div className="container">
        <div className="alert alert-error">{error || 'Recipe not found.'}</div>
        <Link to="/" className="btn btn-secondary">Back to Home</Link>
      </div>
    );
  }

  // Check if current user is the owner or an admin
  const isOwner =
    user &&
    recipe.createdBy &&
    ((typeof recipe.createdBy === 'object' && recipe.createdBy._id === user._id) ||
      (typeof recipe.createdBy === 'string' &&
        (recipe.createdBy === user.name || recipe.createdBy === user.email)));
  const isAdmin = user && user.role && user.role.toLowerCase() === 'admin';
  const canModify = isOwner || isAdmin;

  return (
    <div className="container">
      {message && <div className="alert alert-success">{message}</div>}

      <div className="recipe-details">
        <div className="recipe-details-header">
          <div>
            <h1>{recipe.title || recipe.recipeName}</h1>
            <span className="recipe-badge">{recipe.category}</span>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={handleToggleFavorite}
              className={`btn ${isFavorite ? 'btn-danger' : 'btn-secondary'}`}
            >
              {isFavorite ? '❤️ Remove Favorite' : '🤍 Save to Favorites'}
            </button>

            {canModify && (
              <>
                <Link to={`/edit-recipe/${recipe._id || recipe.recipeId}`} className="btn btn-secondary">
                  Edit
                </Link>
                <button onClick={handleDelete} className="btn btn-danger">
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        <div className="recipe-meta" style={{ marginTop: '15px' }}>
          <span>⏱ Cooking Time: <strong>{recipe.cookingTime} mins</strong></span>
          <span>👤 Shared by: <strong>{recipe.createdBy?.name || recipe.createdBy || 'Chef'}</strong></span>
        </div>

        <div className="section-box">
          <h3>Description</h3>
          <p>{recipe.description}</p>
        </div>

        <div className="section-box">
          <h3>Ingredients</h3>
          <ul>
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((item, index) => <li key={index}>{item}</li>)
            ) : (
              <li>No ingredients specified.</li>
            )}
          </ul>
        </div>

        <div className="section-box">
          <h3>Cooking Instructions</h3>
          <ol>
            {recipe.instructions && recipe.instructions.length > 0 ? (
              recipe.instructions.map((step, index) => <li key={index}>{step}</li>)
            ) : (
              <li>No instructions specified.</li>
            )}
          </ol>
        </div>

        <div style={{ marginTop: '20px' }}>
          <Link to="/" className="btn btn-secondary">
            ← Back to All Recipes
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetails;

