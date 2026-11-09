import React from 'react';

const RecipeDetail = ({ recipe, onClose, onEdit, onFavorite, isFavorite }) => {
  if (!recipe) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <div className="badge-row">
              <span className="recipe-id-tag">{recipe.recipeId}</span>
              <span className="category-pill">{recipe.category}</span>
              <span className={`status-tag status-${recipe.status?.toLowerCase() || 'published'}`}>
                {recipe.status || 'Published'}
              </span>
            </div>
            <h2>{recipe.recipeName}</h2>
          </div>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="detail-meta-box">
            <div>
              <span className="meta-label">Cooking Time</span>
              <span className="meta-val">⏱ {recipe.cookingTime} Minutes</span>
            </div>
            <div>
              <span className="meta-label">Difficulty</span>
              <span className={`difficulty-badge diff-${recipe.difficulty?.toLowerCase() || 'medium'}`}>
                {recipe.difficulty || 'Medium'}
              </span>
            </div>
            <div>
              <span className="meta-label">Created By</span>
              <span className="meta-val">👤 {recipe.createdBy}</span>
            </div>
          </div>

          {recipe.description && (
            <div className="detail-section">
              <h4>Description</h4>
              <p className="detail-desc">{recipe.description}</p>
            </div>
          )}

          <div className="detail-section">
            <h4>Ingredients</h4>
            <ul className="ingredients-checklist">
              {recipe.ingredients && recipe.ingredients.map((item, idx) => (
                <li key={idx} className="ingredient-item">
                  <span className="bullet">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="detail-section">
            <h4>Cooking Instructions</h4>
            {recipe.instructions && recipe.instructions.length > 0 ? (
              <ol className="instructions-steps">
                {recipe.instructions.map((step, idx) => (
                  <li key={idx} className="instruction-step">
                    <span className="step-badge">{idx + 1}</span>
                    <span className="step-text">{step}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="empty-text">No cooking instructions provided.</p>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button
            className={`btn-fav-large ${isFavorite ? 'is-fav' : ''}`}
            onClick={() => onFavorite(recipe)}
          >
            {isFavorite ? '★ Favorited' : '☆ Add to Favorites'}
          </button>
          <button className="btn-edit-large" onClick={() => onEdit(recipe)}>
            Edit Recipe
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
