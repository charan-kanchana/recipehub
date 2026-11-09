import React, { useState, useEffect } from 'react';
import { getCategories, createCategory } from '../services/api';

const CategoryManager = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await createCategory({
        categoryName: categoryName.trim(),
        description: description.trim()
      });
      setCategoryName('');
      setDescription('');
      setSuccess('Category added successfully!');
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manager-view">
      <div className="view-header">
        <div>
          <h2>Manage Recipe Categories</h2>
          <p className="subtitle">Create and organize food recipe classifications</p>
        </div>
      </div>

      <div className="manager-grid">
        <div className="form-card compact-card">
          <h3>Add New Category</h3>
          {error && <div className="alert-error">{error}</div>}
          {success && <div className="alert-success">{success}</div>}

          <form onSubmit={handleAddCategory}>
            <div className="form-group">
              <label>Category Name *</label>
              <input
                type="text"
                placeholder="e.g. Desserts, Main Course, Salads"
                required
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                rows="3"
                placeholder="Describe what belongs in this category..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="btn-primary full-width" disabled={loading}>
              {loading ? 'Adding...' : '+ Add Category'}
            </button>
          </form>
        </div>

        <div className="table-card">
          <h3>Existing Categories ({categories.length})</h3>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center">No categories found.</td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat._id}>
                      <td className="font-bold">{cat.categoryName}</td>
                      <td>{cat.description || '-'}</td>
                      <td>
                        <button
                          className="btn-table-action"
                          onClick={() => onSelectCategory(cat.categoryName)}
                        >
                          View Recipes
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
