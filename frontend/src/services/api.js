import axios from 'axios';
const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});
export const getRecipes = (params) => API.get('/recipes', { params });
export const getRecipeById = (id) => API.get(`/recipes/${id}`);
export const searchRecipes = (keyword) => API.get(`/recipes/search/${keyword}`);
export const createRecipe = (recipeData) => API.post('/recipes', recipeData);
export const updateRecipe = (id, recipeData) => API.put(`/recipes/${id}`, recipeData);
export const deleteRecipe = (id) => API.delete(`/recipes/${id}`);
export const getCategories = () => API.get('/categories');
export const createCategory = (categoryData) => API.post('/categories', categoryData);
export const getUsers = () => API.get('/users');
export const registerUser = (userData) => API.post('/users', userData);
export const getFavorites = () => API.get('/favorites');
export const addFavorite = (favoriteData) => API.post('/favorites', favoriteData);
export const deleteFavorite = (id) => API.delete(`/favorites/${id}`);
export default API;
