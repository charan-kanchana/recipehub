# RecipeHub - Digital Recipe Sharing & Food Management System

A simple and responsive full-stack MERN application to create, browse, search, and manage food recipes.

## Tech Stack

- **Frontend: React 19, Axios, Vite, CSS
- **Backend: Node.js, Express.js
- **Database: MongoDB & Mongoose
- **Tooling: MongoDB Compass, Nodemon

## Features

- **Recipe Management:** Create, view, edit, and delete food recipes.
- **Recipe Ingredients:** Add and maintain list of ingredients for each dish.
- **Cooking Instructions:** Step-by-step preparation steps.
- **Search & Filter:** Search recipes by name or ingredient, and filter by food category.
- **Categories:** Add and view categories (Main Course, Appetizer, Dessert, Beverage, etc.).
- **Favorites:** Save favourite dishes for quick access.
- **User Management:** Register new users and view existing user records.

## Database Details

- **URI:** `mongodb://127.0.0.1:27017/recipes_db`
- **Collections:** `recipes`, `categories`, `users`, `favorites`

# Sample Recipe Document
{
  "recipeId": "RC101",
  "recipeName": "Vegetable Biryani",
  "category": "Main Course",
  "createdBy": "Rahul",
  "ingredients": ["Rice", "Carrot", "Beans", "Spices"],
  "cookingTime": 45,
  "difficulty": "Medium",
  "description": "Vegetable Biryani Preparation",
  "instructions": [
    "Wash and soak basmati rice for 30 minutes.",
    "Chop vegetables like carrots, beans, and onions.",
    "Sauté whole spices and aromatics in a deep pan.",
    "Layer rice and vegetables, cover and cook on low flame for 20 minutes."
  ],
  "status": "Published"
}


## How to Run

### 1. Start MongoDB
Make sure MongoDB is running locally on port 27017. You can connect through MongoDB Compass using:
`mongodb://localhost:27017`

### 2. Run Backend

cd backend
npm install
npm run dev

Backend runs on `http://localhost:5000`. It will auto-seed starter recipes if the database is empty.

### 3. Run Frontend
In a new terminal:

cd frontend
npm install
npm run dev

Frontend runs on `http://localhost:5173`.
