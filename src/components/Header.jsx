import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  const linkClass = ({ isActive }) =>
    `nav-link ${isActive ? "active" : ""}`;

  return (
    <header className="header">
      <nav className="nav">
        <div className="logo">
          📚 Bookstore
        </div>
        <NavLink to="/" className={linkClass}>🏠 Home</NavLink>
        <NavLink to="/publishers" className={linkClass}>🏢 Publishers</NavLink>
        <NavLink to="/books" className={linkClass}>📖 Books</NavLink>
        <NavLink to="/create-book" className={linkClass}>➕ Create Book</NavLink>
      </nav>
    </header>
  );
};

export default Header;