// Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">Play</span>
          <span className="logo-text-bold">Hub</span>
        </Link>

        <div className="navbar-right">
          <div
            className={`navbar-menu-toggle ${menuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className={`navbar-collapse ${menuOpen ? 'active' : ''}`}>
            <ul className="navbar-links">
              <li><Link to="/" className="nav-link">Home</Link></li>
              <li><Link to="/turf" className="nav-link">Turf</Link></li>
              <li><Link to="/about" className="nav-link">About Us</Link></li>
              <li><Link to="/contact" className="nav-link">Contact Us</Link></li>
              
            </ul>
            <div className="navbar-auth">
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/register" className="register-btn">Register</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;