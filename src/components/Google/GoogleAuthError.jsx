import React from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleAuthError = () => {
  const navigate = useNavigate();

  return (
    <div className="form-container">
      <div className="form-card">
        <h2 className="form-title">❌ Google Authentication Failed</h2>
        <div className="message error">
          <p>We were unable to authenticate you with Google. This could happen for several reasons:</p>
          <ul>
            <li>You cancelled the Google authentication process</li>
            <li>There was a temporary issue with Google's services</li>
            <li>Your Google account doesn't have the required permissions</li>
          </ul>
        </div>
        
        <div className="form-buttons">
          <button 
            className="btn-primary"
            onClick={() => navigate('/')}
          >
            Try Again
          </button>
          <button 
            className="btn-secondary"
            onClick={() => navigate('/books')}
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthError;