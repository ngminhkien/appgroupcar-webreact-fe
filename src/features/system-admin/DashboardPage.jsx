import React from 'react';
import './DashboardPage.css';

const statCards = [
  {
    id: 'total-trips',
    label: 'Tổng số chuyến đi',
    value: '24,892',
    change: '+2.5%',
    trend: 'up',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    ),
  },
  {
    id: 'revenue',
    label: 'Tổng doanh thu',
    value: '1.25B đ',
    change: '+6.2%',
    trend: 'up',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
  },
  {
    id: 'active-shipments',
    label: 'Đang vận chuyển',
    value: '452',
    change: 'LIVE',
    trend: 'live',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
  {
    id: 'avg-rating',
    label: 'Đánh giá trung bình',
    value: '4.92',
    change: 'Excellent',
    trend: 'neutral',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
];

const chartBars = [
  { label: 'Thứ 2', value: 60 },
  { label: 'Thứ 3', value: 45 },
  { label: 'Thứ 4', value: 72 },
  { label: 'Thứ 5', value: 55 },
  { label: 'Thứ 6', value: 90 },
  { label: 'Thứ 7', value: 65 },
  { label: 'CN', value: 40 },
];

const serviceDistribution = [
  { label: 'Truck (Xe tải)', value: 58, color: 'var(--primary-container)' },
  { label: 'Bus (Xe khách)', value: 24, color: 'var(--secondary-container)' },
  { label: 'Carpool (Đi chung)', value: 18, color: 'var(--surface-container-highest)' },
];

const recentActivities = [
  {
    id: 1,
    icon: '📦',
    title: 'Đơn hàng #NR-9921 hoàn thành',
    detail: 'Lộ trình: TP.HCM - Đà Nẵng',
    time: '2 phút trước',
    type: 'success',
  },
  {
    id: 2,
    icon: '🚗',
    title: 'Tài xế mới đăng ký',
    detail: 'Hồ sơ: Nguyễn Văn A (Hạng E)',
    time: '15 phút trước',
    type: 'info',
  },
  {
    id: 3,
    icon: '⚠️',
    title: 'Cảnh báo chậm trễ',
    detail: 'Xe #TRK-882 gặp sự cố kĩ thuật',
    time: '45 phút trước',
    type: 'warning',
  },
];

const DashboardPage = () => {
  const maxBarValue = Math.max(...chartBars.map((b) => b.value));

  return (
    <div className="dashboard-page">
      {/* Period indicator */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Tổng quan hệ thống</h1>
          <p className="dashboard-period">Dựa trên 30 ngày gần nhất</p>
        </div>
      </div>

      {/* ─── Stat Cards ─── */}
      <div className="stat-cards-grid">
        {statCards.map((card) => (
          <div key={card.id} className="stat-card" id={card.id}>
            <div className="stat-card-header">
              <span className="stat-card-label">{card.label}</span>
              <span className="stat-card-icon">{card.icon}</span>
            </div>
            <div className="stat-card-value">{card.value}</div>
            <div className="stat-card-footer">
              <span className={`stat-card-change stat-card-change--${card.trend}`}>
                {card.trend === 'up' && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 15l-6-6-6 6"/>
                  </svg>
                )}
                {card.trend === 'live' && <span className="live-dot" />}
                {card.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Charts Row ─── */}
      <div className="charts-row">
        {/* Bar Chart */}
        <div className="chart-card chart-card--wide">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-title">Biểu đồ xu hướng chuyến đi</h3>
              <p className="chart-subtitle">Phân tích tần suất vận chuyển theo tuần</p>
            </div>
            <div className="chart-tabs">
              <button className="chart-tab">Tuần</button>
              <button className="chart-tab chart-tab--active">Tháng</button>
            </div>
          </div>
          <div className="bar-chart">
            {chartBars.map((bar) => (
              <div key={bar.label} className="bar-item">
                <div className="bar-wrapper">
                  <div
                    className="bar-fill"
                    style={{ height: `${(bar.value / maxBarValue) * 100}%` }}
                  >
                    {bar.value === maxBarValue && (
                      <span className="bar-tooltip">{bar.value}</span>
                    )}
                  </div>
                </div>
                <span className="bar-label">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Service distribution */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-title">Phân bổ dịch vụ</h3>
              <p className="chart-subtitle">Tỉ lệ loại hình vận chuyển</p>
            </div>
          </div>
          <div className="distribution-list">
            {serviceDistribution.map((item) => (
              <div key={item.label} className="distribution-item">
                <div className="distribution-info">
                  <span
                    className="distribution-dot"
                    style={{ background: item.color }}
                  />
                  <span className="distribution-label">{item.label}</span>
                </div>
                <span className="distribution-value">{item.value}%</span>
                <div className="distribution-bar-track">
                  <div
                    className="distribution-bar-fill"
                    style={{ width: `${item.value}%`, background: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="distribution-highlight">
            <span className="highlight-tag">Nhu cầu cao nhất</span>
            <div className="highlight-card">
              <span className="highlight-name">Trucking Logistics</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17l9.2-9.2M17 17V7.8H7.8"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Activity & Network ─── */}
      <div className="bottom-row">
        <div className="activity-card">
          <h3 className="chart-title">Hoạt động hệ thống gần đây</h3>
          <div className="activity-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className={`activity-item activity-item--${activity.type}`}>
                <span className="activity-icon">{activity.icon}</span>
                <div className="activity-content">
                  <span className="activity-title">{activity.title}</span>
                  <span className="activity-detail">{activity.detail}</span>
                </div>
                <span className="activity-time">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="network-card">
          <div className="network-visual">
            <div className="network-globe">
              <div className="globe-ring globe-ring--1" />
              <div className="globe-ring globe-ring--2" />
              <div className="globe-ring globe-ring--3" />
              <div className="globe-center" />
              <div className="globe-dot globe-dot--1" />
              <div className="globe-dot globe-dot--2" />
              <div className="globe-dot globe-dot--3" />
              <div className="globe-dot globe-dot--4" />
            </div>
            <span className="network-label">LIVE NETWORK VIEW</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
