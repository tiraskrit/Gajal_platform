// PoemCard.js
import React from 'react';
import './PoemCard.css';

// Helper function to replace newlines with <br /> tags
const newlineToBreak = (text) => {
    return text.split('\n').map((item, index) => (
      <span key={index}>
        {item}
        <br />
      </span>
    ));
  };

export default function PoemCard({ title, content, author }) {
    return (
        <div className="poem-card">
            <h3>{title}</h3>
            <div className="poem-content">
                {newlineToBreak(content)}
            </div>
            <p className="poem-author">- {author}</p>
        </div>
    );
}
