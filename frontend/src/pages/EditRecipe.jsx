import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

function EditRecipe({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  const [instructionsText, setInstructionsText] = useState('');

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Load categories and recipe data
    Promise.all([API.get('/categories'), API.get(`/recipes/${id}`)])
      .then(([catRes, recipeRes]) => {
        setCategories(catRes.data);

        const r = recipeRes.data;
        setTitle(r.title || r.recipeName || '');
        setDescription(r.description || '');
        setCategory(r.category || '');
        setCookingTime(r.cookingTime || '');
        setIngredientsText(r.ingredients ? r.ingredients.join('\n') : '');
        setInstructionsText(r.instructions ? r.instructions.join('\n') : '');

        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading recipe for editing:', err);
        setError('Failed to load recipe data');
        setLoading(false);
      });
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setSaving(true);

      const ingredients = ingredientsText
        .split('\n')
        .map((i) => i.trim())
        .filter((i) => i !== '');

      const instructions = instructionsText
        .split('\n')
        .map((i) => i.trim())
        .filter((i) => i !== '');

      await API.put(`/recipes/${id}`, {
        title,
        recipeName: title,
        description,
        category,
        cookingTime: Number(cookingTime),
        ingredients,
        instructions,
      });

      setSaving(false);
      navigate(`/recipes/${id}`);
    } catch (err) {
      console.error('Error updating recipe:', err);
      setError(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Failed to update recipe'
      );
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container"><p>Loading recipe to edit...</p></div>;
  }

  return (
    <div className="container">
      <div className="form-container">
        <h2>Edit Recipe</h2>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Recipe Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categories.map((cat) => {
                const catName = cat.categoryName || cat.name;
                return (
                  <option key={cat._id} value={catName}>
                    {catName}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Cooking Time (minutes) *</label>
            <input
              type="number"
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Ingredients (One per line) *</label>
            <textarea
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              rows="5"
              required
            />
          </div>

          <div className="form-group">
            <label>Instructions (One step per line) *</label>
            <textarea
              value={instructionsText}
              onChange={(e) => setInstructionsText(e.target.value)}
              rows="5"
              required
            />
          </div>

          <button
            type="submit"
            className="btn"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={saving}
          >
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditRecipe;

