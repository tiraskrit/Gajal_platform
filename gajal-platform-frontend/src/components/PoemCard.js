// PoemCard.js
import React from 'react';
import './PoemCard.css';

export default function PoemCard({ title, content, author }) {
    return (
        <div className="poem-card">
            <h3>{title}</h3>
            <p>{content}</p>
            <p className="poem-author">- {author}</p>
        </div>
    );
}
