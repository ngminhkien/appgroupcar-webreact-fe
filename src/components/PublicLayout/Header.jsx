import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`glass-nav ${scrolled ? 'glass-nav--scrolled' : ''}`}>
      <div className="nav-content">
        <Link to="/" className="brand-logo">NexusRide</Link>
        <div className="nav-links">
          <a href="#services">Dịch vụ</a>
          <a href="#solutions">Giải pháp</a>
          <a href="#tracking">Vận tải</a>
          <a href="#contact">Liên hệ</a>
        </div>
        <div className="nav-actions">
          <Link to="/login" className="nav-login-link">Đăng nhập</Link>
          <Link to="/register" className="btn-nav-primary">Đăng ký</Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
