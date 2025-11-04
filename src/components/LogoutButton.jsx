import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../components/User/UserContext.jsx';

const LogoutButton = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');

    setUser(null);

    navigate('/');
  };

  return <button className="btn-secondary" onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;