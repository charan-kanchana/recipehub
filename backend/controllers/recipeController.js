const Recipe = require('../models/Recipe');
const mongoose = require('mongoose');

const getRecipes = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { recipeName: { $regex: search, $options: 'i' } },
        { ingredients: { $regex: search, $options: 'i' } }
      ];
    }

    const recipes = await Recipe.find(query).sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    let recipe;

    if (mongoose.Types.ObjectId.isValid(id)) {
      recipe = await Recipe.findById(id);
    }

    if (!recipe) {
      recipe = await Recipe.findOne({ recipeId: id });
    }

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRecipe = async (req, res) => {
  try {
    const {
      recipeId,
      recipeName,
      category,
      createdBy,
      ingredients,
      cookingTime,
      difficulty,
      description,
      instructions,
      status
    } = req.body;

    let finalRecipeId = recipeId;
    if (!finalRecipeId || finalRecipeId.trim() === '') {
      const count = await Recipe.countDocuments();
      finalRecipeId = `RC${101 + count}`;
    }

    const existing = await Recipe.findOne({ recipeId: finalRecipeId });
    if (existing) {
      return res.status(400).json({ message: 'Recipe ID already exists' });
    }

    const recipe = new Recipe({
      recipeId: finalRecipeId,
      recipeName,
      category,
      createdBy,
      ingredients: Array.isArray(ingredients)
        ? ingredients
        : String(ingredients || '').split(',').map(item => item.trim()).filter(Boolean),
      cookingTime: Number(cookingTime) || 30,
      difficulty: difficulty || 'Medium',
      description: description || '',
      instructions: Array.isArray(instructions)
        ? instructions
        : String(instructions || '').split('\n').map(step => step.trim()).filter(Boolean),
      status: status || 'Published'
    });

    const savedRecipe = await recipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    let query = { recipeId: id };

    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ _id: id }, { recipeId: id }] };
    }

    const updateData = { ...req.body };
    if (typeof updateData.ingredients === 'string') {
      updateData.ingredients = updateData.ingredients.split(',').map(item => item.trim()).filter(Boolean);
    }
    if (typeof updateData.instructions === 'string') {
      updateData.instructions = updateData.instructions.split('\n').map(step => step.trim()).filter(Boolean);
    }

    const updatedRecipe = await Recipe.findOneAndUpdate(query, updateData, { new: true });

    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    let query = { recipeId: id };

    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ _id: id }, { recipeId: id }] };
    }

    const deleted = await Recipe.findOneAndDelete(query);
    if (!deleted) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchRecipes = async (req, res) => {
  try {
    const term = req.params.keyword || req.query.name || req.query.keyword || '';
    const recipes = await Recipe.find({
      $or: [
        { recipeName: { $regex: term, $options: 'i' } },
        { ingredients: { $regex: term, $options: 'i' } },
        { category: { $regex: term, $options: 'i' } }
      ]
    });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  searchRecipes
};
