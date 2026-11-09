import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import RecipeList from './components/RecipeList';
import RecipeForm from './components/RecipeForm';
import RecipeDetail from './components/RecipeDetail';
import CategoryManager from './components/CategoryManager';
import FavoritesList from './components/FavoritesList';
import UserManager from './components/UserManager';
import {
  getFavorites,
  addFavorite,
  deleteFavorite,
  deleteRecipe,
  getRecipeById
} from './services/api';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('recipes');
  const [recipeToEdit, setRecipeToEdit] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [alert, setAlert] = useState(null);
  const [listKey, setListKey] = useState(0);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  const loadFavorites = async () => {
    try {
      const res = await getFavorites();
      setFavorites(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleEditRecipe = (recipe) => {
    setSelectedRecipe(null);
    setRecipeToEdit(recipe);
    setActiveTab('add-recipe');
  };

  const handleDeleteRecipe = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this recipe?');
    if (!confirmDelete) return;

    try {
      await deleteRecipe(id);
      showAlert('Recipe deleted successfully', 'success');
      setListKey((prev) => prev + 1);
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to delete recipe', 'error');
    }
  };

  const handleToggleFavorite = async (recipe) => {
    const existing = favorites.find(
      (f) => f.recipeId === recipe.recipeId || f.recipeId === recipe._id
    );

    if (existing) {
      try {
        await deleteFavorite(existing._id);
        showAlert('Removed from favorites', 'info');
        loadFavorites();
      } catch (err) {
        showAlert('Failed to remove favorite', 'error');
      }
    } else {
      try {
        await addFavorite({
          recipeId: recipe.recipeId,
          recipeName: recipe.recipeName,
          category: recipe.category,
          userName: 'Rahul'
        });
        showAlert('Recipe added to favorites!', 'success');
        loadFavorites();
      } catch (err) {
        showAlert(err.response?.data?.message || 'Failed to add favorite', 'error');
      }
    }
  };

  const handleViewFavoriteRecipe = async (recipeId) => {
    try {
      const res = await getRecipeById(recipeId);
      setSelectedRecipe(res.data);
    } catch (err) {
      showAlert('Could not load recipe details', 'error');
    }
  };

  const handleSelectCategoryFromManager = (categoryName) => {
    setActiveTab('recipes');
  };

  return (
    <div className="app-layout">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {alert && (
        <div className={`alert-toast toast-${alert.type}`}>
          <span>{alert.message}</span>
          <button className="toast-close" onClick={() => setAlert(null)}>✕</button>
        </div>
      )}

      <main className="main-content">
        {activeTab === 'recipes' && (
          <RecipeList
            key={listKey}
            onView={(recipe) => setSelectedRecipe(recipe)}
            onEdit={handleEditRecipe}
            onDelete={handleDeleteRecipe}
            onFavorite={handleToggleFavorite}
            favorites={favorites}
            onAddNew={() => {
              setRecipeToEdit(null);
              setActiveTab('add-recipe');
            }}
          />
        )}

        {activeTab === 'add-recipe' && (
          <RecipeForm
            recipeToEdit={recipeToEdit}
            onSaveSuccess={() => {
              showAlert(recipeToEdit ? 'Recipe updated successfully!' : 'Recipe created successfully!', 'success');
              setRecipeToEdit(null);
              setActiveTab('recipes');
              setListKey((prev) => prev + 1);
            }}
            onCancel={() => {
              setRecipeToEdit(null);
              setActiveTab('recipes');
            }}
          />
        )}

        {activeTab === 'categories' && (
          <CategoryManager onSelectCategory={handleSelectCategoryFromManager} />
        )}

        {activeTab === 'favorites' && (
          <FavoritesList
            favorites={favorites}
            onRemoveFavorite={async (id) => {
              try {
                await deleteFavorite(id);
                showAlert('Removed from favorites', 'info');
                loadFavorites();
              } catch (err) {
                showAlert('Failed to remove favorite', 'error');
              }
            }}
            onViewRecipe={handleViewFavoriteRecipe}
          />
        )}

        {activeTab === 'users' && <UserManager />}
      </main>

      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onEdit={handleEditRecipe}
          onFavorite={handleToggleFavorite}
          isFavorite={favorites.some(
            (f) => f.recipeId === selectedRecipe.recipeId || f.recipeId === selectedRecipe._id
          )}
        />
      )}

      <footer className="footer">
        <div className="footer-content">
          <p>Digital Recipe Sharing and Food Management System</p>
          <p className="footer-sub">Created by BeastCodes.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
