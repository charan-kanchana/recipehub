import React, { useState, useEffect } from 'react';
import { getUsers, registerUser } from '../services/api';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('User');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await registerUser({
        name: name.trim(),
        email: email.trim(),
        role
      });
      setName('');
      setEmail('');
      setRole('User');
      setSuccess('User registered successfully!');
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manager-view">
      <div className="view-header">
        <div>
          <h2>User Management & Registration</h2>
          <p className="subtitle">Register users and view active community participants</p>
        </div>
      </div>

      <div className="manager-grid">
        <div className="form-card compact-card">
          <h3>Register New User</h3>
          {error && <div className="alert-error">{error}</div>}
          {success && <div className="alert-success">{success}</div>}

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                placeholder="e.g. rahul@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>User Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="User">Standard User</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>

            <button type="submit" className="btn-primary full-width" disabled={loading}>
              {loading ? 'Registering...' : 'Register User'}
            </button>
          </form>
        </div>

        <div className="table-card">
          <h3>Registered Users ({users.length})</h3>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">No registered users found.</td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id}>
                      <td className="font-bold">{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`role-badge role-${u.role.toLowerCase()}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
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

export default UserManager;
