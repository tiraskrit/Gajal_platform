import React from 'react';
import { Link, Outlet } from 'react-router-dom'; // Import Link for navigation and Outlet for nested routes
import './MainLayout.css'; // Import your CSS file for styling

const MainLayout = ({ isAuthenticated, isAdmin }) => {
  return (
    <div className="main-layout">
      <header className="header">
        <h1 className="app-title"><Link to="/" className="nav-link">Gajal App</Link></h1>
        <nav className="nav">
          <ul className="nav-list">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link to="/submitPoem" className="nav-link">Submit a Gajal</Link>
                </li>
                <li className="nav-item">
                  <Link to="/logout" className="nav-link">Logout</Link>
                </li>
                <li className="nav-item">
                {isAdmin && <Link to="/admin" className="nav-link">Admin Panel</Link>}
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/signup" className="nav-link">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <main className="content">
        <Outlet /> {/* Render nested routes here */}
      </main>
    </div>
  );
};

export default MainLayout;
