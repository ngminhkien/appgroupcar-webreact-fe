import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { getRevenueApi, getCompletedShowtimeCountApi, getMonthlyRevenueApi } from '@/services/adminCompanyStatisticsService';

const getDateRanges = () => {
  const getTodayRange = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return { startDate: start.toISOString(), endDate: end.toISOString() };
  };

  const getThisWeekRange = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
    const start = new Date(now.setDate(diff));
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { startDate: start.toISOString(), endDate: end.toISOString() };
  };

  const getThisMonthRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { startDate: start.toISOString(), endDate: end.toISOString() };
  };

  return {
    today: getTodayRange(),
    week: getThisWeekRange(),
    month: getThisMonthRange(),
  };
};

const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  return Number(num).toLocaleString('vi-VN');
};

const formatCurrency = (num) => {
  if (num === undefined || num === null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
};

const MonthlyRevenueBookingLineChart = ({ data = [], isLoading, isError }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (isLoading) {
    return (
      <div className="h-72 w-full flex flex-col items-center justify-center space-y-3 bg-slate-50/50 rounded-xl">
        <div className="w-8 h-8 border-4 border-[#001f3f] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-500 font-sans">Đang tải dữ liệu biểu đồ...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-72 w-full flex items-center justify-center bg-red-50 rounded-xl border border-red-100 p-6">
        <p className="text-sm font-semibold text-red-600 font-sans">Không thể tải dữ liệu biểu đồ doanh thu theo tháng.</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-72 w-full flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <p className="text-sm font-semibold text-slate-400 font-sans">Không có dữ liệu thống kê cho khoảng thời gian này.</p>
      </div>
    );
  }

  const width = 1000;
  const height = 300;
  const paddingLeft = 75;
  const paddingRight = 60;
  const paddingTop = 30;
  const paddingBottom = 45;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Max values for scaling
  const maxRevenue = Math.max(...data.map(d => d.revenue), 100000) * 1.15;
  const maxBookings = Math.max(...data.map(d => d.bookingCount), 5) * 1.15;

  // Generate points
  const points = data.map((d, i) => {
    const x = paddingLeft + (i * chartWidth) / (data.length - 1 || 1);
    const yRevenue = paddingTop + chartHeight - (d.revenue / maxRevenue) * chartHeight;
    const yBookings = paddingTop + chartHeight - (d.bookingCount / maxBookings) * chartHeight;
    return {
      x,
      yRevenue,
      yBookings,
      revenue: d.revenue,
      bookingCount: d.bookingCount,
      label: `T${String(d.month).padStart(2, '0')}/${String(d.year).slice(-2)}`,
      month: d.month,
      year: d.year
    };
  });

  // SVG Paths
  const revenueLinePath = points.reduce((path, p, i) => {
    return i === 0 ? `M ${p.x} ${p.yRevenue}` : `${path} L ${p.x} ${p.yRevenue}`;
  }, '');

  const bookingsLinePath = points.reduce((path, p, i) => {
    return i === 0 ? `M ${p.x} ${p.yBookings}` : `${path} L ${p.x} ${p.yBookings}`;
  }, '');

  const revenueAreaPath = points.length > 0
    ? `${revenueLinePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : '';

  const bookingsAreaPath = points.length > 0
    ? `${bookingsLinePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : '';

  // Left Y-Axis Grid Lines (based on Revenue)
  const gridLines = [];
  for (let i = 0; i <= 4; i++) {
    const revVal = (i / 4) * maxRevenue;
    const bookVal = (i / 4) * maxBookings;
    const y = paddingTop + chartHeight - (i / 4) * chartHeight;
    gridLines.push({ revVal, bookVal, y });
  }

  const formatYRevenue = (val) => {
    if (val >= 1000000000) return `${(val / 1000000000).toFixed(1)}B`;
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
    return `${val}`;
  };

  const formatYBookings = (val) => {
    return Math.round(val);
  };

  return (
    <div className="relative w-full" style={{ position: 'relative' }}>
      {/* Legend */}
      <div className="flex items-center gap-6 mb-4 text-xs font-semibold text-slate-500 font-sans">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#001f3f]" />
          <span>Doanh thu (VND)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#10b981]" />
          <span>Số chuyến xe (bookingCount)</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#001f3f" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#001f3f" stopOpacity="0.00" />
          </linearGradient>
          <linearGradient id="bookingsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
          </linearGradient>
        </defs>

        {/* Grid and Left/Right Y-Axis Labels */}
        {gridLines.map((line, idx) => (
          <g key={idx}>
            {/* Grid Line */}
            <line
              x1={paddingLeft}
              y1={line.y}
              x2={width - paddingRight}
              y2={line.y}
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray={idx === 0 ? '0' : '4 4'}
              opacity={idx === 0 ? 0.3 : 0.8}
            />
            {/* Left Y-axis Label (Revenue) */}
            <text
              x={paddingLeft - 10}
              y={line.y + 4}
              textAnchor="end"
              fill="#64748b"
              fontSize="10"
              fontWeight="600"
              className="font-sans"
            >
              {formatYRevenue(line.revVal)}
            </text>
            {/* Right Y-axis Label (Bookings) */}
            <text
              x={width - paddingRight + 10}
              y={line.y + 4}
              textAnchor="start"
              fill="#64748b"
              fontSize="10"
              fontWeight="600"
              className="font-sans"
            >
              {formatYBookings(line.bookVal)}
            </text>
          </g>
        ))}

        {/* X Axis Labels */}
        {points.map((p, idx) => (
          <text
            key={idx}
            x={p.x}
            y={height - 15}
            textAnchor="middle"
            fill="#64748b"
            fontSize="10"
            fontWeight="600"
            className="font-sans"
          >
            {p.label}
          </text>
        ))}

        {/* Revenue Area */}
        {revenueAreaPath && <path d={revenueAreaPath} fill="url(#revenueGrad)" />}
        {/* Bookings Area */}
        {bookingsAreaPath && <path d={bookingsAreaPath} fill="url(#bookingsGrad)" />}

        {/* Revenue Line */}
        {revenueLinePath && (
          <path
            d={revenueLinePath}
            fill="none"
            stroke="#001f3f"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Bookings Line */}
        {bookingsLinePath && (
          <path
            d={bookingsLinePath}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Dots */}
        {points.map((p, idx) => (
          <g key={idx}>
            {/* Revenue Dot */}
            <circle
              cx={p.x}
              cy={p.yRevenue}
              r="4.5"
              fill="#001f3f"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            {/* Bookings Dot */}
            <circle
              cx={p.x}
              cy={p.yBookings}
              r="4.5"
              fill="#10b981"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
          </g>
        ))}

        {/* Hover markers */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <g>
            <line
              x1={points[hoveredIndex].x}
              y1={paddingTop}
              x2={points[hoveredIndex].x}
              y2={paddingTop + chartHeight}
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {/* Highlighted dots */}
            <circle
              cx={points[hoveredIndex].x}
              cy={points[hoveredIndex].yRevenue}
              r="6.5"
              fill="#001f3f"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            <circle
              cx={points[hoveredIndex].x}
              cy={points[hoveredIndex].yBookings}
              r="6.5"
              fill="#10b981"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
          </g>
        )}

        {/* Hover Target Overlay Zones */}
        {points.map((p, idx) => {
          const leftBound = idx === 0 ? paddingLeft : (points[idx - 1].x + p.x) / 2;
          const rightBound = idx === points.length - 1 ? width - paddingRight : (p.x + points[idx + 1].x) / 2;
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
          className="absolute bg-white/95 backdrop-blur-sm p-3.5 rounded-xl border border-slate-100 shadow-xl pointer-events-none z-20 text-xs flex flex-col space-y-1.5 min-w-[170px]"
          style={{
            left: `${(points[hoveredIndex].x / width) * 100}%`,
            top: `${((Math.min(points[hoveredIndex].yRevenue, points[hoveredIndex].yBookings) - 75) / height) * 100}%`,
            transform: 'translateX(-50%)',
            transition: 'left 0.15s ease, top 0.15s ease',
          }}
        >
          <div className="font-bold text-slate-800 text-center border-b border-slate-100 pb-1 mb-1 font-sans">
            Tháng {points[hoveredIndex].month}/{points[hoveredIndex].year}
          </div>
          <div className="flex justify-between items-center space-x-4 font-sans">
            <span className="flex items-center gap-1.5 font-medium text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-[#001f3f]" />
              Doanh thu:
            </span>
            <span className="font-bold text-[#001f3f]">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(points[hoveredIndex].revenue)}
            </span>
          </div>
          <div className="flex justify-between items-center space-x-4 font-sans">
            <span className="flex items-center gap-1.5 font-medium text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
              Số chuyến xe:
            </span>
            <span className="font-bold text-[#10b981]">
              {points[hoveredIndex].bookingCount} chuyến
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const CompanyAdminDashboardPage = () => {
  const [filter, setFilter] = useState('month'); // 'today' | 'week' | 'month'

  const { data: monthlyData, isLoading: isMonthlyLoading, isError: isMonthlyError } = useQuery({
    queryKey: ['company-monthly-revenue'],
    queryFn: async () => {
      let companyId = localStorage.getItem('companyId');

      if (!companyId) {
        const token = localStorage.getItem('accessToken');
        if (token) {
          try {
            const decoded = jwtDecode(token);
            companyId = decoded.CompanyId || decoded.companyId || decoded.Company || decoded.company;
            if (companyId) {
              localStorage.setItem('companyId', companyId);
            }
          } catch (e) {
            console.error('Failed to decode token on dashboard:', e);
          }
        }
      }

      if (!companyId) {
        throw new Error('Không tìm thấy Company ID trong storage. Vui lòng đăng nhập lại.');
      }

      return await getMonthlyRevenueApi({ companyId });
    },
    staleTime: 30 * 1000,
  });

  const { data: revenueData, isLoading: isRevenueLoading, isError: isRevenueError, error: revenueError } = useQuery({
    queryKey: ['company-revenue', filter],
    queryFn: async () => {
      let companyId = localStorage.getItem('companyId');

      // Fallback decoding from accessToken if companyId is missing in storage
      if (!companyId) {
        const token = localStorage.getItem('accessToken');
        if (token) {
          try {
            const decoded = jwtDecode(token);
            companyId = decoded.CompanyId || decoded.companyId || decoded.Company || decoded.company;
            if (companyId) {
              localStorage.setItem('companyId', companyId);
            }
          } catch (e) {
            console.error('Failed to decode token on dashboard:', e);
          }
        }
      }

      if (!companyId) {
        throw new Error('Không tìm thấy Company ID trong storage. Vui lòng đăng nhập lại.');
      }

      const ranges = getDateRanges();
      const { startDate, endDate } = ranges[filter];

      return await getRevenueApi({ companyId, startDate, endDate });
    },
    staleTime: 30 * 1000,
  });

  const { data: showtimeData, isLoading: isShowtimeLoading, isError: isShowtimeError, error: showtimeError } = useQuery({
    queryKey: ['company-completed-showtimes', filter],
    queryFn: async () => {
      let companyId = localStorage.getItem('companyId');

      // Fallback decoding from accessToken if companyId is missing in storage
      if (!companyId) {
        const token = localStorage.getItem('accessToken');
        if (token) {
          try {
            const decoded = jwtDecode(token);
            companyId = decoded.CompanyId || decoded.companyId || decoded.Company || decoded.company;
            if (companyId) {
              localStorage.setItem('companyId', companyId);
            }
          } catch (e) {
            console.error('Failed to decode token on dashboard:', e);
          }
        }
      }

      if (!companyId) {
        throw new Error('Không tìm thấy Company ID trong storage. Vui lòng đăng nhập lại.');
      }

      const ranges = getDateRanges();
      const { startDate, endDate } = ranges[filter];

      return await getCompletedShowtimeCountApi({ companyId, startDate, endDate });
    },
    staleTime: 30 * 1000,
  });

  useEffect(() => {
    if (isRevenueError) {
      console.error("Lỗi lấy dữ liệu doanh thu:", revenueError);
    }
  }, [isRevenueError, revenueError]);

  useEffect(() => {
    if (isShowtimeError) {
      console.error("Lỗi lấy dữ liệu số chuyến xe:", showtimeError);
    }
  }, [isShowtimeError, showtimeError]);

  const stats = revenueData?.data || revenueData || {};
  const totalPassengers = stats.bookingCount ?? 0;
  const totalRevenue = stats.totalRevenue ?? 0;

  const showtimeStats = showtimeData?.data || showtimeData || {};
  const completedShowtimeCount = showtimeStats.completedShowtimeCount ?? 0;

  const monthlyStats = monthlyData?.data || monthlyData || {};
  const monthlyRevenues = monthlyStats.monthlyRevenues || [];

  const displayFilterLabel = {
    today: 'Hôm nay',
    week: 'Tuần này',
    month: 'Tháng này'
  }[filter];

  const hasAnyError = isRevenueError || isShowtimeError;
  const activeError = revenueError || showtimeError;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50/50 min-h-screen">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#001f3f]">Tổng quan hoạt động</h1>
          {hasAnyError && (
            <p className="text-xs text-red-500 mt-1">
              Lỗi: {activeError?.response?.data?.message || activeError?.message || 'Không thể tải dữ liệu thống kê.'}
            </p>
          )}
        </div>
        <div className="flex bg-white rounded-xl p-1.5 shadow-sm border border-slate-100">
          <button
            onClick={() => setFilter('today')}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${filter === 'today' ? 'bg-[#001f3f] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
              }`}
          >
            Hôm nay
          </button>
          <button
            onClick={() => setFilter('week')}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${filter === 'week' ? 'bg-[#001f3f] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
              }`}
          >
            Tuần này
          </button>
          <button
            onClick={() => setFilter('month')}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${filter === 'month' ? 'bg-[#001f3f] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
              }`}
          >
            Tháng này
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 2 - Completed Trips */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full relative">
          {isShowtimeLoading && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[0.5px] rounded-2xl flex items-center justify-center z-10" />
          )}
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#001f3f]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="19" r="3" />
                <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
                <circle cx="18" cy="5" r="3" />
              </svg>
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Chuyến đi ({displayFilterLabel})</p>
          <h3 className="text-[28px] font-bold text-slate-800 mb-2 leading-none">
            {isShowtimeLoading ? '...' : formatNumber(completedShowtimeCount)}
          </h3>
        </div>

        {/* Card 3 - Total Passengers */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full relative">
          {isRevenueLoading && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[0.5px] rounded-2xl flex items-center justify-center z-10" />
          )}
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#001f3f]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Tổng hành khách ({displayFilterLabel})</p>
          <h3 className="text-[28px] font-bold text-slate-800 mb-2 leading-none">
            {isRevenueLoading ? '...' : formatNumber(totalPassengers)}
          </h3>
        </div>

        {/* Card 4 - Revenue */}
        <div className="bg-slate-100 p-5 rounded-2xl border border-slate-200 flex flex-col h-full relative">
          {isRevenueLoading && (
            <div className="absolute inset-0 bg-slate-100/40 backdrop-blur-[0.5px] rounded-2xl flex items-center justify-center z-10" />
          )}
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#001f3f] shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M7 15h0M2 9.5h20" />
              </svg>
            </div>
          </div>
          <p className="text-slate-600 text-sm font-medium mb-1">Doanh thu ({displayFilterLabel})</p>
          <h3 className="text-[28px] font-bold text-slate-800 mb-3 leading-none">
            {isRevenueLoading ? '...' : formatCurrency(totalRevenue)}
          </h3>
        </div>
      </div>

      {/* Charts Row */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 w-full">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-bold text-slate-800 font-sans">Biểu đồ đường doanh thu & số chuyến theo tháng</h3>
          {/* <button className="text-sm font-semibold text-[#001f3f] hover:text-blue-700 transition-colors font-sans">Xem chi tiết</button> */}
        </div>
        <div className="relative w-full mt-4">
          <MonthlyRevenueBookingLineChart
            data={monthlyRevenues}
            isLoading={isMonthlyLoading}
            isError={isMonthlyError}
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyAdminDashboardPage;
