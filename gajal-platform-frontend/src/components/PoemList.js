// PoemList.js
import React, { useEffect, useState } from 'react';
import PoemCard from './PoemCard'; // Assuming PoemCard displays the title and author
import PoemDisplay from './PoemDisplay'; // Import PoemDisplay to handle newline conversion
import './AuthButtons.css'; // Ensure to create this CSS file for styling the buttons

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
                <div key={poem._id} className="poem-card">
                    <PoemCard
                        title={poem.title}
                        author={poem.author_id}
                    />
                    {/* Use PoemDisplay to render the content with newlines */}
                    <PoemDisplay poemContent={poem.content} />
                </div>
            )) : <div>No poems available.</div>}
        </div>
    );
}
