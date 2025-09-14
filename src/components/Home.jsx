import React from "react";

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <h1 className="title">📚 Welcome to Bookstore</h1>
        <p className="subtitle">
          Your complete digital library management solution. Organize books, manage publishers, and discover your next great read!
        </p>
      </div>

      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">📖</div>
          <h3 className="feature-title">Browse Books</h3>
          <p className="feature-description">Explore our extensive collection of books with detailed information</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🏢</div>
          <h3 className="feature-title">Manage Publishers</h3>
          <p className="feature-description">Keep track of all publishing houses and their details</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">➕</div>
          <h3 className="feature-title">Add New Books</h3>
          <p className="feature-description">Easily add new books to your collection with our simple form</p>
        </div>
      </div>
    </div>
  );
};

export default Home;