import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>NexusRide</h2>
          <p>© 2024 NexusRide Logistics. Kinetic Horizon Powered.</p>
          <p>Tải ứng dụng NexusRide ngay hôm nay để trải nghiệm dịch vụ vận tải hàng đầu Việt Nam.</p>
        </div>
        <div className="footer-links-group">
          <div className="footer-links">
            <h4>Sản phẩm</h4>
            <a href="#">Đặt vé xe khách</a>
            <a href="#">Đi chung xe</a>
            <a href="#">Vận tải xe tải</a>
            <a href="#">Dành cho doanh nghiệp</a>
          </div>
          <div className="footer-links">
            <h4>Công ty</h4>
            <a href="#">Về chúng tôi</a>
            <a href="#">Tuyển dụng</a>
            <a href="#">Phát triển bền vững</a>
            <a href="#">Liên hệ</a>
          </div>
          <div className="footer-links">
            <h4>Pháp lý</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Global Network</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <span>Designed with precision. Built for motion.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
