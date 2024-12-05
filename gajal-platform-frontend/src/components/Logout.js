import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Logout.css'; // Ensure to create a corresponding CSS file for styling

const Logout = ({ setIsAuthenticated, setIsAdmin }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from local and session storage
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');

    // Update the authentication and admin states
    setIsAuthenticated(false);
    setIsAdmin(false);

    // Redirect to the login page
    navigate('/login');
  };

  const handleCancel = () => {
    navigate(-1); // Navigates to the previous page
  };

  return (
    <div className="logout-container">
      <div className="logout-card">
        <h2 className="logout-title">Are you sure you want to logout?</h2>
        <div className="logout-buttons">
          <button onClick={handleLogout} className="logout-button">Logout</button>
          <button onClick={handleCancel} className="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Logout;