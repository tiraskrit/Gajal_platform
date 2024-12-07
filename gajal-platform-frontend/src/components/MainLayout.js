import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = ({ isAuthenticated, isAdmin, isVerified }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const contentTypes = isVerified ? ['Poem', 'Story', 'Gajal', 'Nibandha', 'Other'] : [];

  console.log("isVerified in MainLayout:", isVerified); // Debug log

  return (
    <div className="main-layout">
      <header className="header">
        <h1 className="app-title">
          <Link to="/" className="nav-link">Sahitya App</Link>
        </h1>
        <nav className="nav">
          <ul className="nav-list">
            {contentTypes.map((type) => (
              <li className="nav-item" key={type}>
                <Link to={`/?type=${type}`} className="nav-link">{type}</Link>
              </li>
            ))}
            {isAuthenticated ? (
              <>
                {isVerified && (
                  <li className="nav-item">
                    <Link to="/submitPoem" className="nav-link">Submit a Content</Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link to="/logout" className="nav-link">Logout</Link>
                </li>
                {isAdmin && (
                  <li className="nav-item">
                    <Link to="/admin" className="nav-link">Admin Panel</Link>
                  </li>
                )}
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
        <button
          className="hamburger-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        {menuOpen && (
          <div className="mobile-menu">
            <ul className="nav-list">
              {contentTypes.map((type) => (
                <li className="nav-item" key={type}>
                  <Link to={`/?type=${type}`} className="nav-link">{type}</Link>
                </li>
              ))}
              {isAuthenticated ? (
                <>
                  {isVerified && (
                    <li className="nav-item">
                      <Link to="/submitPoem" className="nav-link">Submit a Content</Link>
                    </li>
                  )}
                  <li className="nav-item">
                    <Link to="/logout" className="nav-link">Logout</Link>
                  </li>
                  {isAdmin && (
                    <li className="nav-item">
                      <Link to="/admin" className="nav-link">Admin Panel</Link>
                    </li>
                  )}
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
          </div>
        )}
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
