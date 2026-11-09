# Complete Project Explanation & Viva Preparation Guide

This guide provides an in-depth breakdown of the entire Digital Recipe Sharing and Food Management System (MERN Stack, Problem Statement M32). It covers the full architecture, every backend and frontend file, how components communicate, the database schemas, API routes, and a complete Viva preparation section with answers to questions evaluators typically ask.

---

## 1. System Architecture & Request Lifecycle

The application follows the classic three-tier MERN architecture:

```
[ Client Tier ]
React 19 User Interface (Vite on Port 5173)
       │
       │ HTTP / JSON via Axios (services/api.js)
       ▼
[ Application Tier ]
Node.js + Express REST API Server (Port 5000)
       ├── Middleware (cors, express.json)
       ├── Routes (routes/*.js)
       └── Controllers (controllers/*.js)
       │
       │ Object Data Modeling (Mongoose)
       ▼
[ Database Tier ]
MongoDB Server (Port 27017) -> Database: recipes_db
       ├── recipes
       ├── categories
       ├── users
       └── favorites
```

### Complete Lifecycle of a User Action (Example: Adding a Recipe)
1. The user fills out the form in `RecipeForm.jsx` and clicks "Add Recipe".
2. React collects input states (name, category, ingredients array, instructions array, cooking time, etc.).
3. The component calls `createRecipe(payload)` from `services/api.js`.
4. Axios makes an HTTP `POST` request to `http://localhost:5000/api/recipes` with the JSON payload.
5. In Express (`server.js`), the request enters through `cors()` and `express.json()` middlewares.
6. The router (`routes/recipeRoutes.js`) matches `POST /` and forwards the request to `createRecipe` in `controllers/recipeController.js`.
7. The controller validates fields, generates a unique `recipeId` (like `RC104`) if blank, and instantiates the `Recipe` Mongoose model (`models/Recipe.js`).
8. Mongoose saves the document into the MongoDB collection `recipes` at `mongodb://127.0.0.1:27017/recipes_db`.
9. The controller returns a status `201 Created` with the saved document JSON.
10. The React component receives the response, triggers a success toast notification in `App.jsx`, switches the view back to the recipe catalog, and re-fetches the latest recipe list from MongoDB.

---

## 2. Backend Architecture: Detailed File-by-File Breakdown

```
backend/
├── config/
│   └── db.js
├── controllers/
│   ├── categoryController.js
│   ├── favoriteController.js
│   ├── recipeController.js
│   └── userController.js
├── models/
│   ├── Category.js
│   ├── Favorite.js
│   ├── Recipe.js
│   └── User.js
├── routes/
│   ├── categoryRoutes.js
│   ├── favoriteRoutes.js
│   ├── recipeRoutes.js
│   └── userRoutes.js
├── .env
├── package.json
└── server.js
```

### 1. `backend/package.json`
- **What it is:** The project manifest for Node.js.
- **What it does:**
  - Defines scripts: `npm run dev` (runs `nodemon server.js` to auto-restart on code changes) and `npm start` (`node server.js`).
  - Lists production dependencies:
    - `express`: Core framework for REST API endpoints and routing.
    - `mongoose`: ODM (Object Data Modeling) library to define schemas and communicate with MongoDB.
    - `cors`: Cross-Origin Resource Sharing middleware allowing the Vite frontend on port 5173 to call the backend on port 5000.
    - `dotenv`: Loads environment variables from `.env`.
  - Lists devDependencies: `nodemon` for continuous hot-reloading during development.

### 2. `backend/.env`
- **What it is:** Configuration file for environment-specific variables.
- **Variables defined:**
  - `PORT=5000`: The network port where the Express server listens.
  - `MONGO_URI=mongodb://127.0.0.1:27017/recipes_db`: The connection URI for the local MongoDB instance and database name.

### 3. `backend/server.js`
- **What it is:** The central entry point and bootstrap file of the backend application.
- **What it does:**
  - Loads environment variables using `dotenv.config()`.
  - Creates the Express application instance (`const app = express()`).
  - Attaches global middleware:
    - `app.use(cors())`: Allows browser requests from other origins (such as `http://localhost:5173`).
    - `app.use(express.json())`: Parses incoming HTTP request bodies formatted as JSON into `req.body`.
  - Calls `connectDB()` from `config/db.js` to establish connection with MongoDB.
  - Seeds initial sample data if the collections are empty:
    - Creates starter recipe `RC101 Vegetable Biryani` (matching the exact document structure in the hackathon problem statement), along with `RC102 Paneer Butter Masala` and `RC103 Mango Lassi`.
    - Creates starter categories: `Main Course`, `Appetizer`, `Dessert`, `Beverage`.
    - Creates starter users: `Rahul Sharma` (Admin), `Anita Patel` (User).
  - Mounts route handlers to specific URL paths:
    - `/api/users` -> `userRoutes`
    - `/api/recipes` -> `recipeRoutes`
    - `/api/categories` -> `categoryRoutes`
    - `/api/favorites` -> `favoriteRoutes`
  - Defines a health-check endpoint `GET /` returning `{ message: 'Recipe Management API is running' }`.
  - Binds to port 5000 and listens for requests.
  - Includes a port conflict listener (`server.on('error', ...)` ) to catch `EADDRINUSE` errors if port 5000 is occupied.

### 4. `backend/config/db.js`
- **What it is:** Database connection module.
- **What it does:**
  - Imports `mongoose`.
  - Exports an asynchronous function `connectDB`.
  - Connects to `process.env.MONGO_URI` with a default fallback to `mongodb://127.0.0.1:27017/recipes_db`.
  - Logs the host name when successfully connected. If the connection fails, logs the error and terminates the process with code 1.

### 5. `backend/models/Recipe.js`
- **What it is:** Mongoose schema for the `recipes` collection.
- **Fields and constraints:**
  - `recipeId` (String, required, unique): Unique identifier like `RC101`.
  - `recipeName` (String, required): Name of the dish.
  - `category` (String, required): e.g., `Main Course`, `Dessert`.
  - `createdBy` (String, required): Name of the user who submitted the recipe.
  - `ingredients` ([String], required): An array of ingredient names (e.g., `["Rice", "Carrot", "Beans", "Spices"]`).
  - `cookingTime` (Number, required): Cooking duration in minutes.
  - `difficulty` (String, enum: `['Easy', 'Medium', 'Hard']`, default `Medium`).
  - `description` (String): A short summary of the dish.
  - `instructions` ([String], default `[]`): An ordered array of cooking steps.
  - `status` (String, enum: `['Published', 'Draft']`, default `Published`).
  - `timestamps`: Automatically adds `createdAt` and `updatedAt`.

### 6. `backend/models/User.js`
- **What it is:** Mongoose schema for the `users` collection.
- **Fields:**
  - `name` (String, required): Full user name.
  - `email` (String, required, unique, lowercase): User email address.
  - `role` (String, enum: `['Admin', 'User']`, default `User`).
  - `timestamps`: Records registration time.

### 7. `backend/models/Category.js`
- **What it is:** Mongoose schema for the `categories` collection.
- **Fields:**
  - `categoryName` (String, required, unique): Category name.
  - `description` (String): Explanation of dishes belonging to this category.
  - `timestamps`: Creation timestamp.

### 8. `backend/models/Favorite.js`
- **What it is:** Mongoose schema for the `favorites` collection.
- **Fields:**
  - `recipeId` (String, required): References the recipe.
  - `recipeName` (String, required): Stored recipe name for quick lookup.
  - `category` (String): Food category.
  - `userName` (String, default `Rahul`): User who favorited the dish.
  - `notes` (String): Personal notes.
  - `timestamps`: Timestamp when added to favorites.

### 9. `backend/controllers/recipeController.js`
- **What it is:** Contains the core business logic for all recipe operations.
- **Exported functions:**
  - `getRecipes(req, res)`:
    - Reads query parameters `req.query.category` and `req.query.search`.
    - If `category` is present (and not `All`), applies `{ category }`.
    - If `search` is present, uses `$or` with `$regex` (case-insensitive) on `recipeName` and `ingredients`.
    - Returns matching recipes sorted by newest first.
  - `getRecipeById(req, res)`:
    - Accepts an ID parameter from `req.params.id`.
    - Supports lookup by either native MongoDB `_id` (via `mongoose.Types.ObjectId.isValid`) or the custom `recipeId` (e.g. `RC101`).
    - Returns 404 if not found, or 200 with the recipe document.
  - `createRecipe(req, res)`:
    - Extracts recipe details from `req.body`.
    - If `recipeId` was omitted, computes `RC` + (101 + document count) to ensure a clean ID.
    - Checks for duplicate `recipeId`.
    - Parses `ingredients` and `instructions` into clean arrays even if received as comma-delimited or newline strings.
    - Saves the document and returns status 201.
  - `updateRecipe(req, res)`:
    - Locates the recipe by `recipeId` or `_id`.
    - Updates fields and returns the updated document (`new: true`).
  - `deleteRecipe(req, res)`:
    - Finds and removes the recipe by `recipeId` or `_id`.
    - Returns a success confirmation message.
  - `searchRecipes(req, res)`:
    - Specialized search endpoint supporting `/api/recipes/search/:keyword`.
    - Performs regex matching against `recipeName`, `ingredients`, and `category`.

### 10. `backend/controllers/userController.js`
- **Exported functions:**
  - `registerUser(req, res)`: Checks if a user with the provided email already exists. If not, creates and saves a new user with role `Admin` or `User`. Returns status 201.
  - `getUsers(req, res)`: Retrieves all registered users from the `users` collection sorted by creation date.

### 11. `backend/controllers/categoryController.js`
- **Exported functions:**
  - `addCategory(req, res)`: Performs a case-insensitive check to prevent duplicate category names, saves the new category, and returns status 201.
  - `getCategories(req, res)`: Retrieves all categories sorted alphabetically.

### 12. `backend/controllers/favoriteController.js`
- **Exported functions:**
  - `addFavorite(req, res)`: Checks if the user already saved the specific recipe. If not, stores the favorite entry in MongoDB.
  - `getFavorites(req, res)`: Returns all saved favorite records.
  - `deleteFavorite(req, res)`: Deletes a favorite record by ID.

### 13. `backend/routes/recipeRoutes.js`
- **What it is:** Express router defining recipe endpoints.
- **Route ordering rule:**
  - `router.get('/search/:keyword', searchRecipes)` and `router.get('/search', searchRecipes)` are defined **before** `router.get('/:id', getRecipeById)`. This prevents Express from mistaking the word "search" for a recipe ID parameter.
  - Connects `GET /`, `POST /`, `GET /:id`, `PUT /:id`, and `DELETE /:id` to their respective controller functions.

### 14. `backend/routes/userRoutes.js`, `categoryRoutes.js`, `favoriteRoutes.js`
- Map HTTP routes (`/api/users`, `/api/categories`, `/api/favorites`) to their respective controller methods (`registerUser`, `getUsers`, `addCategory`, `getCategories`, `addFavorite`, `getFavorites`, `deleteFavorite`).

---

## 3. Frontend Architecture: Detailed File-by-File Breakdown

```
frontend/
├── src/
│   ├── components/
│   │   ├── CategoryManager.jsx
│   │   ├── FavoritesList.jsx
│   │   ├── Navbar.jsx
│   │   ├── RecipeCard.jsx
│   │   ├── RecipeDetail.jsx
│   │   ├── RecipeForm.jsx
│   │   ├── RecipeList.jsx
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

### 1. `frontend/index.html` & `vite.config.js`
- **`index.html`**: Host page. Contains `<div id="root"></div>` and loads `<script type="module" src="/src/main.jsx"></script>`.
- **`vite.config.js`**: Configures Vite with the `@vitejs/plugin-react` plugin for JSX transformation and Fast Refresh during development.

### 2. `frontend/src/main.jsx`
- **What it is:** React's client-side mounting file.
- **What it does:** Uses React 19's `createRoot(document.getElementById('root'))` to render `<App />` wrapped in `<StrictMode>`. Imports global CSS from `./App.css`.

### 3. `frontend/src/services/api.js`
- **What it is:** Centralized HTTP service using Axios.
- **How it works:**
  - Creates an Axios instance with `baseURL: 'http://localhost:5000/api'`.
  - Exposes dedicated asynchronous helper functions:
    - `getRecipes(params)` -> `GET /recipes`
    - `getRecipeById(id)` -> `GET /recipes/${id}`
    - `searchRecipes(keyword)` -> `GET /recipes/search/${keyword}`
    - `createRecipe(data)` -> `POST /recipes`
    - `updateRecipe(id, data)` -> `PUT /recipes/${id}`
    - `deleteRecipe(id)` -> `DELETE /recipes/${id}`
    - `getCategories()` -> `GET /categories`
    - `createCategory(data)` -> `POST /categories`
    - `getUsers()` -> `GET /users`
    - `registerUser(data)` -> `POST /users`
    - `getFavorites()` -> `GET /favorites`
    - `addFavorite(data)` -> `POST /favorites`
    - `deleteFavorite(id)` -> `DELETE /favorites/${id}`
- **Why this structure:** Keeps component files clean without repetitive Axios configuration or hardcoded URLs.

### 4. `frontend/src/App.jsx`
- **What it is:** The top-level state manager and controller of the entire UI.
- **Key State Variables:**
  - `activeTab`: Tracks the current view (`'recipes'`, `'add-recipe'`, `'categories'`, `'favorites'`, `'users'`).
  - `recipeToEdit`: Holds a recipe object when editing; `null` when creating a new recipe.
  - `selectedRecipe`: Holds a recipe object when viewing full details in a modal; `null` when modal is closed.
  - `favorites`: Array of favorited recipe records fetched from the backend.
  - `alert`: Object `{ message, type }` used to display toast alerts (success, error, info).
  - `listKey`: Incremental integer key used to force-refresh the recipe catalog upon additions or updates.
- **Key Handler Functions:**
  - `showAlert(message, type)`: Displays a temporary toast notification for 4 seconds.
  - `handleEditRecipe(recipe)`: Prepopulates the form with the recipe and switches view to `add-recipe`.
  - `handleDeleteRecipe(id)`: Prompts user confirmation, calls `deleteRecipe(id)`, displays feedback, and reloads data.
  - `handleToggleFavorite(recipe)`: Checks if recipe is already in `favorites`. If yes, calls `deleteFavorite`; if no, calls `addFavorite`.
  - `handleViewFavoriteRecipe(recipeId)`: Retrieves full details of a saved favorite by ID and opens the detail modal.

### 5. `frontend/src/App.css`
- **What it is:** Comprehensive stylesheet for the entire application.
- **Key Sections:**
  - CSS Reset and typography styling.
  - Sticky navigation header with brand badge and active tab states.
  - Recipe card grid with hover elevation and badges (status, difficulty, category).
  - Filter bar styling (search input field, search button, category pill chips).
  - Form layout with dynamic multi-row inputs for ingredients and cooking instruction steps.
  - Modal overlay system with backdrop blur for viewing recipe details.
  - Floating toast notifications (success green, info blue, error red).
  - Mobile responsive media queries (switches multi-column layouts to single-column on screens below 768px).

### 6. `frontend/src/components/Navbar.jsx`
- **Props received:** `activeTab`, `setActiveTab`.
- **What it renders:**
  - App brand logo with problem badge (`M32 RecipeHub`).
  - Navigation tab buttons: `Recipes`, `+ Add Recipe`, `Categories`, `Favorites`, `Users`.
  - Highlights the currently active tab using conditional CSS class `active`.

### 7. `frontend/src/components/RecipeList.jsx`
- **Props received:** `onView`, `onEdit`, `onDelete`, `onFavorite`, `favorites`, `onAddNew`.
- **Internal State:**
  - `recipes`: Array of recipe documents currently displayed.
  - `categories`: Array of category names fetched from `/api/categories`.
  - `selectedCategory`: Active category filter (defaults to `'All'`).
  - `searchTerm`: Search string typed into the search box.
  - `loading`: Boolean indicating network request in progress.
  - `error`: Error message string if network fails.
- **How it works:**
  - `fetchCategoryList()`: Runs once on mount (`useEffect`) to populate category chips.
  - `fetchRecipes()`: Re-runs whenever `selectedCategory` changes or search is submitted.
  - Passes category and search query parameters to `getRecipes({ category, search })`.
  - Renders a grid of `RecipeCard` components, or displays an empty state if no recipes match.

### 8. `frontend/src/components/RecipeCard.jsx`
- **Props received:** `recipe`, `onView`, `onEdit`, `onDelete`, `onFavorite`, `isFavorite`.
- **What it renders:**
  - Header: `recipeId` badge (e.g. `RC101`) and status tag (`Published` or `Draft`).
  - Title and category.
  - Short description text.
  - Metadata row: cooking time with clock icon, difficulty badge (`Easy`, `Medium`, `Hard`), and chef author name (`By: Rahul`).
  - Ingredients preview tags (shows first 4 ingredients plus a "+N more" badge).
  - Action buttons:
    - `View`: Triggers `onView(recipe)` to display modal.
    - `Favorite`: Toggles favorite state (`★ Saved` / `☆ Favorite`).
    - `Edit`: Triggers `onEdit(recipe)`.
    - `Delete`: Triggers `onDelete(recipe.recipeId)`.

### 9. `frontend/src/components/RecipeDetail.jsx`
- **Props received:** `recipe`, `onClose`, `onEdit`, `onFavorite`, `isFavorite`.
- **What it renders:**
  - Modal dialog with blurred backdrop.
  - Complete recipe metadata: ID, category, status, cooking time in minutes, difficulty, author.
  - Full description paragraph.
  - Ingredients checklist with checkmark bullets.
  - Step-by-step numbered cooking instructions.
  - Action buttons: Add to Favorites, Edit Recipe, and Close.

### 10. `frontend/src/components/RecipeForm.jsx`
- **Props received:** `recipeToEdit`, `onSaveSuccess`, `onCancel`.
- **Internal State:**
  - `formData`: Holds `recipeId`, `recipeName`, `category`, `createdBy`, `cookingTime`, `difficulty`, `description`, `status`.
  - `ingredients`: Array of strings for dynamic ingredient fields.
  - `instructions`: Array of strings for step-by-step preparation steps.
  - `categories`: Available categories fetched from backend.
  - `submitting`: Disables buttons during network activity.
- **Key Features:**
  - **Dual Mode:** If `recipeToEdit` is provided, populates fields for editing (disabling the `recipeId` field). If null, acts as a creation form.
  - **Dynamic Ingredients:** "+ Add Ingredient" appends a new text input; "✕" removes that specific field.
  - **Dynamic Instructions:** "+ Add Step" appends a new step; "✕" removes that specific step.
  - Form validation: verifies that at least one ingredient is provided before submitting.
  - Submits via `createRecipe` or `updateRecipe`, then calls `onSaveSuccess()`.

### 11. `frontend/src/components/CategoryManager.jsx`
- **Props received:** `onSelectCategory`.
- **What it does:**
  - Left column: Form to add a new category (`categoryName`, `description`) via `POST /api/categories`.
  - Right column: Table listing all existing categories with a "View Recipes" button that switches back to the catalog filtered by that category.

### 12. `frontend/src/components/FavoritesList.jsx`
- **Props received:** `favorites`, `onRemoveFavorite`, `onViewRecipe`.
- **What it does:**
  - Renders all dishes marked as favorite in a structured table.
  - Columns: Recipe ID, Recipe Name, Category, Saved For User, Actions.
  - Provides "View Details" (opens detail modal) and "Remove" (deletes record from MongoDB `favorites`).

### 13. `frontend/src/components/UserManager.jsx`
- **What it does:**
  - Left column: Form to register new users with `name`, `email`, and `role` (`User` or `Admin`) via `POST /api/users`.
  - Right column: Table displaying registered users, their roles with color-coded badges, and join dates.

---

## 4. Component-to-API & Database Mapping

| Frontend Component | Action / Event | API Call | HTTP Method & Route | MongoDB Collection |
| :--- | :--- | :--- | :--- | :--- |
| `RecipeList.jsx` | Page Load / Filter | `getRecipes()` | `GET /api/recipes` | `recipes` |
| `RecipeList.jsx` | Keyword Search | `getRecipes({ search })` | `GET /api/recipes?search=...` | `recipes` |
| `RecipeForm.jsx` | Submit New Recipe | `createRecipe()` | `POST /api/recipes` | `recipes` |
| `RecipeForm.jsx` | Submit Edited Recipe| `updateRecipe(id)` | `PUT /api/recipes/:id` | `recipes` |
| `RecipeCard.jsx` | Click Delete | `deleteRecipe(id)` | `DELETE /api/recipes/:id` | `recipes` |
| `RecipeCard.jsx` / `Detail`| Click Favorite | `addFavorite()` | `POST /api/favorites` | `favorites` |
| `FavoritesList.jsx` | Page Load | `getFavorites()` | `GET /api/favorites` | `favorites` |
| `FavoritesList.jsx` | Click Remove | `deleteFavorite(id)` | `DELETE /api/favorites/:id` | `favorites` |
| `CategoryManager.jsx` | Submit Category | `createCategory()` | `POST /api/categories` | `categories` |
| `CategoryManager.jsx` | View Categories | `getCategories()` | `GET /api/categories` | `categories` |
| `UserManager.jsx` | Register User | `registerUser()` | `POST /api/users` | `users` |
| `UserManager.jsx` | View Users | `getUsers()` | `GET /api/users` | `users` |

---

## 5. Viva Preparation: Questions & Detailed Answers

### Q1: What is the MERN stack and how does it work in this project?
**Answer:**
MERN stands for **M**ongoDB, **E**xpress.js, **R**eact.js, and **N**ode.js.
- **MongoDB** is our NoSQL database running locally on port 27017, storing collections as JSON-like BSON documents.
- **Node.js** is the JavaScript runtime environment on the server.
- **Express.js** is the backend web framework running on top of Node.js on port 5000, responsible for handling REST API routing, request parsing, and error handling.
- **React.js (with Vite)** is the frontend client running on port 5173, rendering the user interface with reactive components and state.
Communication between the frontend and backend happens asynchronously via HTTP using Axios.

---

### Q2: What collections exist in MongoDB and how is the Recipe schema structured?
**Answer:**
We have four collections in the `recipes_db` database:
1. `recipes`
2. `categories`
3. `users`
4. `favorites`

The `recipes` collection follows the exact specification from the hackathon problem statement:
- `recipeId`: Unique string identifier (e.g., `RC101`).
- `recipeName`: Dish title string.
- `category`: Food category string (e.g., `Main Course`).
- `createdBy`: Author/chef string (e.g., `Rahul`).
- `ingredients`: Array of strings (e.g., `["Rice", "Carrot", "Beans", "Spices"]`).
- `cookingTime`: Number (e.g., `45` minutes).
- `difficulty`: String with enum validation (`Easy`, `Medium`, `Hard`).
- `description`: Text summary.
- `instructions`: Array of strings for step-by-step preparation steps.
- `status`: String with enum validation (`Published`, `Draft`).
- `timestamps`: Automatic `createdAt` and `updatedAt`.

---

### Q3: How did you implement search and filtering?
**Answer:**
Search and filtering are handled on the backend through Mongoose queries inside `recipeController.js`:
- **Filtering by category:** When a category chip is selected in the UI, `selectedCategory` is passed as a query parameter `?category=...`. The backend controller checks `req.query.category` and applies `{ category: req.query.category }` to `Recipe.find()`.
- **Searching by name or ingredient:** When the user types a keyword, the backend builds a `$or` query using `$regex` with the `$options: 'i'` flag for case-insensitivity:
  ```javascript
  query.$or = [
    { recipeName: { $regex: search, $options: 'i' } },
    { ingredients: { $regex: search, $options: 'i' } }
  ]
  ```
This allows users to find recipes either by dish name or by any ingredient inside the ingredients array.

---

### Q4: Why is route ordering important in Express? (Specifically regarding `/search` vs `/:id`)
**Answer:**
In Express, routes are evaluated in the order they are registered. In `routes/recipeRoutes.js`:
```javascript
router.get('/search/:keyword', searchRecipes);
router.get('/search', searchRecipes);
router.get('/:id', getRecipeById);
```
If `/:id` were placed before `/search`, any request to `/api/recipes/search` would treat `"search"` as the `:id` parameter and invoke `getRecipeById("search")` instead of the search controller. Placing specific static routes before dynamic parameter routes ensures proper routing.

---

### Q5: How do you handle recipe lookup by both MongoDB `_id` and custom `recipeId`?
**Answer:**
In `getRecipeById`, `updateRecipe`, and `deleteRecipe`, we check if the incoming `id` parameter is a valid 24-character hexadecimal MongoDB ObjectId using:
```javascript
mongoose.Types.ObjectId.isValid(id)
```
If valid, it looks up the document by `_id`. If not found or if the ID is a custom identifier like `RC101`, it searches using `{ recipeId: id }`. This makes the API versatile, allowing lookups by both internal database IDs and human-readable recipe codes.

---

### Q6: What is CORS and why is it needed?
**Answer:**
CORS stands for Cross-Origin Resource Sharing. By default, web browsers enforce the Same-Origin Policy, which blocks web applications running on one origin (such as `http://localhost:5173`) from making AJAX/fetch requests to another origin (such as `http://localhost:5000`).
In `backend/server.js`, we use:
```javascript
const cors = require('cors');
app.use(cors());
```
This adds the `Access-Control-Allow-Origin: *` response header, allowing the Vite React frontend to communicate with the Express API.

---

### Q7: How does dynamic ingredient and instruction management work in the frontend?
**Answer:**
In `RecipeForm.jsx`, ingredients and instructions are stored in component state as arrays of strings:
```javascript
const [ingredients, setIngredients] = useState(['']);
const [instructions, setInstructions] = useState(['']);
```
- When the user clicks "+ Add Ingredient" or "+ Add Step", a new empty string `''` is appended to the array.
- When typing, `handleIngredientChange(index, value)` creates a copy of the array, updates the string at that specific index, and updates the state.
- When clicking "✕", `removeIngredientField(index)` filters out that element.
Before submission, empty or whitespace strings are trimmed and filtered out.

---

### Q8: What error occurred during development with `EADDRINUSE: address already in use :::5000` and how was it solved?
**Answer:**
The error occurred because a background Node process was already running and listening on port 5000. When nodemon attempted to launch another instance of `server.js`, the operating system rejected the port binding.
**Resolution:**
1. Identified and terminated the orphan process occupying port 5000.
2. Added an error event handler to `server.js` (`server.on('error', ...)`) to catch `EADDRINUSE` cleanly without unhandled crash loops.

---

### Q9: Why is `.env` added to `.gitignore`?
**Answer:**
The `.env` file contains environment-specific configurations and credentials (such as database URIs, secret keys, or local ports). It should never be committed to public version control because:
1. It prevents security vulnerabilities and credential leakage.
2. Different environments (development, staging, production) use different database URIs.
We keep a `.gitignore` file at the root repository level to prevent `.env` and `node_modules/` from being tracked.

---

### Q10: How would you demonstrate the working project to an evaluator?
**Answer:**
Follow this sequence during the evaluation demonstration:
1. **Database:** Open **MongoDB Compass**, connect to `mongodb://localhost:27017`, and show the `recipes_db` database with seeded documents (`RC101 Vegetable Biryani`, `categories`, `users`).
2. **Catalog View:** Show `http://localhost:5173` rendering the recipe cards with cooking times, difficulty badges, and ingredients.
3. **Search & Filter:** Type "Biryani" in the search box to demonstrate instant keyword search. Click the "Beverage" category chip to demonstrate category filtering.
4. **Recipe Details:** Click "View" on a card to show the modal with the complete ingredient checklist and step-by-step instructions.
5. **Create / Edit Recipe:** Click "+ Add Recipe", fill in a new dish with dynamic ingredients and cooking steps, submit, and show the instant toast notification and updated catalog.
6. **Favorites:** Click the "Favorite" button on a dish, switch to the "Favorites" tab, and show that the dish is saved in MongoDB.
7. **Categories & Users:** Open the "Categories" tab to add a category, then open "Users" to register a user and show the registered users table.
