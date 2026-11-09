import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Attach Authorization token to every outgoing request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('recipehub_token') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Recipe endpoints
export const getRecipes = (params) => API.get('/recipes', { params });
export const getRecipeById = (id) => API.get(`/recipes/${id}`);
export const searchRecipes = (keyword) => API.get(`/recipes/search/${keyword}`);
export const createRecipe = (recipeData) => API.post('/recipes', recipeData);
export const updateRecipe = (id, recipeData) => API.put(`/recipes/${id}`, recipeData);
export const deleteRecipe = (id) => API.delete(`/recipes/${id}`);

// Category endpoints
export const getCategories = () => API.get('/categories');
export const createCategory = (categoryData) => API.post('/categories', categoryData);

// User endpoints
export const getUsers = () => API.get('/users');
export const registerUser = (userData) => API.post('/users', userData);

// Authentication endpoints
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const registerAuthUser = (userData) => API.post('/auth/register', userData);

// Favorites endpoints
export const getFavorites = () => API.get('/favorites');
export const addFavorite = (favoriteData) => API.post('/favorites', favoriteData);
export const deleteFavorite = (id) => API.delete(`/favorites/${id}`);

export default API;
