// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
    return (
        <div className="sidebar">
            <h2 className="sidebar-title">Gajal Platform</h2>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/submitPoem">Submit Gajal</Link></li>
                </ul>
            </nav>
        </div>
    );
}
