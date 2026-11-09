# System & Software Requirements

If you have cloned this repository, here is the complete list of prerequisites, softwares, dependencies, and configuration steps required to run the project.

---

## 1. System Software & Tools (Pre-installed)

Make sure the following softwares are installed on your computer before starting:

| Software | Recommended Version | Purpose | Download Link |
| :--- | :--- | :--- | :--- |
| **Node.js** | v18.x, v20.x, or v22+ | JavaScript runtime for backend & frontend tooling | [nodejs.org](https://nodejs.org/) |
| **npm** | v9.x or higher (comes with Node.js) | Package manager | Built-in with Node |
| **MongoDB Community Server** | v6.0+ or v7.0+ | Local database server (runs on port 27017) | [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community) |
| **MongoDB Compass** | Latest | GUI client to view and manage collections & documents | [mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass) |
| **Git** | Latest | Source control (for cloning and versioning) | [git-scm.com](https://git-scm.com/) |
| **Web Browser** | Chrome / Edge / Firefox / Brave | To view and interact with the application | Any modern browser |

---

## 2. Ports & Networking Requirements

Ensure the following default ports are free and not blocked by firewalls or other running services:

| Port | Service | Default URL |
| :--- | :--- | :--- |
| `27017` | MongoDB Daemon (`mongod`) | `mongodb://127.0.0.1:27017` |
| `5000` | Node.js / Express Backend API | `http://localhost:5000` |
| `5173` | Vite React Frontend Server | `http://localhost:5173` |

---

## 3. Package Dependencies

### Backend Dependencies (`backend/package.json`)

- **Runtime Dependencies:**
  - `express`: Fast, unopinionated web framework for Node.js
  - `mongoose`: MongoDB object modeling and schema management
  - `cors`: Middleware to enable Cross-Origin Resource Sharing for frontend requests
  - `dotenv`: Loads environment variables from `.env` file
- **Development Dependencies:**
  - `nodemon`: Automatically restarts the server when code changes are detected

### Frontend Dependencies (`frontend/package.json`)

- **Runtime Dependencies:**
  - `react`: UI component library
  - `react-dom`: DOM rendering engine for React
  - `axios`: Promise-based HTTP client for calling backend REST APIs
- **Development Dependencies:**
  - `vite`: Fast frontend build tool and dev server
  - `@vitejs/plugin-react`: Vite plugin for React JSX transformation and Fast Refresh

---

## 4. Environment Variables Setup

Ensure `backend/.env` exists with the following configuration:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/recipes_db
```

---

## 5. Quick Start Guide for New Clones

### Step 1: Start MongoDB
Ensure MongoDB is running locally. You can verify by opening **MongoDB Compass** and clicking **Connect** to `mongodb://localhost:27017`.

### Step 2: Start Backend
```powershell
cd backend
npm install
npm run dev
```
The server will start on `http://localhost:5000` and automatically seed initial sample recipes, categories, and users if the database is empty.

### Step 3: Start Frontend
Open a new terminal:
```powershell
cd frontend
npm install
npm run dev
```
Open your browser and visit: `http://localhost:5173`
