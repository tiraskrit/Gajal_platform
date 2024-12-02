import './PoemCard.css';

import React, { useState } from 'react';

const PoemCard = ({ title, content, author }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Helper function to create preview content
  const createPreview = (text) => {
    const lines = text.split('\n').slice(0, 4);
    return lines.join('\n') + (text.split('\n').length > 4 ? '...' : '');
  };

  return (
    <div 
      className={`poem-card ${isExpanded ? 'expanded' : ''}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="poem-inner">
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