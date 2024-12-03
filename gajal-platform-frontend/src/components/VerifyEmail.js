// VerifyEmail.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../api.js';

const VerifyEmail = () => {
  const [status, setStatus] = useState('verifying');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.post(`${API_URL}/api/verify-email`, { token });
        setStatus('success');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setStatus('error');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
    }
  }, [token, navigate]);

  return (
    <div className="verify-email-container">
      <div className="verify-email-card">
        {status === 'verifying' && (
          <div>
            <h2>Verifying Your Email</h2>
            <p>Please wait while we verify your email address...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div>
            <h2>Email Verified!</h2>
            <p>Your email has been successfully verified. You will be redirected to the login page shortly.</p>
          </div>
        )}
        
        {status === 'error' && (
          <div>
            <h2>Verification Failed</h2>
            <p>We couldn't verify your email. The link may be invalid or expired.</p>
            <button onClick={() => navigate('/login')}>Go to Login</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;