import React, { useState, useEffect } from 'react';
import { createRecipe, updateRecipe, getCategories } from '../services/api';

const RecipeForm = ({ recipeToEdit, onSaveSuccess, onCancel }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    recipeId: '',
    recipeName: '',
    category: '',
    createdBy: '',
    cookingTime: 30,
    difficulty: 'Medium',
    description: '',
    status: 'Published'
  });

  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState(['']);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data);
        if (res.data.length > 0 && !recipeToEdit) {
          setFormData((prev) => ({ ...prev, category: res.data[0].categoryName }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadCategories();

    if (recipeToEdit) {
      setFormData({
        recipeId: recipeToEdit.recipeId || '',
        recipeName: recipeToEdit.recipeName || '',
        category: recipeToEdit.category || '',
        createdBy: recipeToEdit.createdBy || '',
        cookingTime: recipeToEdit.cookingTime || 30,
        difficulty: recipeToEdit.difficulty || 'Medium',
        description: recipeToEdit.description || '',
        status: recipeToEdit.status || 'Published'
      });
      setIngredients(recipeToEdit.ingredients && recipeToEdit.ingredients.length > 0
        ? recipeToEdit.ingredients
        : ['']
      );
      setInstructions(recipeToEdit.instructions && recipeToEdit.instructions.length > 0
        ? recipeToEdit.instructions
        : ['']
      );
    }
  }, [recipeToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (index, value) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addIngredientField = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredientField = (index) => {
    if (ingredients.length === 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleInstructionChange = (index, value) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const addInstructionField = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstructionField = (index) => {
    if (instructions.length === 1) return;
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const filteredIngredients = ingredients.map((i) => i.trim()).filter(Boolean);
    const filteredInstructions = instructions.map((i) => i.trim()).filter(Boolean);

    if (filteredIngredients.length === 0) {
      setError('Please provide at least one ingredient.');
      return;
    }

    const payload = {
      ...formData,
      ingredients: filteredIngredients,
      instructions: filteredInstructions
    };

    try {
      setSubmitting(true);
      if (recipeToEdit) {
        await updateRecipe(recipeToEdit.recipeId || recipeToEdit._id, payload);
      } else {
        await createRecipe(payload);
      }
      onSaveSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save recipe.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-card">
      <div className="form-header">
        <h2>{recipeToEdit ? 'Update Recipe' : 'Add New Food Recipe'}</h2>
        <p className="subtitle">
          {recipeToEdit ? 'Modify food details, ingredients or cooking instructions' : 'Fill in the recipe specifications below'}
        </p>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Recipe ID</label>
            <input
              type="text"
              name="recipeId"
              placeholder="e.g. RC101"
              value={formData.recipeId}
              onChange={handleChange}
              disabled={!!recipeToEdit}
            />
          </div>

          <div className="form-group flex-2">
            <label>Recipe Name *</label>
            <input
              type="text"
              name="recipeName"
              placeholder="e.g. Vegetable Biryani"
              required
              value={formData.recipeName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map((c) => (
                <option key={c._id} value={c.categoryName}>
                  {c.categoryName}
                </option>
              ))}
              {categories.length === 0 && (
                <>
                  <option value="Main Course">Main Course</option>
                  <option value="Appetizer">Appetizer</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Beverage">Beverage</option>
                </>
              )}
            </select>
          </div>

          <div className="form-group">
            <label>Created By *</label>
            <input
              type="text"
              name="createdBy"
              placeholder="e.g. Rahul"
              required
              value={formData.createdBy}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Cooking Time (Minutes) *</label>
            <input
              type="number"
              name="cookingTime"
              min="1"
              required
              value={formData.cookingTime}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Difficulty</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            rows="2"
            placeholder="Brief overview of the dish..."
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-section">
          <div className="section-title-row">
            <h4>Maintain Recipe Ingredients</h4>
            <button type="button" className="btn-add-item" onClick={addIngredientField}>
              + Add Ingredient
            </button>
          </div>
          <div className="dynamic-inputs-grid">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="dynamic-input-row">
                <input
                  type="text"
                  placeholder={`Ingredient ${idx + 1} (e.g. Rice, Spices)`}
                  value={ing}
                  onChange={(e) => handleIngredientChange(idx, e.target.value)}
                />
                <button
                  type="button"
                  className="btn-remove-item"
                  onClick={() => removeIngredientField(idx)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <div className="section-title-row">
            <h4>Add Cooking Instructions</h4>
            <button type="button" className="btn-add-item" onClick={addInstructionField}>
              + Add Step
            </button>
          </div>
          <div className="dynamic-inputs-list">
            {instructions.map((step, idx) => (
              <div key={idx} className="instruction-input-row">
                <span className="step-number">Step {idx + 1}</span>
                <input
                  type="text"
                  placeholder="Describe this preparation step..."
                  value={step}
                  onChange={(e) => handleInstructionChange(idx, e.target.value)}
                />
                <button
                  type="button"
                  className="btn-remove-item"
                  onClick={() => removeInstructionField(idx)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions-bar">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : recipeToEdit ? 'Update Recipe' : 'Add Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;
