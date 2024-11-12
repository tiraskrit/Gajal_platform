// src/components/Logout.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove the token from local storage
    localStorage.removeItem('token');
    
    // Redirect to the login page or home page after logout
    navigate('/login'); // Change this to '/' if you want to go to home page
  }, [navigate]);

  return null; // This component doesn't render anything
};

export default Logout;
