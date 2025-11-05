import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from './UserContext.jsx';
import AxiosConfig from '../../config/axios.config.js';

const Register = () => {
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    name: '',
    surname: '',
    dateOfBirth: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await AxiosConfig.post('/api/Auth/register', formData);
      setSuccess('Registration successful! You can now log in.');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError('Registration failed. Please check your details.');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleRegister} className="form-card">
        <h2 className="form-title">📝 Register</h2>
        
        {error && <div className="message error">{error}</div>}
        {success && <div className="message success">{success}</div>}
        
        <div className="form-group">
          <input 
            className="form-input"
            type="email" 
            name="email"
            placeholder="Email"
            value={formData.email} 
            onChange={handleChange} 
            required
          />
        </div>
        
        <div className="form-group">
          <input 
            className="form-input"
            type="text" 
            name="username"
            placeholder="Username"
            value={formData.username} 
            onChange={handleChange} 
            required
          />
        </div>
        
        <div className="form-group">
          <input 
            className="form-input"
            type="password" 
            name="password"
            placeholder="Password"
            value={formData.password} 
            onChange={handleChange} 
            required
          />
        </div>
        
        <div className="form-group">
          <input 
            className="form-input"
            type="text" 
            name="name"
            placeholder="First Name"
            value={formData.name} 
            onChange={handleChange} 
            required
          />
        </div>
        
        <div className="form-group">
          <input 
            className="form-input"
            type="text" 
            name="surname"
            placeholder="Last Name"
            value={formData.surname} 
            onChange={handleChange} 
            required
          />
        </div>
        
        <div className="form-group">
          <input 
            className="form-input"
            type="date" 
            name="dateOfBirth"
            placeholder="Date of Birth"
            value={formData.dateOfBirth} 
            onChange={handleChange} 
            required
          />
        </div>
        
        <div className="form-buttons">
          <button className="btn-primary" type="submit">Register</button>
          <button 
            className="btn-secondary" 
            type="button"
            onClick={() => navigate('/')}
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;