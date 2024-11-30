import React, { useState } from 'react';
import axios from 'axios';
import './SubmitPoem.css';
import { API_URL } from '../api.js';

const SubmitPoem = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/submitPoem`,
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
      console.error(error.response);
      setMessage('Failed to submit poem.');
    }
  };

  return (
    <div className="poem-container">
      <h2 className="title">Submit a Gajal</h2>
      <form className="poem-form" onSubmit={handleSubmit}>
        <label className="label" htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          className="input-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter the title of your gajal"
        />

        <label className="label" htmlFor="content">Content:</label>
        <textarea
          id="content"
          className="textarea-field"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          placeholder="Write your gajal here..."
        ></textarea>

        <button type="submit" className="submit-button">Submit Gajal</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default SubmitPoem;
