import React, { useEffect, useState } from 'react';
import PoemCard from './PoemCard';
import { useLocation } from 'react-router-dom';
import './AuthButtons.css';
import { API_URL } from '../api.js';

export default function PoemList() {
  const [poems, setPoems] = useState([]);
  const [error, setError] = useState(null);

  const query = new URLSearchParams(useLocation().search);
  const selectedType = query.get('type');

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    fetch(`${API_URL}/api/poems`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Please login or signup to see all the poems and submit your own');
        }
        return response.json();
      })
      .then((data) => {
        if (selectedType) {
          setPoems(data.filter((poem) => poem.content_type === selectedType));
        } else {
          setPoems(data);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [selectedType]);

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Welcome to Our Nepali literature Collection</h2>
          <p>{error}</p>
          <div className="auth-buttons">
            <button onClick={() => window.location.href = '/login'} className="login-button">Login</button>
            <button onClick={() => window.location.href = '/signup'} className="signup-button">Signup</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="poem-list">
      {Array.isArray(poems) ? poems.map((poem) => (
        <PoemCard
          key={poem.title}
          title={poem.title}
          content={poem.content}
          author={poem.author_id}
          contentType={poem.content_type}
        />
      )) : <div>No content available.</div>}
    </div>
  );
}
