// frontend/src/components/AuthModal.jsx
import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const AuthModal = ({ onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const endpoint = isLogin ? `${API_BASE}/auth/login` : `${API_BASE}/auth/signup`;

    try {
      const res = await axios.post(endpoint, formData);
      onAuthSuccess(res.data.user);
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Authentication error');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <div className="modal-head">
          <h3>{isLogin ? 'Sign In' : 'Create Account'}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {errorMsg && <div className="form-alert">{errorMsg}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group" style={{ marginBottom: '12px' }}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
              />
            </div>
          )}

          <div className="input-group" style={{ marginBottom: '12px' }}>
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="input-group" style={{ marginBottom: '18px' }}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginBottom: '12px' }}>
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>

          <p className="toggle-auth">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}>
              {isLogin ? 'Register here' : 'Sign In here'}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;