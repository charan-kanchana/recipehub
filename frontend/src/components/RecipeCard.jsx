import React from 'react';
import { Link } from 'react-router-dom';

function RecipeCard({ recipe }) {
  return (
    <div className="recipe-card">
      <div className="recipe-card-body">
        <div>
          <span className="recipe-badge">{recipe.category}</span>
          <h3 className="recipe-card-title">{recipe.title || recipe.recipeName}</h3>
          <p className="recipe-card-desc">
            {recipe.description && recipe.description.length > 80
              ? recipe.description.substring(0, 80) + '...'
              : recipe.description}
          </p>
        </div>

        <div style={{ marginTop: '15px' }}>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
            ⏱ {recipe.cookingTime} mins
          </p>
          <Link to={`/recipes/${recipe._id || recipe.recipeId}`} className="btn btn-sm" style={{ display: 'block', textAlign: 'center' }}>
            View Recipe
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;

