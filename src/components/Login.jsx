import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../components/User/UserContext.jsx';
import AxiosConfig from '../config/axios.config.js';

const Login = () => {
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);     
        navigate("/books"); 
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
      }
    }
  }, [setUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await AxiosConfig.post('/api/Auth/login', {
        username,
        password
      });

      const token = response.data.token;
      localStorage.setItem('token', token);
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
      navigate('/books');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleLogin} className="form-card">
        <h2 className="form-title">🔐 Login</h2>
        {error && <div className="message error">{error}</div>}
        
        <div className="form-group">
          <input 
            className="form-input"
            type="text" 
            placeholder="Username"
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required
          />
        </div>
        
        <div className="form-group">
          <input 
            className="form-input"
            type="password" 
            placeholder="Password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
        </div>
        
        <div className="form-buttons">
          <button className="btn-primary" type="submit">Login</button>
          <button 
            className="btn-secondary" 
            type="button"
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </div>
        
        <div className="test-users">
          <h4>Test users:</h4>
          <p><strong>Editor:</strong> john/ John123!</p>
        </div>
      </form>
    </div>
  );
};

export default Login;