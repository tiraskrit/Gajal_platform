import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import './Login.css';
import { API_URL } from '../api.js';

const Login = ({ setIsAuthenticated, setIsAdmin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/login`, { 
        email, 
        password,
        rememberMe 
      });
      const token = response.data.access_token;
      
      // Store the token based on remember me preference
      if (rememberMe) {
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('token', token);
      }
  
      const decoded = jwtDecode(token);
      setIsAuthenticated(true);
      if (decoded.role === 'admin') {
        setIsAdmin(true);
      }
      navigate('/');
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/forgot-password`, { email: resetEmail });
      setShowResetModal(false);
      alert('Password reset instructions have been sent to your email.');
    } catch (error) {
      setError('Failed to initiate password reset. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="form-input" 
              required 
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="form-input" 
              required 
              placeholder="Enter your password"
            />
          </div>
          <div className="form-group-checkbox">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <button 
          onClick={() => setShowResetModal(true)} 
          className="forgot-password-link"
        >
          Forgot Password?
        </button>
      </div>

      {showResetModal && (
  <div className="modal-overlay">
    <div className="modal">
      <div className="modal-header">
        <h3>Reset Password</h3>
        <button 
          className="close-button" 
          onClick={() => setShowResetModal(false)}
        >
          &times;
        </button>
      </div>
      <form onSubmit={handleForgotPassword} className="modal-form">
        <div className="form-group">
          <label htmlFor="resetEmail">Email Address</label>
          <input
            type="email"
            id="resetEmail"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            className="modal-input"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="modal-actions">
          <button type="submit" className="modal-button primary">
            Send Reset Link
          </button>
          <button 
            type="button" 
            className="modal-button secondary" 
            onClick={() => setShowResetModal(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default Login;