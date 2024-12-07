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
import VerificationRequired from './components/VerificationRequired'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        setIsAuthenticated(true);
        setIsAdmin(decoded.role === 'admin');
        setIsVerified(decoded.is_verified === true);
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setIsVerified(false);
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
      <MainLayout 
        isAuthenticated={isAuthenticated} 
        isAdmin={isAdmin} 
        isVerified={isVerified} 
      />
      <Routes>
        <Route path="/" element={
          isAuthenticated && !isVerified ? 
            <VerificationRequired /> : 
            <PoemList />
        } />
        <Route path="login" element={
          <Login 
            setIsAuthenticated={setIsAuthenticated} 
            setIsAdmin={setIsAdmin}
            setIsVerified={setIsVerified}
          />
        } />
        <Route path="signup" element={<Signup />} />
        <Route path="submitpoem" element={
          !isAuthenticated ? <Navigate to="/login" /> :
          !isVerified ? <VerificationRequired /> :
          <SubmitPoem />
        } />
        <Route path="logout" element={
          <Logout 
            setIsAuthenticated={setIsAuthenticated} 
            setIsAdmin={setIsAdmin}
            setIsVerified={setIsVerified}
          />
        } />
        <Route path="admin" element={isAdmin ? <AdminPanel /> : <Navigate to="/" />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </Router>
  );
};

export default App;
