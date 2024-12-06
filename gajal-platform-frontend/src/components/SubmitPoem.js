import React, { useState } from 'react';
import axios from 'axios';
import './SubmitPoem.css';
import { API_URL } from '../api.js';

const SubmitPoem = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState('Poem');
  const [message, setMessage] = useState('');

  const contentTypes = ['Poem', 'Story', 'Gajal', 'Nibandha', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/submitPoem`,
        { 
          title,
          content,
          content_type: contentType,
          author_id: localStorage.getItem('user_email'),
          status: "pending"
        },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setMessage('Content submitted successfully. Awaiting approval.');
      setTitle('');
      setContent('');
      setContentType('Poem');
    } catch (error) {
      setMessage('Failed to submit content.');
    }
  };

  return (
    <div className="poem-container">
      <h2 className="title">Submit Content</h2>
      <form className="poem-form" onSubmit={handleSubmit}>
        <label className="label" htmlFor="type">Type:</label>
        <select
          id="type"
          className="input-field"
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
          required
        >
          {contentTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <label className="label" htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          className="input-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter the title"
        />

        <label className="label" htmlFor="content">Content:</label>
        <textarea
          id="content"
          className="textarea-field"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          placeholder="Write your content here..."
        ></textarea>

        <button type="submit" className="submit-button">Submit</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default SubmitPoem;