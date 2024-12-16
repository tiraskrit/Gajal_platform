import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PoemCard.css';
import { API_URL } from '../api.js';
import { jwtDecode } from 'jwt-decode';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const typeColors = {
  Poem: '#4a90e2',
  Story: '#9b59b6',
  Gajal: '#2ecc71',
  Nibandha: '#e67e22',
  Other: '#95a5a6'
};

const PoemCard = ({ title, content, author, contentType, id, likes, liked_by, author_id }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [isAuthor, setIsAuthor] = useState(false);

  // Get the current user's email (or unique identifier) from the JWT token
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const currentUserEmail = token ? jwtDecode(token).sub : null;

  // Check if the current user is the author of the poem
  useEffect(() => {
    if (currentUserEmail && currentUserEmail === author_id) {
      setIsAuthor(true);
    }
  }, [currentUserEmail, author_id]);

  // Check if the current user has liked the poem when the component mounts
  useEffect(() => {
    if (currentUserEmail && liked_by.includes(currentUserEmail)) {
      setIsLiked(true);
    }
  }, [currentUserEmail, liked_by]);

  const createPreview = (text) => {
    const lines = text.split('\n').slice(0, 5);
    let wordCount = 0;
    let previewText = '';

    for (let line of lines) {
      const words = line.split(/\s+/);
      for (let word of words) {
        if (wordCount >= 25) {
          break;
        }
        if (previewText) {
          previewText += ' ';
        }
        previewText += word;
        wordCount++;
      }
      if (wordCount >= 25) {
        break;
      }
      previewText += '\n';
    }

    const ellipsis = text.split(/\s+/).length > 25 ? '...' : '';
    return previewText.trim() + ellipsis;
  };

  const handleClick = (e) => {
    if (!e.target.closest('.content-type-badge') && !e.target.closest('.like-button') && !e.target.closest('.delete-button')) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleLike = () => {
    if (!token) {
      alert('You need to log in to like this poem.');
      return;
    }

    fetch(`${API_URL}/api/poems/${id}/like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Poem liked') {
          setIsLiked(true);
          setCurrentLikes(currentLikes + 1); // Update likes count
          liked_by.push(currentUserEmail); // Update liked_by array locally
        } else if (data.message === 'Poem unliked') {
          setIsLiked(false);
          setCurrentLikes(currentLikes - 1); // Update likes count
          const index = liked_by.indexOf(currentUserEmail);
          if (index > -1) {
            liked_by.splice(index, 1); // Update liked_by array locally
          }
        }
      })
      .catch((err) => {
        console.error('Error liking poem:', err);
      });
  };

  const handleDelete = () => {
    if (!token) {
      alert('You need to log in to delete this poem.');
      return;
    }

    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this poem?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            fetch(`${API_URL}/api/poems/${id}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.message === 'Poem deleted successfully') {
                  alert('Poem deleted successfully');
                  window.location.reload(); // Reload the page to reflect the deletion
                } else {
                  alert('Failed to delete poem');
                }
              })
              .catch((err) => {
                console.error('Error deleting poem:', err);
              });
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  return (
    <div
      className={`poem-card ${isExpanded ? 'expanded' : ''}`}
      onClick={handleClick}
    >
      <div className="poem-inner">
        <span
          className="content-type-badge"
          style={{ backgroundColor: typeColors[contentType] }}
        >
          <Link to={`/?type=${contentType}`} className="nav-link">{contentType}</Link>
        </span>
        <h3 className="poem-title">{title}</h3>
        <div className="poem-content">
          {isExpanded ? (
            content.split('\n').map((line, idx) => (
              <span key={idx}>
                {line}
                <br />
              </span>
            ))
          ) : (
            createPreview(content).split('\n').map((line, idx) => (
              <span key={idx}>
                {line}
                <br />
              </span>
            ))
          )}
        </div>
        <p className="poem-author">- {author}</p>
        <div className="like-container">
          <button
            className={`like-button ${isLiked ? 'liked' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
          >
            <span role="img" aria-label="like">👍</span> {currentLikes}
          </button>
          {isAuthor && (
            <button
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              <span role="img" aria-label="delete">🗑️</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoemCard;