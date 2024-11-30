// PoemList.js
import React, { useEffect, useState } from 'react';
import PoemCard from './PoemCard';
// import './PoemList.css';
import './AuthButtons.css'; // Ensure to create this CSS file for styling the buttons
import { API_URL } from '../api.js';

export default function PoemList() {
    const [poems, setPoems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Assuming the token is stored in localStorage
        const token = localStorage.getItem('token');

        fetch(`${API_URL}/api/poems`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Please login or signup to see all the poems and submit your own');
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
        return (
            <div className="error-container">
                <div className="error-message">
                    <h2>Welcome to Our Poetry Collection</h2>
                    <p>{error}</p>
                    <div className="auth-buttons">
                        <button onClick={() => window.location.href = '/login'} className="login-button">Login</button>
                        <button onClick={() => window.location.href = '/signup'} className="signup-button">Signup</button>
                    </div>
                </div>
            </div>
        );
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
