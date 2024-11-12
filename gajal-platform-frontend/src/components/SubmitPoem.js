// src/components/SubmitPoem.js
import React, { useState } from 'react';
import axios from 'axios';

const SubmitPoem = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://127.0.0.1:5000/api/submitPoem',
        { 
          title,         // Title of the poem
          content,       // Content of the poem
          author_id: localStorage.getItem('user_email'), // Author's email stored in local storage
          status: "pending" // Status set to pending by default
        },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(response.data);
      setMessage('Poem submitted successfully. Awaiting approval.');
      setTitle('');
      setContent('');
    } catch (error) {
      console.error(error.response);  // This will log the error message from the backend
      setMessage('Failed to submit poem.');
    }
  };
  

  return (
    <div>
      <h2>Submit a Gajal</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label>Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <button type="submit">Submit Poem</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SubmitPoem;
