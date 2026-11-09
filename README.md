# M32: Digital Recipe Sharing and Food Management System

MERN Stack application built according to the Hackathon Problem Statement and Guidelines.

## Project Structure

```
temp/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── categoryController.js
│   │   ├── favoriteController.js
│   │   ├── recipeController.js
│   │   └── userController.js
│   ├── models/
│   │   ├── Category.js
│   │   ├── Favorite.js
│   │   ├── Recipe.js
│   │   └── User.js
│   ├── routes/
│   │   ├── categoryRoutes.js
│   │   ├── favoriteRoutes.js
│   │   ├── recipeRoutes.js
│   │   └── userRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── CategoryManager.jsx
    │   │   ├── FavoritesList.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── RecipeCard.jsx
    │   │   ├── RecipeDetail.jsx
    │   │   ├── RecipeForm.jsx
    │   │   └── UserManager.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.css
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Database Details (MongoDB Compass)

- Connection URI: `mongodb://127.0.0.1:27017/recipes_db`
- Collections:
  - `recipes`
  - `categories`
  - `users`
  - `favorites`

### Sample Recipe Document (`recipes` collection):

```json
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
```

## REST API Endpoints Specification

| Method | Endpoint Route | Operation |
| :--- | :--- | :--- |
| POST | `/api/users` | Register user |
| GET | `/api/users` | View users |
| POST | `/api/recipes` | Add recipe |
| GET | `/api/recipes` | View recipes |
| GET | `/api/recipes/:id` | Get recipe |
| PUT | `/api/recipes/:id` | Update recipe |
| DELETE | `/api/recipes/:id` | Delete recipe |
| GET | `/api/recipes/search/:keyword` | Search recipe |
| POST | `/api/categories` | Add recipe category |
| GET | `/api/categories` | View categories |
| POST | `/api/favorites` | Add favorite recipe |
| GET | `/api/favorites` | View favorite recipes |
| DELETE | `/api/favorites/:id` | Remove favorite recipe |

## Running the Application

### Backend
1. Navigate to the backend directory:
   `cd backend`
2. Install packages (if not already installed):
   `npm install`
3. Start the server:
   `npm run dev` or `node server.js`
   Server starts on `http://localhost:5000`

### Frontend
1. Navigate to the frontend directory:
   `cd frontend`
2. Install packages (if not already installed):
   `npm install`
3. Start the Vite development server:
   `npm run dev`
   Access the web app at `http://localhost:5173`
