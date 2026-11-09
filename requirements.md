# Requirements & Setup Guide

Everything you need installed on your machine to run this project after cloning.

## Required Software

Before running the app, make sure you have these installed:

1. **Node.js** (v18 or higher) - [Download Node.js](https://nodejs.org/)
   - npm comes installed with Node.
2. **MongoDB Community Server** - [Download MongoDB](https://www.mongodb.com/try/download/community)
   - Runs locally as a service on default port 27017.
3. **MongoDB Compass** - [Download Compass](https://www.mongodb.com/try/download/compass)
   - Visual GUI tool to browse your database and collections.
4. **Git** - [Download Git](https://git-scm.com/)
5. **Modern Web Browser** - Chrome, Edge, Firefox, or Brave.

## Ports Used

Make sure these ports are free:

- **27017** - MongoDB Server
- **5000** - Express Backend API
- **5173** - Vite React Frontend

## Dependencies

### Backend
- `express` - Server framework
- `mongoose` - Database connection and models
- `cors` - Allows frontend to communicate with backend
- `dotenv` - Reads environment variables
- `nodemon` - Auto-reloads server on file save (dev dependency)

### Frontend
- `react` & `react-dom` - User interface
- `axios` - Handles HTTP API requests
- `vite` - Fast build tool and local dev server

## Environment Variables

The backend uses a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/recipes_db
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd recipe
   ```

2. **Start Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Start Frontend:**
   Open another terminal window:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Open in browser:**
   Go to `http://localhost:5173` to use the app.
