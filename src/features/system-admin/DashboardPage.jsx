import React, { useState, useEffect } from 'react';
import './DashboardPage.css';
import { getActiveUsersApi, getActiveDriversApi, getActiveVehiclesApi } from '@/services/adminSystemStatisticService';

const statCards = [
  {
    id: 'total-users',
    label: 'Tổng số người dùng',
    value: '24,892',
    change: '',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    ),
  },
  {
    id: 'total-drivers',
    label: 'Tổng số tài xế',
    value: '24,892',
    change: '',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    ),
  },
  {
    id: 'total-vehicles',
    label: 'Tổng số phương tiện',
    value: '24,892',
    change: '',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    ),
  },
  {
    id: 'total-trips',
    label: 'Tổng số chuyến đi',
    value: '24,892',
    change: '',
    trend: 'up',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    ),
  },
  {
    id: 'total-revenue',
    label: 'Tổng doanh thu',
    value: '1.25B đ',
    change: '',
    trend: 'up',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
  },
  {
    id: 'total-transactions',
    label: 'Tổng giao dịch',
    value: '452',
    change: '',
    trend: 'live',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
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

  const [activeUsers, setActiveUsers] = useState('...');
  const [activeDrivers, setActiveDrivers] = useState('...');
  const [activeVehicles, setActiveVehicles] = useState('...');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, driversRes, vehiclesRes] = await Promise.all([
          getActiveUsersApi(),
          getActiveDriversApi(),
          getActiveVehiclesApi(),
        ]);
        if (usersRes?.code === 200) setActiveUsers(usersRes.data);
        if (driversRes?.code === 200) setActiveDrivers(driversRes.data);
        if (vehiclesRes?.code === 200) setActiveVehicles(vehiclesRes.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };
    fetchData();
  }, []);

  const displayStatCards = statCards.map(card => {
    if (card.id === 'total-users') return { ...card, value: activeUsers };
    if (card.id === 'total-drivers') return { ...card, value: activeDrivers };
    if (card.id === 'total-vehicles') return { ...card, value: activeVehicles };
    return card;
  });

  const entityStats = displayStatCards.slice(0, 3);
  const activityStats = displayStatCards.slice(3, 6);

  return (
    <div className="dashboard-page">
      {/* Period indicator */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Tổng quan hệ thống</h1>
        </div>
      </div>

      {/* ─── Entity Stats ─── */}
      <h2 className="section-title">Thống kê tài nguyên</h2>
      <div className="stat-cards-grid">
        {entityStats.map((card) => (
          <div key={card.id} className="stat-card" id={card.id}>
            <div className="stat-card-header">
              <span className="stat-card-label">{card.label}</span>
              <span className="stat-card-icon">{card.icon}</span>
            </div>
            <div className="stat-card-value">{card.value}</div>
            {(card.trend || card.change) && (
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
            )}
          </div>
        ))}
      </div>

      {/* ─── Activity Stats ─── */}
      <h2 className="section-title">Thống kê hoạt động</h2>
      <div className="stat-cards-grid">
        {activityStats.map((card) => (
          <div key={card.id} className="stat-card" id={card.id}>
            <div className="stat-card-header">
              <span className="stat-card-label">{card.label}</span>
              <span className="stat-card-icon">{card.icon}</span>
            </div>
            <div className="stat-card-value">{card.value}</div>
            {(card.trend || card.change) && (
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
            )}
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
    </div>
  );
};

export default DashboardPage;
