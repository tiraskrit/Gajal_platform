import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Logout.css'; // Ensure to create a corresponding CSS file for styling

const Logout = ({ setIsAuthenticated, setIsAdmin }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from local storage
    localStorage.removeItem('token');

    // Update the authentication and admin states
    setIsAuthenticated(false);
    setIsAdmin(false);

    // Redirect to the login page
    navigate('/login');
  };

  return (
    <div className="logout-container">
      <div className="logout-card">
        <h2 className="logout-title">Are you sure you want to logout?</h2>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </div>
  );
};

export default Logout;