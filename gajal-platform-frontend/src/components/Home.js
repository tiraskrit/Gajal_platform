import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Gajal Platform</h1>
      <p>Share your poems with the world, but first, log in or sign up!</p>

      {/* Buttons for Login and Sign Up */}
      <div style={{ marginTop: '20px' }}>
        <Link to="/login">
          <button style={{ marginRight: '10px' }}>Login</button>
        </Link>
        <Link to="/signUp">
          <button>Sign Up</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;