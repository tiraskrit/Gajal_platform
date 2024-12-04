import React from 'react';
import { MailCheck } from 'lucide-react';
import './VerificationRequired.css';

const VerificationRequired = () => {
  return (
    <div className="verification-container">
      <div className="verification-card">
        <div className="icon-container">
          <MailCheck className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="title">
          Email Verification Required
        </h2>
        <p className="message">
          Please verify your email address to access this content.
        </p>
        <p className="message">
          Check your inbox for the verification link we sent you.
        </p>
        <p className="spam-notice">
          If you haven't received the email, please check your spam folder.
        </p>
      </div>
    </div>
  );
};

export default VerificationRequired;