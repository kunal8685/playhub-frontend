// Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-header">
          <h1>Welcome to PlayHub</h1>
          <p>Your ultimate destination to book turf for cricket, football, and more!</p>
        </div>
        
        <div className="features">
          <div className="feature-item">
            <div className="feature-icon">⚽</div>
            <h3>Premium Turfs</h3>
            <p>Book high-quality sports turfs across the city</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">🏆</div>
            <h3>Tournaments</h3>
            <p>Organize or join exciting sports tournaments</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">📅</div>
            <h3>Easy Booking</h3>
            <p>Simple and hassle-free online reservation system</p>
          </div>
        </div>
        
        <div className="cta-section">
          <Link to="/turf" className="book-btn">Book Now</Link>
          <Link to="/learn-more" className="learn-more-btn">Learn More</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;