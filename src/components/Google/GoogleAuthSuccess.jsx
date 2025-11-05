import React, { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import UserContext from '../User/UserContext.jsx';

const GoogleAuthSuccess = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      try {
        localStorage.setItem('token', token);
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
        navigate('/books');
      } catch (error) {
        console.error('Error processing Google auth token:', error);
        navigate('/auth/google-error');
      }
    } else {
      console.error('No token received from Google auth');
      navigate('/auth/google-error');
    }
  }, [searchParams, setUser, navigate]);

  return (
    <div className="form-container">
      <div className="form-card">
        <h2 className="form-title">🔄 Processing Google Authentication...</h2>
        <div className="loading">
          <p>Please wait while we log you in...</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthSuccess;