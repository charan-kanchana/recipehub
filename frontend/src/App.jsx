import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './style.css';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RecipeDetails from './pages/RecipeDetails';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import Favorites from './pages/Favorites';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  // Read logged-in user from localStorage on initial load
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar user={user} onLogout={handleLogout} />

        <div style={{ flex: '1' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onLogin={handleLogin} />} />
            <Route path="/recipes/:id" element={<RecipeDetails user={user} />} />
            <Route path="/add-recipe" element={<AddRecipe user={user} />} />
            <Route path="/edit-recipe/:id" element={<EditRecipe user={user} />} />
            <Route path="/favorites" element={<Favorites user={user} />} />
            <Route path="/admin" element={<AdminDashboard user={user} />} />
          </Routes>
        </div>

        <footer className="footer">
          <p>© 2026 RecipeHub – Digital Recipe Sharing and Food Management System</p>
          <p style={{ marginTop: '5px', fontSize: '12px', color: '#999' }}>
            Built with MERN Stack for College Hackathon
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
