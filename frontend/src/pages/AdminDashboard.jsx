import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

function AdminDashboard({ user }) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('categories'); // 'categories', 'recipes', 'users'

  // Categories state
  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [editingCatId, setEditingCatId] = useState(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatDesc, setEditCatDesc] = useState('');

  // Recipes state
  const [recipes, setRecipes] = useState([]);

  // Users state
  const [users, setUsers] = useState([]);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Only allow admin
    if (!user || !user.role || user.role.toLowerCase() !== 'admin') {
      alert('Access restricted to administrators only.');
      navigate('/');
      return;
    }

    loadAllData();
  }, [user, navigate]);

  const loadAllData = async () => {
    try {
      const [catsRes, recsRes, usersRes] = await Promise.all([
        API.get('/categories'),
        API.get('/recipes'),
        API.get('/admin/users'),
      ]);
      setCategories(catsRes.data);
      setRecipes(recsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
      setError('Failed to load admin data.');
    }
  };

  // --- Category Actions ---
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      const res = await API.post('/categories', {
        name: newCatName.trim(),
        description: newCatDesc.trim(),
      });
      setCategories([...categories, res.data]);
      setNewCatName('');
      setNewCatDesc('');
      setMessage('Category added successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add category');
    }
  };

  const startEditCategory = (cat) => {
    setEditingCatId(cat._id);
    setEditCatName(cat.name || cat.categoryName);
    setEditCatDesc(cat.description || '');
  };

  const handleUpdateCategory = async (id) => {
    try {
      const res = await API.put(`/categories/${id}`, {
        name: editCatName.trim(),
        description: editCatDesc.trim(),
      });
      setCategories(categories.map((c) => (c._id === id ? res.data : c)));
      setEditingCatId(null);
      setMessage('Category updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await API.delete(`/categories/${id}`);
      setCategories(categories.filter((c) => c._id !== id));
      setMessage('Category deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Failed to delete category');
    }
  };

  // --- Recipe Actions ---
  const handleDeleteRecipe = async (id) => {
    if (!window.confirm('Delete this recipe as inappropriate?')) return;
    try {
      await API.delete(`/recipes/${id}`);
      setRecipes(recipes.filter((r) => r._id !== id));
      setMessage('Recipe removed by admin successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Failed to delete recipe');
    }
  };

  // --- User Actions ---
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user and all their posted recipes?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      // Reload recipes too since their recipes are deleted
      const recsRes = await API.get('/recipes');
      setRecipes(recsRes.data);
      setMessage('User deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <p style={{ color: '#555', marginBottom: '20px' }}>
        Manage registered users, food categories, and moderate recipes.
      </p>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          className={`btn ${activeTab === 'categories' ? '' : 'btn-secondary'}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories ({categories.length})
        </button>
        <button
          className={`btn ${activeTab === 'recipes' ? '' : 'btn-secondary'}`}
          onClick={() => setActiveTab('recipes')}
        >
          Recipes ({recipes.length})
        </button>
        <button
          className={`btn ${activeTab === 'users' ? '' : 'btn-secondary'}`}
          onClick={() => setActiveTab('users')}
        >
          Users ({users.length})
        </button>
      </div>

      {/* TAB 1: Categories Management */}
      {activeTab === 'categories' && (
        <div>
          {/* Add Category Form */}
          <div style={{ background: '#fff', border: '1px solid #ddd', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>Add New Food Category</h3>
            <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Category Name (e.g. Italian)"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                style={{ padding: '6px 10px', border: '1px solid #ccc', borderRadius: '4px', flex: '1' }}
                required
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                style={{ padding: '6px 10px', border: '1px solid #ccc', borderRadius: '4px', flex: '2' }}
              />
              <button type="submit" className="btn btn-sm">Add Category</button>
            </form>
          </div>

          {/* Categories Table */}
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th style={{ width: '160px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id}>
                  {editingCatId === cat._id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          value={editCatName}
                          onChange={(e) => setEditCatName(e.target.value)}
                          style={{ padding: '4px', width: '100%' }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={editCatDesc}
                          onChange={(e) => setEditCatDesc(e.target.value)}
                          style={{ padding: '4px', width: '100%' }}
                        />
                      </td>
                      <td>
                        <button
                          onClick={() => handleUpdateCategory(cat._id)}
                          className="btn btn-sm"
                          style={{ marginRight: '5px' }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCatId(null)}
                          className="btn btn-secondary btn-sm"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td><strong>{cat.name || cat.categoryName}</strong></td>
                      <td>{cat.description || '-'}</td>
                      <td>
                        <button
                          onClick={() => startEditCategory(cat)}
                          className="btn btn-secondary btn-sm"
                          style={{ marginRight: '5px' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat._id)}
                          className="btn btn-danger btn-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: Recipes Moderation */}
      {activeTab === 'recipes' && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Created By</th>
              <th>Time</th>
              <th style={{ width: '150px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((r) => (
              <tr key={r._id || r.recipeId}>
                <td>
                  <Link to={`/recipes/${r._id || r.recipeId}`} style={{ color: '#e06a26', fontWeight: 'bold' }}>
                    {r.title || r.recipeName}
                  </Link>
                </td>
                <td>{r.category}</td>
                <td>{r.createdBy?.name || r.createdBy || 'Unknown'}</td>
                <td>{r.cookingTime} mins</td>
                <td>
                  <Link
                    to={`/edit-recipe/${r._id || r.recipeId}`}
                    className="btn btn-secondary btn-sm"
                    style={{ marginRight: '5px' }}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteRecipe(r._id || r.recipeId)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* TAB 3: User Management */}
      {activeTab === 'users' && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Registered Date</th>
              <th style={{ width: '100px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td><strong>{u.name}</strong></td>
                <td>{u.email}</td>
                <td>
                  <span
                    style={{
                      background: u.role === 'admin' ? '#fff3ea' : '#f0f0f0',
                      color: u.role === 'admin' ? '#e06a26' : '#333',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    {u.role}
                  </span>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  {u._id !== user._id ? (
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  ) : (
                    <span style={{ fontSize: '12px', color: '#888' }}>(You)</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;

