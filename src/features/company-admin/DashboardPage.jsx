import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { getRevenueApi, getCompletedShowtimeCountApi } from '@/services/adminCompanyStatisticsService';

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

const CompanyAdminDashboardPage = () => {
  const [filter, setFilter] = useState('month'); // 'today' | 'week' | 'month'

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-800">Biểu đồ doanh thu theo tuần</h3>
            <button className="text-sm font-semibold text-[#001f3f] hover:text-blue-700 transition-colors">Xem chi tiết</button>
          </div>
          <div className="relative h-64 w-full mt-4">
            {/* Y-axis */}
            <div className="absolute inset-0 flex flex-col justify-between text-[11px] font-medium text-slate-400 pb-8">
              <div className="flex items-center gap-4 w-full border-b border-slate-100 pb-2"><span className="w-8 text-right">100M</span></div>
              <div className="flex items-center gap-4 w-full border-b border-slate-100 pb-2"><span className="w-8 text-right">75M</span></div>
              <div className="flex items-center gap-4 w-full border-b border-slate-100 pb-2"><span className="w-8 text-right">50M</span></div>
              <div className="flex items-center gap-4 w-full border-b border-slate-100 pb-2"><span className="w-8 text-right">25M</span></div>
              <div className="flex items-center gap-4 w-full border-b border-slate-100 pb-2"><span className="w-8 text-right">0</span></div>
            </div>

            {/* Bars placeholder */}
            <div className="absolute inset-0 left-12 bottom-8 flex justify-around items-end px-4">
              <div className="w-8 h-[30%] bg-emerald-100 rounded-t-sm"></div>
              <div className="w-8 h-[45%] bg-emerald-100 rounded-t-sm"></div>
              <div className="w-8 h-[65%] bg-emerald-100 rounded-t-sm"></div>
              <div className="w-8 h-[80%] bg-[#001f3f] rounded-t-sm"></div>
              <div className="w-8 h-[95%] bg-emerald-400 rounded-t-sm shadow-sm shadow-emerald-200/50"></div>
              <div className="w-8 h-[55%] bg-emerald-100 rounded-t-sm"></div>
              <div className="w-8 h-[70%] bg-emerald-100 rounded-t-sm"></div>
            </div>

            {/* X-axis */}
            <div className="absolute bottom-0 left-12 right-0 flex justify-around text-xs font-semibold text-slate-400 px-4">
              <span className="w-8 text-center">T2</span>
              <span className="w-8 text-center">T3</span>
              <span className="w-8 text-center">T4</span>
              <span className="w-8 text-center text-[#001f3f]">T5</span>
              <span className="w-8 text-center text-emerald-500">T6</span>
              <span className="w-8 text-center">T7</span>
              <span className="w-8 text-center">CN</span>
            </div>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-8">Phân bổ loại xe</h3>
          <div className="flex-1 flex flex-col items-center justify-center pb-4">
            <div className="relative w-44 h-44 mb-8">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {/* Background Track */}
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#e2e8f0" strokeWidth="4" />
                {/* Limousine (25%) */}
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#4ade80" strokeWidth="5" strokeDasharray="25 75" strokeDashoffset="0" />
                {/* Xe giường nằm (65%) */}
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#001f3f" strokeWidth="6" strokeDasharray="65 35" strokeDashoffset="-25" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-[#001f3f]">124</span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Tổng xe</span>
              </div>
            </div>

            <div className="w-full space-y-4 px-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#001f3f]"></div>
                  <span className="font-medium text-slate-600">Xe giường nằm</span>
                </div>
                <span className="font-bold text-slate-800">65%</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#4ade80]"></div>
                  <span className="font-medium text-slate-600">Limousine</span>
                </div>
                <span className="font-bold text-slate-800">25%</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <span className="font-medium text-slate-600">Ghế ngồi</span>
                </div>
                <span className="font-bold text-slate-800">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyAdminDashboardPage;
