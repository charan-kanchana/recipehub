const Favorite = require('../models/Favorite');

const addFavorite = async (req, res) => {
  try {
    const { recipeId, recipeName, category, userName, notes } = req.body;

    if (!recipeId || !recipeName) {
      return res.status(400).json({ message: 'Recipe ID and Recipe Name are required' });
    }

    const existing = await Favorite.findOne({
      recipeId,
      userName: userName || 'Rahul'
    });

    if (existing) {
      return res.status(400).json({ message: 'Recipe is already in favorites' });
    }

    const favorite = new Favorite({
      recipeId,
      recipeName,
      category: category || 'General',
      userName: userName || 'Rahul',
      notes: notes || ''
    });

    const savedFavorite = await favorite.save();
    res.status(201).json(savedFavorite);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find().sort({ createdAt: -1 });
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Favorite.findOneAndDelete({
      $or: [{ _id: id }, { recipeId: id }]
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.status(200).json({ message: 'Favorite removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addFavorite,
  getFavorites,
  deleteFavorite
};
