import React from 'react';

const RecipeCard = ({ recipe, onView, onEdit, onDelete, onFavorite, isFavorite }) => {
  return (
    <div className="recipe-card">
      <div className="card-top">
        <span className="recipe-id-tag">{recipe.recipeId}</span>
        <span className={`status-tag status-${recipe.status?.toLowerCase() || 'published'}`}>
          {recipe.status || 'Published'}
        </span>
      </div>

      <h3 className="card-title">{recipe.recipeName}</h3>
      <p className="card-category">{recipe.category}</p>

      <p className="card-desc">
        {recipe.description || 'No description provided.'}
      </p>

      <div className="card-meta">
        <span className="meta-item">⏱ {recipe.cookingTime} mins</span>
        <span className={`difficulty-badge diff-${recipe.difficulty?.toLowerCase() || 'medium'}`}>
          {recipe.difficulty || 'Medium'}
        </span>
        <span className="meta-author">By: {recipe.createdBy}</span>
      </div>

      <div className="card-ingredients">
        <strong>Ingredients:</strong>
        <div className="tags-container">
          {recipe.ingredients && recipe.ingredients.slice(0, 4).map((ing, idx) => (
            <span key={idx} className="ingredient-tag">{ing}</span>
          ))}
          {recipe.ingredients && recipe.ingredients.length > 4 && (
            <span className="ingredient-tag more-tag">+{recipe.ingredients.length - 4} more</span>
          )}
        </div>
      </div>

      <div className="card-actions">
        <button className="btn-action btn-view" onClick={() => onView(recipe)}>
          View
        </button>
        <button
          className={`btn-action btn-fav ${isFavorite ? 'is-fav' : ''}`}
          onClick={() => onFavorite(recipe)}
        >
          {isFavorite ? '★ Saved' : '☆ Favorite'}
        </button>
        <button className="btn-action btn-edit" onClick={() => onEdit(recipe)}>
          Edit
        </button>
        <button className="btn-action btn-delete" onClick={() => onDelete(recipe.recipeId || recipe._id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
