// PoemList.js
import React, { useEffect, useState } from 'react';
import PoemCard from './PoemCard';
import './PoemList.css';

export default function PoemList() {
    const [poems, setPoems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Assuming the token is stored in localStorage
        const token = localStorage.getItem('token');

        fetch('http://127.0.0.1:5000/api/poems', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Unauthorized or no data available');
                }
                return response.json();
            })
            .then((data) => {
                setPoems(data);
            })
            .catch((err) => {
                setError(err.message);
            });
    }, []);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="poem-list">
            {Array.isArray(poems) ? poems.map((poem) => (
                <PoemCard
                    key={poem.title}
                    title={poem.title}
                    content={poem.content}
                    author={poem.author_id}
                />
            )) : <div>No poems available.</div>}
        </div>
    );
}
