import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [pendingPoems, setPendingPoems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingPoems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:5000/api/admin/poems', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPendingPoems(response.data);
      } catch (err) {
        setError("Failed to fetch pending poems");
      }
    };
    fetchPendingPoems();
  }, []);

  const handleReview = async (poemId, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://127.0.0.1:5000/api/admin/poems/${poemId}`, { action }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingPoems((prev) => prev.filter((poem) => poem._id !== poemId));
    } catch (err) {
      setError("Failed to update poem status");
    }
  };

  return (
    <div>
      <h1>Admin Panel - Review Poems</h1>
      {error && <p>{error}</p>}
      <ul>
        {pendingPoems.map((poem) => (
          <li key={poem._id}>
            <p>{poem.content}</p>
            <button onClick={() => handleReview(poem._id, "approve")}>Approve</button>
            <button onClick={() => handleReview(poem._id, "reject")}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
