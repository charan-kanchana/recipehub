# Requirements & Setup Guide

Everything needed to run this project locally.

## Prerequisites

Make sure the following are installed:

- **Node.js** (v18 or higher) and npm
- **MongoDB Community Server** (running locally on port 27017)
- **MongoDB Compass** (for inspecting database collections)
- **Git**

## Default Ports

- `27017` - MongoDB Server
- `5000` - Express Backend API
- `5173` - Vite React Frontend

## Project Dependencies

### Backend
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `cors` - Cross-origin requests
- `dotenv` - Environment variables
- `nodemon` - Auto-reload in development

### Frontend
- `react` & `react-dom` - UI library
- `react-router-dom` - Client-side page routing
- `axios` - HTTP client
- `vite` - Dev server and bundler

## Environment Configuration

Create or update `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/recipes_db
```

## Running the Project

1. **Start Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Open Application:**
   Visit `http://localhost:5173` in your browser.
