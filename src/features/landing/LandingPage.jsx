import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">

      {/* ─── Hero Section ─── */}
      <section className="hero-section">
        {/* Decorative background elements */}
        <div className="hero-bg-grid" />
        <div className="hero-glow hero-glow--1" />
        <div className="hero-glow hero-glow--2" />

        <div className="hero-inner">
          <div className="hero-content">
            <span className="hero-badge">
              <span className="badge-dot" />
              Nền tảng vận tải #1 Việt Nam
            </span>
            <h1 className="display-title">
              NexusRide: Giải pháp<br />
              <span className="display-title--accent">Vận tải Toàn diện</span>
            </h1>
            <p className="hero-subtitle">
              Kết nối mọi hành trình từ xe khách, đi chung xe đến vận tải xe tải chuyên nghiệp. Công nghệ hiện đại cho sự chuyển động không ngừng.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn-primary btn-lg">
                Bắt đầu ngay
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <a href="#services" className="btn-secondary btn-lg">Tìm hiểu thêm</a>
            </div>

            {/* Trust indicators */}
            <div className="hero-trust">
              <div className="trust-item">
                <span className="trust-number">50K+</span>
                <span className="trust-label">Người dùng</span>
              </div>
              <div className="trust-divider" />
              <div className="trust-item">
                <span className="trust-number">200+</span>
                <span className="trust-label">Đối tác</span>
              </div>
              <div className="trust-divider" />
              <div className="trust-item">
                <span className="trust-number">63</span>
                <span className="trust-label">Tỉnh thành</span>
              </div>
            </div>
          </div>

          {/* Hero visual — floating tracking card */}
          <div className="hero-visual">
            <div className="hero-visual-image">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80"
                alt="Logistics fleet"
                loading="eager"
              />
              <div className="hero-image-overlay" />
            </div>
            <div className="floating-card tracking-card">
              <div className="tracking-header">
                <span className="tracking-id">NR-99283-VX</span>
                <span className="status-chip in-transit">Đang vận chuyển</span>
              </div>
              <div className="tracking-route-info">
                <span className="route-text">Hà Nội → Đà Nẵng</span>
              </div>
              <div className="tracking-progress">
                <div className="progress-bar">
                  <div className="progress-fill" />
                </div>
                <div className="progress-labels">
                  <span>Đã lấy hàng</span>
                  <span>Đang vận chuyển</span>
                  <span>Giao hàng</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Services Section ─── */}
      <section className="services-section" id="services">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Dịch vụ của chúng tôi</span>
            <h2 className="section-title">Hệ sinh thái vận tải đa phương thức<br />đáp ứng mọi nhu cầu.</h2>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="3" width="20" height="14" rx="2"/>
                  <path d="M8 21h8M12 17v4"/>
                </svg>
              </div>
              <h3>Đặt vé xe khách</h3>
              <p>Kết nối hàng ngàn tuyến đường liên tỉnh với chất lượng dịch vụ chuẩn 5 sao và giá cả cạnh tranh.</p>
              <a href="#" className="service-link">
                Đặt vé ngay
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                </svg>
              </div>
              <h3>Đi chung xe</h3>
              <p>Tiết kiệm chi phí, giảm thiểu khí thải và kết nối cộng đồng thông qua nền tảng carpooling thông minh.</p>
              <a href="#" className="service-link">
                Tìm xe đi chung
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>

            <div className="service-card highlight-card">
              <div className="service-icon service-icon--highlight">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
              <h3>Vận tải xe tải</h3>
              <p>Giải pháp logistics doanh nghiệp toàn diện. Quản lý đội xe và hàng hóa thời gian thực với công nghệ AI.</p>
              <a href="#" className="service-link service-link--highlight">
                Liên hệ vận tải
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Why NexusRide Section ─── */}
      <section className="features-section" id="solutions">
        <div className="section-container">
          <div className="features-layout">
            <div className="features-content">
              <span className="section-tag">Lợi thế vượt trội</span>
              <h2 className="section-title">Tại sao chọn NexusRide?</h2>

              <div className="feature-list">
                <div className="feature-item">
                  <div className="feature-icon-wrapper">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Chính xác</h4>
                    <p>Hệ thống định vị GPS và thuật toán tối ưu lộ trình đảm bảo thời gian giao nhận chính xác đến từng phút.</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon-wrapper">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Tốc độ</h4>
                    <p>Xử lý yêu cầu tức thì, kết nối tài xế gần nhất giúp hành trình của bạn luôn được bắt đầu nhanh chóng.</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon-wrapper">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Minh bạch</h4>
                    <p>Cước phí công khai, lộ trình rõ ràng và hệ thống đánh giá tài xế minh bạch tạo nên sự tin tưởng tuyệt đối.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="features-visual">
              <div className="stat-big">
                <span className="stat-number">99.9%</span>
                <span className="stat-desc">Tỷ lệ hoàn thành chuyến hàng đúng hạn trên toàn hệ thống.</span>
              </div>
              <div className="feature-image-card">
                <img
                  src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&q=80"
                  alt="GPS Tracking"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trucking Two-Way Section ─── */}
      <section className="trucking-section" id="tracking">
        <div className="section-container">
          <div className="trucking-header">
            <span className="section-tag section-tag--light">Giải pháp logistics</span>
            <h2 className="section-title trucking-title">Vận tải Xe tải 2 Chiều</h2>
            <p className="section-subtitle">Tối ưu hóa năng suất và chi phí cho cả chủ hàng và đối tác vận chuyển.</p>
          </div>

          <div className="trucking-visual-wrapper">
            <div className="trucking-image">
              <img
                src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&q=80"
                alt="Cargo logistics"
                loading="lazy"
              />
            </div>
          </div>

          <div className="trucking-grid">
            <div className="truck-side">
              <h3>Bạn cần gửi hàng?</h3>
              <ul>
                <li>
                  <span className="check-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="var(--secondary-container)"/><path d="M9 12l2 2 4-4" stroke="var(--on-secondary-container)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  Đặt xe linh hoạt từ 1.5 tấn đến 30 tấn
                </li>
                <li>
                  <span className="check-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="var(--secondary-container)"/><path d="M9 12l2 2 4-4" stroke="var(--on-secondary-container)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  Bảo hiểm hàng hóa 100% giá trị
                </li>
                <li>
                  <span className="check-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="var(--secondary-container)"/><path d="M9 12l2 2 4-4" stroke="var(--on-secondary-container)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  Theo dõi Real-time trên ứng dụng
                </li>
              </ul>
            </div>

            <div className="truck-side">
              <h3>Bạn có xe nhàn rỗi?</h3>
              <ul>
                <li>
                  <span className="check-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="var(--secondary-container)"/><path d="M9 12l2 2 4-4" stroke="var(--on-secondary-container)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  Tìm nguồn hàng ổn định 24/7
                </li>
                <li>
                  <span className="check-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="var(--secondary-container)"/><path d="M9 12l2 2 4-4" stroke="var(--on-secondary-container)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  Giảm thiểu xe chạy rỗng chiều về
                </li>
                <li>
                  <span className="check-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="var(--secondary-container)"/><path d="M9 12l2 2 4-4" stroke="var(--on-secondary-container)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  Thanh toán nhanh chóng, minh bạch
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA / Download Section ─── */}
      <section className="cta-section" id="contact">
        <div className="section-container">
          <div className="cta-content">
            <h2 className="cta-title">Sẵn sàng để bắt đầu hành trình?</h2>
            <p className="cta-subtitle">Tải ứng dụng NexusRide ngay hôm nay để trải nghiệm dịch vụ vận tải hàng đầu Việt Nam.</p>
            <div className="cta-buttons">
              <a href="#" className="store-badge" aria-label="Download on App Store">
                <div className="store-badge-content">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div>
                    <span className="store-label">Download on the</span>
                    <span className="store-name">App Store</span>
                  </div>
                </div>
              </a>
              <a href="#" className="store-badge" aria-label="Get it on Google Play">
                <div className="store-badge-content">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.18 23.79c.35.36.85.55 1.4.44l13.07-7.57-3.36-3.37L3.18 23.79zM.56 1.1c-.36.54-.56 1.2-.56 1.95v17.9c0 .75.2 1.41.56 1.95l9.79-9.79L.56 1.1zm20.85 9.67L17.8 8.56l-3.59 3.59 3.59 3.59 3.61-2.09c.68-.39 1.03-.89 1.03-1.49s-.35-1.09-1.03-1.49zM4.58.24C4.13.13 3.63.26 3.28.62l10.51 10.51 3.36-3.37L4.58.24z"/>
                  </svg>
                  <div>
                    <span className="store-label">Get it on</span>
                    <span className="store-name">Google Play</span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
        {/* Decorative */}
        <div className="cta-orb cta-orb--1" />
        <div className="cta-orb cta-orb--2" />
      </section>
    </div>
  );
};

export default LandingPage;
