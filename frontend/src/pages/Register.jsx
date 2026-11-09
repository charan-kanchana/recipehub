import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

function Register({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const res = await API.post('/auth/register', {
        name,
        email,
        password,
        role,
      });

      // Save token and user in localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));

      // Update parent App state
      onLogin(res.data);

      setLoading(false);
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Failed to register. Please try again.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Create an Account</h2>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="e.g. john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Account Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">Normal User (Cook / Food Lover)</option>
              <option value="admin">Administrator</option>
            </select>
            <p className="help-text">Select Administrator if you want to test admin dashboard features.</p>
          </div>

          <button
            type="submit"
            className="btn"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p style={{ marginTop: '15px', fontSize: '14px', textAlign: 'center' }}>
          Already have an account? <Link to="/login" style={{ color: '#e06a26', fontWeight: 'bold' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

