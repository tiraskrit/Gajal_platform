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
import ResetPassword from './components/ResetPassword';
import VerifyEmail from './components/VerifyEmail';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        setIsAuthenticated(true);
        setIsAdmin(decoded.role === 'admin');
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    };

    checkAuthStatus();
    window.addEventListener('storage', checkAuthStatus); // Listen for changes in local storage

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);


  return (
    <Router>
      <MainLayout isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
      <Routes>
        <Route path="/" element={<PoemList />} />
        <Route path="login" element={<Login setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin} />} />
        <Route path="signup" element={<Signup />} />
        <Route path="submitpoem" element={isAuthenticated ? <SubmitPoem /> : <Navigate to="/login" />} />
        <Route path="logout" element={<Logout setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin} />} />
        <Route path="admin" element={isAdmin ? <AdminPanel /> : <Navigate to="/" />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </Router>
  );
};

export default App;
