const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  recipeId: {
    type: String,
    required: true,
    trim: true
  },
  recipeName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  userName: {
    type: String,
    default: 'Rahul',
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Favorite', favoriteSchema);
