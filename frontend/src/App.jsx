import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import RecipeList from './components/RecipeList';
import RecipeForm from './components/RecipeForm';
import RecipeDetail from './components/RecipeDetail';
import CategoryManager from './components/CategoryManager';
import FavoritesList from './components/FavoritesList';
import UserManager from './components/UserManager';
import Login from './components/Login';
import Register from './components/Register';
import {
  getFavorites,
  addFavorite,
  deleteFavorite,
  deleteRecipe,
  getRecipeById
} from './services/api';
import './App.css';

function App() {
  // Support URL hash routing (e.g. #login, #register, #recipes)
  const getInitialTab = () => {
    const hash = window.location.hash.replace('#', '');
    const validTabs = ['recipes', 'add-recipe', 'categories', 'favorites', 'users', 'login', 'register'];
    return validTabs.includes(hash) ? hash : 'recipes';
  };

  const [activeTab, setActiveTabState] = useState(getInitialTab);
  const [recipeToEdit, setRecipeToEdit] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [alert, setAlert] = useState(null);
  const [listKey, setListKey] = useState(0);

  // Authenticated user state initialized from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('recipehub_user') || localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Keep URL hash in sync with tab changes
  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    window.location.hash = tab;
  };

  // Listen to browser Back/Forward hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validTabs = ['recipes', 'add-recipe', 'categories', 'favorites', 'users', 'login', 'register'];
      if (validTabs.includes(hash)) {
        setActiveTabState(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('recipehub_token');
    localStorage.removeItem('recipehub_user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    showAlert('You have been logged out successfully.', 'info');
    setActiveTab('recipes');
  };

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
          userName: currentUser ? currentUser.name : 'Rahul'
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
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {alert && (
        <div className={`alert-toast toast-${alert.type}`}>
          <span>{alert.message}</span>
          <button className="toast-close" onClick={() => setAlert(null)}>✕</button>
        </div>
      )}

      <main className="main-content">
        {/* Login View */}
        {activeTab === 'login' && (
          <Login
            onLogin={handleLoginSuccess}
            onNavigateRegister={() => setActiveTab('register')}
            onNavigateHome={() => setActiveTab('recipes')}
            showAlert={showAlert}
          />
        )}

        {/* Register View */}
        {activeTab === 'register' && (
          <Register
            onLogin={handleLoginSuccess}
            onNavigateLogin={() => setActiveTab('login')}
            onNavigateHome={() => setActiveTab('recipes')}
            showAlert={showAlert}
          />
        )}

        {/* Existing Recipe Views */}
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
          <p>© 2026 RecipeHub – Digital Recipe Sharing and Food Management System</p>
          <p className="footer-sub">Built with MERN Stack • College Hackathon Edition</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
