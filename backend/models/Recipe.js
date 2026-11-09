const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  recipeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  recipeName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  ingredients: {
    type: [String],
    required: true
  },
  cookingTime: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  description: {
    type: String,
    trim: true
  },
  instructions: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['Published', 'Draft'],
    default: 'Published'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Recipe', recipeSchema);
