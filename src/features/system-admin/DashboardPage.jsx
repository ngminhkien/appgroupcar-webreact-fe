import React, { useState, useEffect } from 'react';
import './DashboardPage.css';
import { getActiveUsersApi, getActiveDriversApi, getActiveVehiclesApi, getSuccessfulOffersApi, getSuccessfulOrdersApi, getTotalRevenueApi } from '@/services/adminSystemStatisticService';

const statCards = [
  {
    id: 'total-users',
    label: 'Tổng số người dùng',
    value: '24,892',
    change: '',
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.15)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
  },
  {
    id: 'total-drivers',
    label: 'Tổng số tài xế',
    value: '24,892',
    change: '',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.15)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="3"></circle>
        <line x1="12" y1="2" x2="12" y2="9"></line>
        <line x1="12" y1="15" x2="12" y2="22"></line>
        <line x1="2" y1="12" x2="9" y2="12"></line>
        <line x1="15" y1="12" x2="22" y2="12"></line>
      </svg>
    ),
  },
  {
    id: 'total-vehicles',
    label: 'Tổng số phương tiện',
    value: '24,892',
    change: '',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.15)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13"></rect>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
        <circle cx="5.5" cy="18.5" r="2.5"></circle>
        <circle cx="18.5" cy="18.5" r="2.5"></circle>
      </svg>
    ),
  },
  {
    id: 'total-trips',
    label: 'Tổng số chuyến đi',
    value: '24,892',
    change: '',
    trend: 'up',
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.15)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
        <line x1="9" y1="3" x2="9" y2="21"></line>
        <line x1="15" y1="3" x2="15" y2="21"></line>
      </svg>
    ),
  },
  {
    id: 'total-revenue',
    label: 'Tổng doanh thu',
    value: '1.25B đ',
    change: '',
    trend: 'up',
    color: '#ec4899',
    bg: 'rgba(236, 72, 153, 0.15)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    ),
  },
  {
    id: 'total-transactions',
    label: 'Tổng giao dịch',
    value: '452',
    change: '',
    trend: 'live',
    color: '#14b8a6',
    bg: 'rgba(20, 184, 166, 0.15)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
  },
];
const monthlyRevenueData = [
  { label: 'Th06/25', value: 125000000 },
  { label: 'Th07/25', value: 145000000 },
  { label: 'Th08/25', value: 132000000 },
  { label: 'Th09/25', value: 178000000 },
  { label: 'Th10/25', value: 195000000 },
  { label: 'Th11/25', value: 215000000 },
  { label: 'Th12/25', value: 285000000 },
  { label: 'Th01/26', value: 190000000 },
  { label: 'Th02/26', value: 240000000 },
  { label: 'Th03/26', value: 265000000 },
  { label: 'Th04/26', value: 310000000 },
  { label: 'Th05/26', value: 345000000 }
];

const weeklyRevenueData = [
  { label: 'Tuần 1', value: 75000000 },
  { label: 'Tuần 2', value: 92000000 },
  { label: 'Tuần 3', value: 83000000 },
  { label: 'Tuần 4', value: 95000000 }
];

const RevenueLineChart = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const width = 1000;
  const height = 260;
  const paddingLeft = 70;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const values = data.map((d) => d.value);
  const maxVal = Math.max(...values, 1000000) * 1.15;

  const points = data.map((d, i) => {
    const x = paddingLeft + (i * chartWidth) / (data.length - 1 || 1);
    const y = paddingTop + chartHeight - (d.value / maxVal) * chartHeight;
    return { x, y, label: d.label, value: d.value };
  });

  const linePath = points.reduce((path, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
  }, '');

  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : '';

  const gridLines = [];
  for (let i = 0; i <= 4; i++) {
    const val = (i / 4) * maxVal;
    const y = paddingTop + chartHeight - (i / 4) * chartHeight;
    gridLines.push({ val, y });
  }

  const formatYLabel = (val) => {
    if (val >= 1000000000) {
      return `${(val / 1000000000).toFixed(1)}B`;
    }
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(0)}M`;
    }
    return val.toLocaleString();
  };

  return (
    <div className="line-chart-container" style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary-container)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--primary-container)" stopOpacity="0.00" />
          </linearGradient>
        </defs>

        {/* Grid Lines */}
        {gridLines.map((line, idx) => (
          <g key={idx}>
            <line
              x1={paddingLeft}
              y1={line.y}
              x2={width - paddingRight}
              y2={line.y}
              stroke="var(--surface-container-high)"
              strokeWidth="1"
              strokeDasharray={idx === 0 ? '0' : '4 4'}
              opacity={idx === 0 ? 0.3 : 1}
            />
            <text
              x={paddingLeft - 10}
              y={line.y + 4}
              textAnchor="end"
              fill="var(--on-surface-variant)"
              fontSize="10"
              fontWeight="500"
              opacity="0.7"
            >
              {formatYLabel(line.val)}
            </text>
          </g>
        ))}

        {/* X Axis Labels */}
        {points.map((p, idx) => (
          <text
            key={idx}
            x={p.x}
            y={height - 10}
            textAnchor="middle"
            fill="var(--on-surface-variant)"
            fontSize="10"
            fontWeight="500"
            opacity="0.8"
          >
            {p.label}
          </text>
        ))}

        {/* Area fill */}
        {areaPath && (
          <path
            d={areaPath}
            fill="url(#chartGradient)"
            style={{ transition: 'd 0.5s ease' }}
          />
        )}

        {/* Line */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke="var(--primary-container)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: 'd 0.5s ease' }}
          />
        )}

        {/* Dots */}
        {points.map((p, idx) => (
          <g key={idx}>
            <circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill="var(--primary-container)"
              stroke="var(--surface-container-lowest)"
              strokeWidth="2"
              style={{ transition: 'cx 0.5s ease, cy 0.5s ease' }}
            />
          </g>
        ))}

        {/* Hover elements & overlay markers */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <g>
            <line
              x1={points[hoveredIndex].x}
              y1={paddingTop}
              x2={points[hoveredIndex].x}
              y2={paddingTop + chartHeight}
              stroke="var(--primary-container)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.8"
            />
            <circle
              cx={points[hoveredIndex].x}
              cy={points[hoveredIndex].y}
              r="8"
              fill="var(--primary-container)"
              opacity="0.3"
            />
            <circle
              cx={points[hoveredIndex].x}
              cy={points[hoveredIndex].y}
              r="5"
              fill="var(--primary-container)"
              stroke="var(--surface-container-lowest)"
              strokeWidth="2.5"
            />
          </g>
        )}

        {/* Hover Target Overlay Zones (Invisible Columns) */}
        {points.map((p, idx) => {
          const leftBound = idx === 0
            ? paddingLeft
            : (points[idx - 1].x + p.x) / 2;
          const rightBound = idx === points.length - 1
            ? width - paddingRight
            : (p.x + points[idx + 1].x) / 2;
          const w = rightBound - leftBound;

          return (
            <rect
              key={idx}
              x={leftBound}
              y={paddingTop}
              width={w > 0 ? w : 0}
              height={chartHeight}
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          );
        })}
      </svg>

      {/* Floating Tooltip */}
      {hoveredIndex !== null && points[hoveredIndex] && (
        <div
          className="chart-tooltip"
          style={{
            position: 'absolute',
            left: `${(points[hoveredIndex].x / width) * 100}%`,
            top: `${((points[hoveredIndex].y - 50) / height) * 100}%`,
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 10,
            transition: 'left 0.15s ease, top 0.15s ease'
          }}
        >
          <div className="tooltip-label">{points[hoveredIndex].label}</div>
          <div className="tooltip-value">
            {points[hoveredIndex].value.toLocaleString()} đ
          </div>
        </div>
      )}
    </div>
  );
};

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
  const [chartMode, setChartMode] = useState('year'); // 'year' (12 months) or 'month' (weekly)
  const activeChartData = chartMode === 'year' ? monthlyRevenueData : weeklyRevenueData;

  const [activeUsers, setActiveUsers] = useState('...');
  const [activeDrivers, setActiveDrivers] = useState('...');
  const [activeVehicles, setActiveVehicles] = useState('...');

  const [filterType, setFilterType] = useState('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const [successfulOffers, setSuccessfulOffers] = useState('...');
  const [successfulOrders, setSuccessfulOrders] = useState('...');
  const [totalRevenue, setTotalRevenue] = useState('...');

  // Fetch Entity stats (once)
  useEffect(() => {
    const fetchEntityStats = async () => {
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
        console.error('Error fetching entity statistics:', error);
      }
    };
    fetchEntityStats();
  }, []);

  const getFilterDates = () => {
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (filterType) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'week':
        const day = startDate.getDay();
        const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
        startDate.setDate(diff);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'month':
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          startDate = new Date(customStartDate);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(customEndDate);
          endDate.setHours(23, 59, 59, 999);
        }
        break;
      default:
        break;
    }
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
  };

  // Fetch Activity stats (when filter changes)
  useEffect(() => {
    const fetchActivityStats = async () => {
      if (filterType === 'custom' && (!customStartDate || !customEndDate)) return;

      const { startDate, endDate } = getFilterDates();

      setSuccessfulOffers('...');
      setSuccessfulOrders('...');
      setTotalRevenue('...');

      try {
        const [offersRes, ordersRes, revenueRes] = await Promise.all([
          getSuccessfulOffersApi(startDate, endDate),
          getSuccessfulOrdersApi(startDate, endDate),
          getTotalRevenueApi(startDate, endDate)
        ]);
        if (offersRes?.code === 200) setSuccessfulOffers(offersRes.data);
        if (ordersRes?.code === 200) setSuccessfulOrders(ordersRes.data);
        if (revenueRes?.code === 200) {
          setTotalRevenue(`${revenueRes.data.toLocaleString()} đ`);
        }
      } catch (error) {
        console.error('Error fetching activity statistics:', error);
      }
    };
    fetchActivityStats();
  }, [filterType, customStartDate, customEndDate]);

  const displayStatCards = statCards.map(card => {
    if (card.id === 'total-users') return { ...card, value: activeUsers };
    if (card.id === 'total-drivers') return { ...card, value: activeDrivers };
    if (card.id === 'total-vehicles') return { ...card, value: activeVehicles };

    if (card.id === 'total-trips') return { ...card, value: successfulOffers };
    if (card.id === 'total-transactions') return { ...card, value: successfulOrders };
    if (card.id === 'total-revenue') return { ...card, value: totalRevenue };
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
      <h2 className="dashboard-section-title">Thống kê tài nguyên</h2>
      <div className="stat-cards-grid">
        {entityStats.map((card) => (
          <div
            key={card.id}
            className="stat-card"
            id={card.id}
            style={{
              '--card-accent': card.color,
              '--card-bg': card.bg.replace('0.15', '0.06')
            }}
          >
            <div className="stat-card-header">
              <span className="stat-card-label">{card.label}</span>
              <span className="stat-card-icon" style={{ color: card.color, backgroundColor: card.bg }}>{card.icon}</span>
            </div>
            <div className="stat-card-value">{card.value}</div>
            {(card.trend || card.change) && (
              <div className="stat-card-footer">
                <span className={`stat-card-change stat-card-change--${card.trend}`}>
                  {card.trend === 'up' && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 15l-6-6-6 6" />
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
      <div className="section-header-row">
        <h2 className="dashboard-section-title" style={{ margin: 0 }}>Thống kê hoạt động</h2>
        <div className="filter-controls">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="today">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="year">Năm nay</option>
            <option value="custom">Tùy chọn...</option>
          </select>
          {filterType === 'custom' && (
            <div className="custom-date-picker">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="date-input"
              />
              <span>-</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="date-input"
              />
            </div>
          )}
        </div>
      </div>
      <div className="stat-cards-grid">
        {activityStats.map((card) => (
          <div
            key={card.id}
            className="stat-card"
            id={card.id}
            style={{
              '--card-accent': card.color,
              '--card-bg': card.bg.replace('0.15', '0.06')
            }}
          >
            <div className="stat-card-header">
              <span className="stat-card-label">{card.label}</span>
              <span className="stat-card-icon" style={{ color: card.color, backgroundColor: card.bg }}>{card.icon}</span>
            </div>
            <div className="stat-card-value">{card.value}</div>
            {(card.trend || card.change) && (
              <div className="stat-card-footer">
                <span className={`stat-card-change stat-card-change--${card.trend}`}>
                  {card.trend === 'up' && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 15l-6-6-6 6" />
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
              <h3 className="chart-title">Biểu đồ doanh thu</h3>
              <p className="chart-subtitle">
                {chartMode === 'year'
                  ? 'Phân tích doanh thu 12 tháng gần nhất'
                  : 'Phân tích doanh thu theo tuần của tháng'}
              </p>
            </div>
            <div className="chart-tabs">
              <button
                className={`chart-tab ${chartMode === 'month' ? 'chart-tab--active' : ''}`}
                onClick={() => setChartMode('month')}
              >
                Tuần
              </button>
              <button
                className={`chart-tab ${chartMode === 'year' ? 'chart-tab--active' : ''}`}
                onClick={() => setChartMode('year')}
              >
                12 Tháng
              </button>
            </div>
          </div>
          <RevenueLineChart data={activeChartData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
