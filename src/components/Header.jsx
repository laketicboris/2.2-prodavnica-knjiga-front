import React, { useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import UserContext from "../components/User/UserContext.jsx";
import LogoutButton from "./LogoutButton";

const Header = () => {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (error) {
        console.error('Invalid token');
      }
    }
  }, [setUser]);

  const linkClass = ({ isActive }) =>
    `nav-link ${isActive ? "active" : ""}`;

  return (
    <header className="header">
      <nav className="nav">
        <div className="logo">
          📚 Bookstore
        </div>
        
        <div className="nav-links">
          <NavLink to="/home" className={linkClass}>🏠 Home</NavLink>
          <NavLink to="/authors" className={linkClass}>✍️ Authors</NavLink>
          <NavLink to="/publishers" className={linkClass}>🏢 Publishers</NavLink>
          <NavLink to="/books" className={linkClass}>📖 Books</NavLink>
          
          {user && (
            <NavLink to="/create-book" className={linkClass}>➕ Create Book</NavLink>
          )}
        </div>
        
        <div className="nav-auth">
          {user ? (
            <>
              <div className="user-info">
                <span className="welcome-text">Welcome,</span>
                <span className="username">{user.username}</span>
                <span className="user-role">({user.role})</span>
              </div>
              <LogoutButton />
            </>
          ) : (
            <NavLink to="/" className={linkClass}>🔐 Login</NavLink>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;