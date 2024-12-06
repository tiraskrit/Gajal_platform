// src/components/Poems.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../api.js';

const Poems = () => {
  const [poems, setPoems] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPoems = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/poems`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPoems(response.data);
      } catch (error) {
        setError('Failed to fetch poems.');
      }
    };

    fetchPoems();
  }, []);

  const handleSubmitPoemClick = () => {
    navigate('/submitPoem'); // Navigate to the Submit Poem page
  };

  return (
    <div>
      <h2>Approved Poems</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleSubmitPoemClick}>Submit a Content</button>
      <ul>
        {poems.map((poem, index) => (
          <li key={index}>
            <h3>{poem.title}</h3>
            <p>{poem.content}</p>
            <p><strong>Author:</strong> {poem.author_id}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Poems;
