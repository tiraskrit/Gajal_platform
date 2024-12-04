import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css'; // Importing custom CSS for styling
import { API_URL } from '../api';

const AdminPanel = () => {
  const [pendingPoems, setPendingPoems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingPoems = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/admin/poems`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPendingPoems(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch pending poems");
        setLoading(false);
      }
    };
    fetchPendingPoems();
  }, []);

  const handleReview = async (poemId, action) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.patch(`${API_URL}/api/admin/poems/${poemId}`, { action }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingPoems((prev) => prev.filter((poem) => poem._id !== poemId));
    } catch (err) {
      setError("Failed to update poem status");
    }
  };

  return (
    <div className="admin-panel">
      <h2 className="title">Pending Poem Approvals</h2>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : pendingPoems.length > 0 ? (
        <div className="poem-list">
          {pendingPoems.map((poem) => (
            <div key={poem._id} className="poem-card">
              <h3 className="poem-title">{poem.title}</h3>
              <p className="poem-content">{poem.content}</p>
              <div className="action-buttons">
                <button
                  className="approve-btn"
                  onClick={() => handleReview(poem._id, 'approve')}
                >
                  Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleReview(poem._id, 'reject')}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className='text-no-pending'>Hurra! No pending poems at the moment.</p>
      )}
    </div>
  );
};

export default AdminPanel;
