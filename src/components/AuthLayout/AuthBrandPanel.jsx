import React from 'react';
import './AuthBrandPanel.css';

/**
 * AuthBrandPanel — The left branding panel reused across Login & Register.
 * Features the NexusRide brand, tagline, and decorative animations
 * on a deep primary-container background.
 */
const AuthBrandPanel = ({ headline, subtitle }) => {
  return (
    <div className="auth-brand-panel">
      {/* Decorative floating orbs */}
      <div className="brand-orb brand-orb--1" />
      <div className="brand-orb brand-orb--2" />
      <div className="brand-orb brand-orb--3" />

      <div className="brand-panel-content">
        <div className="brand-panel-logo">NexusRide</div>
        <h1 className="brand-panel-headline">{headline}</h1>
        <p className="brand-panel-subtitle">{subtitle}</p>

        {/* Floating stat cards — gives depth & motion */}
        <div className="brand-stat-cards">
          <div className="brand-stat-card">
            <span className="brand-stat-number">99.9%</span>
            <span className="brand-stat-label">Tỷ lệ hoàn thành</span>
          </div>
          <div className="brand-stat-card">
            <span className="brand-stat-number">24/7</span>
            <span className="brand-stat-label">Hỗ trợ liên tục</span>
          </div>
        </div>
      </div>

      <div className="brand-panel-footer">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Contact Us</a>
      </div>
    </div>
  );
};

export default AuthBrandPanel;
