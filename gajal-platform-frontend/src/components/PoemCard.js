import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PoemCard.css';

const typeColors = {
  Poem: '#4a90e2',
  Story: '#9b59b6',
  Gajal: '#2ecc71',
  Nibandha: '#e67e22',
  Other: '#95a5a6'
};

const PoemCard = ({ title, content, author, contentType }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const createPreview = (text) => {
    const lines = text.split('\n').slice(0, 4);
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
    // Don't expand if the click originated from the content-type-badge
    if (!e.target.closest('.content-type-badge')) {
      setIsExpanded(!isExpanded);
    }
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
      </div>
    </div>
  );
};

export default PoemCard;