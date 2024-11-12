import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import MainLayout from './components/MainLayout';
import Login from './components/Login';
import Signup from './components/SignUp';
import PoemList from './components/PoemList';
import SubmitPoem from './components/SubmitPoem';
import Logout from './components/Logout';
import AdminPanel from './components/AdminPanel';
import Home from './components/Home';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if a valid token exists and decode it
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);  
        
        // Token validity check
        if (decoded.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          
          // Check if the user has an admin role
          setIsAdmin(decoded.role === 'admin');
        } else {
          // Token expired, remove it
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout isAuthenticated={isAuthenticated} isAdmin={isAdmin} />}>
          <Route index element={<Home />} />
          <Route path="login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} />
          <Route path="logout" element={<Logout />} />
          <Route path="poems" element={<PoemList />} />
          <Route path="submitPoem" element={isAuthenticated ? <SubmitPoem /> : <Navigate to="/login" />} />
          <Route path="admin-panel" element={isAdmin ? <AdminPanel /> : <Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
