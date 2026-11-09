import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function AddRecipe({ user }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  const [instructionsText, setInstructionsText] = useState('');

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch categories for dropdown
    API.get('/categories')
      .then((res) => {
        setCategories(res.data);
        if (res.data.length > 0) {
          setCategory(res.data[0].categoryName || res.data[0].name);
        }
      })
      .catch((err) => console.error('Error fetching categories:', err));
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !description || !category || !cookingTime) {
      setError('Please fill in title, description, category, and cooking time');
      return;
    }

    try {
      setLoading(true);

      // Split multiline text into array of strings
      const ingredients = ingredientsText
        .split('\n')
        .map((i) => i.trim())
        .filter((i) => i !== '');

      const instructions = instructionsText
        .split('\n')
        .map((i) => i.trim())
        .filter((i) => i !== '');

      const res = await API.post('/recipes', {
        title,
        recipeName: title,
        createdBy: user?.name || 'Chef',
        description,
        category,
        cookingTime: Number(cookingTime),
        ingredients,
        instructions,
      });

      setLoading(false);
      navigate(`/recipes/${res.data._id || res.data.recipeId}`);
    } catch (err) {
      console.error('Error adding recipe:', err);
      setError(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Failed to add recipe. Please try again.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Add a New Recipe</h2>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Recipe Title *</label>
            <input
              type="text"
              placeholder="e.g. Grandma's Apple Pie"
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
              placeholder="Brief description of the dish..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Cooking Time (in minutes) *</label>
            <input
              type="number"
              placeholder="e.g. 30"
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Ingredients (One per line) *</label>
            <textarea
              placeholder="2 cups all-purpose flour&#10;1 tsp baking powder&#10;1/2 cup sugar"
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              rows="5"
              required
            />
            <p className="help-text">Type each ingredient and quantity on a new line.</p>
          </div>

          <div className="form-group">
            <label>Cooking Instructions (One step per line) *</label>
            <textarea
              placeholder="Preheat the oven to 350°F.&#10;Mix dry ingredients in a large bowl.&#10;Bake for 25 minutes until golden."
              value={instructionsText}
              onChange={(e) => setInstructionsText(e.target.value)}
              rows="5"
              required
            />
            <p className="help-text">Type each instruction step on a new line.</p>
          </div>

          <button
            type="submit"
            className="btn"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Publishing Recipe...' : 'Publish Recipe'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddRecipe;

