import React from 'react';

const FavoritesList = ({ favorites, onRemoveFavorite, onViewRecipe }) => {
  return (
    <div className="favorites-view">
      <div className="view-header">
        <div>
          <h2>My Favorite Recipes</h2>
          <p className="subtitle">Quick access to your handpicked and saved recipes</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <h3>No Favorites Added Yet</h3>
          <p>Browse through recipes and click the "☆ Favorite" button to save them here.</p>
        </div>
      ) : (
        <div className="table-card">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Recipe ID</th>
                  <th>Recipe Name</th>
                  <th>Category</th>
                  <th>Saved For</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {favorites.map((fav) => (
                  <tr key={fav._id}>
                    <td>
                      <span className="recipe-id-tag">{fav.recipeId}</span>
                    </td>
                    <td className="font-bold">{fav.recipeName}</td>
                    <td>
                      <span className="category-pill">{fav.category || 'General'}</span>
                    </td>
                    <td>{fav.userName || 'Rahul'}</td>
                    <td>
                      <div className="action-buttons-inline">
                        <button
                          className="btn-table-action"
                          onClick={() => onViewRecipe(fav.recipeId)}
                        >
                          View Details
                        </button>
                        <button
                          className="btn-table-delete"
                          onClick={() => onRemoveFavorite(fav._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesList;
