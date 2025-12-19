import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, loginWithGoogle } = useAuth();
  const { settings } = useSettings();

  const isActive = (path) => location.pathname === path;

  const handleAdminClick = async (e) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (currentUser) {
      navigate('/admin');
    } else {
      // Trigger Google Sign-In popup
      const result = await loginWithGoogle();
      if (result.success) {
        navigate('/admin');
      } else {
        // Show error message (you could add a toast notification here)
        alert('Failed to sign in. Please try again.');
      }
    }
  };

  return (
    <nav className="navbar" style={{ backgroundColor: settings.primary_color }}>
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            {settings.site_name}
          </Link>
          
          <button 
            className="navbar-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
            <li>
              <Link 
                to="/" 
                className={isActive('/') ? 'active' : ''}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className={isActive('/about') ? 'active' : ''}
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                to="/programs" 
                className={isActive('/programs') ? 'active' : ''}
                onClick={() => setIsOpen(false)}
              >
                Programs & Housing
              </Link>
            </li>
            <li>
              <Link 
                to="/contact" 
                className={isActive('/contact') ? 'active' : ''}
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link 
                to="/sponsor" 
                className={isActive('/sponsor') ? 'active' : ''}
                onClick={() => setIsOpen(false)}
              >
                Sponsor
              </Link>
            </li>
            <li>
              <a 
                href="/admin"
                className={isActive('/admin') ? 'active' : ''}
                onClick={handleAdminClick}
              >
                Admin
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
