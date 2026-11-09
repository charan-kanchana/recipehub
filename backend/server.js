require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

const Recipe = require('./models/Recipe');
const Category = require('./models/Category');
const User = require('./models/User');

const app = express();

app.use(cors());
app.use(express.json());

connectDB().then(async () => {
  try {
    const recipeCount = await Recipe.countDocuments();
    if (recipeCount === 0) {
      await Recipe.create([
        {
          recipeId: 'RC101',
          recipeName: 'Vegetable Biryani',
          category: 'Main Course',
          createdBy: 'Rahul',
          ingredients: ['Rice', 'Carrot', 'Beans', 'Spices'],
          cookingTime: 45,
          difficulty: 'Medium',
          description: 'Vegetable Biryani Preparation',
          instructions: [
            'Wash and soak basmati rice for 30 minutes.',
            'Chop vegetables like carrots, beans, and onions.',
            'Sauté whole spices and aromatics in a deep pan.',
            'Layer rice and vegetables, cover and cook on low flame for 20 minutes.'
          ],
          status: 'Published'
        },
        {
          recipeId: 'RC102',
          recipeName: 'Paneer Butter Masala',
          category: 'Main Course',
          createdBy: 'Rahul',
          ingredients: ['Paneer', 'Tomatoes', 'Butter', 'Cream', 'Garam Masala'],
          cookingTime: 30,
          difficulty: 'Easy',
          description: 'Rich and creamy tomato gravy with cottage cheese cubes',
          instructions: [
            'Prepare a smooth puree of boiled tomatoes, cashews, and spices.',
            'Melt butter in a pan and simmer the puree.',
            'Add fresh cream, garam masala, and paneer cubes.',
            'Garnish with coriander and serve hot with naan.'
          ],
          status: 'Published'
        },
        {
          recipeId: 'RC103',
          recipeName: 'Mango Lassi',
          category: 'Beverage',
          createdBy: 'Anita',
          ingredients: ['Mango Pulp', 'Yogurt', 'Milk', 'Sugar', 'Cardamom'],
          cookingTime: 10,
          difficulty: 'Easy',
          description: 'Refreshing sweet mango and yogurt drink',
          instructions: [
            'Add mango pulp, cold yogurt, milk, and sugar to a blender.',
            'Blend until smooth and frothy.',
            'Pour into glasses, sprinkle cardamom powder, and serve chilled.'
          ],
          status: 'Published'
        }
      ]);
    }

    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      await Category.create([
        { categoryName: 'Main Course', description: 'Primary hearty dishes for lunch and dinner' },
        { categoryName: 'Appetizer', description: 'Starters and snacks served before main meal' },
        { categoryName: 'Dessert', description: 'Sweet treats, puddings, and confectioneries' },
        { categoryName: 'Beverage', description: 'Cold and hot drinks, juices, and refreshments' }
      ]);
    }

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create([
        { name: 'Rahul Sharma', email: 'rahul@example.com', role: 'Admin' },
        { name: 'Anita Patel', email: 'anita@example.com', role: 'User' }
      ]);
    }
  } catch (seedErr) {
    console.error('Seed error:', seedErr.message);
  }
});

app.use('/api/auth', userRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/favorites', favoriteRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Recipe Management API is running' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is busy`);
  } else {
    console.error(err);
  }
});
