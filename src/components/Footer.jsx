import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h4>📚 Bookstore</h4>
            <p>Your digital library management solution</p>
          </div>

          <div className="footer-nav">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/publishers">Publishers</Link></li>
              <li><Link to="/books">Books</Link></li>
              <li><Link to="/create-book">Add Book</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Bookstore Management. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;