import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = ({ isAuthenticated, isAdmin, isVerified }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({
    content: false,
    profile: false
  });
  const menuRef = useRef(null);
  const contentTypes = isVerified ? ['Poem', 'Story', 'Gajal', 'Nibandha', 'Other'] : [];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
        setExpandedItems({ content: false, profile: false });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle link click to close menu and reset expansions
  const handleLinkClick = () => {
    setMenuOpen(false);
    setExpandedItems({ content: false, profile: false });
  };

  // Toggle dropdown items in mobile view
  const toggleDropdown = (item) => {
    setExpandedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  return (
    <div className="main-layout">
      <header className="header">
        <h1 className="app-title">
          <Link to="/" className="nav-link" onClick={handleLinkClick}>Sahitya App</Link>
        </h1>
        <nav className="nav">
          <ul className="nav-list">
            {isVerified && (
              <li className="nav-item dropdown">
                <span className="nav-link">Content</span>
                <div className="dropdown-content">
                  {contentTypes.map((type) => (
                    <Link to={`/?type=${type}`} className="nav-link" key={type} onClick={handleLinkClick}>{type}</Link>
                  ))}
                </div>
              </li>
            )}
            {isAuthenticated ? (
              <li className="nav-item my-profile">
                <span className="nav-link">My Profile</span>
                <div className="my-profile-content">
                  {isVerified && (
                    <Link to="/submitPoem" className="nav-link" onClick={handleLinkClick}>Submit a Content</Link>
                  )}
                  <Link to="/logout" className="nav-link" onClick={handleLinkClick}>Logout</Link>
                  {isAdmin && (
                    <Link to="/admin" className="nav-link" onClick={handleLinkClick}>Admin Panel</Link>
                  )}
                </div>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link" onClick={handleLinkClick}>Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/signup" className="nav-link" onClick={handleLinkClick}>Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
        <button
          className="hamburger-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        {menuOpen && (
          <div className="mobile-menu" ref={menuRef}>
            <ul className="nav-list">
              {isVerified && (
                <li className={`nav-item dropdown ${expandedItems.content ? 'expanded' : ''}`}>
                  <span className="nav-link" onClick={() => toggleDropdown('content')}>Content</span>
                  <div className="dropdown-content">
                    {contentTypes.map((type) => (
                      <Link to={`/?type=${type}`} className="nav-link" key={type} onClick={handleLinkClick}>{type}</Link>
                    ))}
                  </div>
                </li>
              )}
              {isAuthenticated ? (
                <li className={`nav-item my-profile ${expandedItems.profile ? 'expanded' : ''}`}>
                  <span className="nav-link" onClick={() => toggleDropdown('profile')}>My Profile</span>
                  <div className="my-profile-content">
                    {isVerified && (
                      <Link to="/submitPoem" className="nav-link" onClick={handleLinkClick}>Submit a Content</Link>
                    )}
                    <Link to="/logout" className="nav-link" onClick={handleLinkClick}>Logout</Link>
                    {isAdmin && (
                      <Link to="/admin" className="nav-link" onClick={handleLinkClick}>Admin Panel</Link>
                    )}
                  </div>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link" onClick={handleLinkClick}>Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/signup" className="nav-link" onClick={handleLinkClick}>Sign Up</Link>
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