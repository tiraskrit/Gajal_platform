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
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setIsAuthenticated(true);

      // Check if the user has the admin role
      if (decoded.role === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
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
      </Routes>
    </Router>
  );
};

export default App;
