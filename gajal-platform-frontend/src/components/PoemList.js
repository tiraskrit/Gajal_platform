import React, { useEffect, useState } from 'react';
import PoemCard from './PoemCard';
import { useLocation } from 'react-router-dom';
import './AuthButtons.css';
import { API_URL } from '../api.js';

export default function PoemList() {
  const [poems, setPoems] = useState([]);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

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
        let sortedData = [...data];
        switch (sortBy) {
          case 'likes':
            sortedData.sort((a, b) => (b.likes || 0) - (a.likes || 0));
            break;
          case 'newest':
            sortedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
          case 'trending':
            // Calculate engagement ratio (likes per day)
            sortedData.sort((a, b) => {
              const aDays = (new Date() - new Date(a.created_at)) / (1000 * 60 * 60 * 24);
              const bDays = (new Date() - new Date(b.created_at)) / (1000 * 60 * 60 * 24);
              const aWeeks = aDays / 7; // Convert days to weeks
              const bWeeks = bDays / 7; // Convert days to weeks
              const aRatio = (a.likes || 0) / (aWeeks || 1);
              const bRatio = (b.likes || 0) / (bWeeks || 1);
              return bRatio - aRatio;
            });
            break;
          default:
            sortedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        }

        if (selectedType) {
          setPoems(sortedData.filter((poem) => poem.content_type === selectedType));
        } else {
          setPoems(sortedData);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [selectedType, sortBy]);

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
    <>
      <div className="sort-controls">
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="newest">Newest First</option>
          <option value="likes">Most Liked</option>
          <option value="trending">Trending</option>
        </select>
      </div>
      <div className="poem-list">
        {Array.isArray(poems) ? poems.map((poem) => (
          <PoemCard
            key={poem.id}
            title={poem.title}
            content={poem.content}
            author={poem.author}
            contentType={poem.content_type}
            id={poem.id}
            likes={poem.likes}
            liked_by={poem.liked_by || []}
            author_id={poem.author_id}
          />
        )) : <div>No content available.</div>}
      </div>
    </>
  );
}