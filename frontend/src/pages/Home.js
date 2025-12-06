import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1>Delicious Food<br />Delivered Fast</h1>
          <p>Experience the finest meals crafted with premium ingredients and delivered straight to your door. Your next favorite dish is just a click away.</p>
          <div className="hero-actions">
            <Link to="/menu" className="btn-primary">Browse Menu</Link>
            <Link to="/register" className="btn-secondary">Get Started</Link>
          </div>
        </div>
      </div>
      
      <div className="features">
        <div className="feature">
          <div className="feature-icon">🍕</div>
          <h3>Fresh Food</h3>
          <p>Made with the finest ingredients</p>
        </div>
        <div className="feature">
          <div className="feature-icon">🚀</div>
          <h3>Fast Delivery</h3>
          <p>Quick and reliable service</p>
        </div>
        <div className="feature">
          <div className="feature-icon">💳</div>
          <h3>Easy Payment</h3>
          <p>Secure checkout process</p>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to order?</h2>
        <p>Join thousands of satisfied customers enjoying delicious meals every day</p>
        <Link to="/menu" className="btn-primary">View Our Menu</Link>
      </div>
    </div>
  );
};

export default Home;
