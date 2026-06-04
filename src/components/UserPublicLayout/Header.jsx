import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/store/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getUserProfileApi } from '@/services/userService';

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch detailed user profile if authenticated
  const { data: profileInfo } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await getUserProfileApi();
      return response?.data || response;
    },
    enabled: !!isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const getFullImageUrl = (url) => {
    if (!url) return 'https://a.storyblok.com/f/191576/1200x800/215e59568f/round_profil_picture_after_.webp';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    baseUrl = baseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
    const formattedUrl = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${formattedUrl}`;
  };

  // Helper to preserve search query params, while adapting service defaults for specific pages
  const getPathWithQuery = (path) => {
    const params = new URLSearchParams(location.search);
    
    if (path === '/booking') {
      params.delete('type');
      if (!params.has('service')) {
        params.set('service', 'bus');
      }
    } else if (path === '/create-request') {
      params.delete('type');
      if (!params.has('service')) {
        params.set('service', 'carpool');
      }
    }
    
    const searchString = params.toString();
    return searchString ? `${path}?${searchString}` : path;
  };

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate(getPathWithQuery('/'));
  };

  const userRole = user?.Roles || user?.role || user?.Role || '';
  const isDriver = Array.isArray(userRole) ? userRole.includes('Driver') : userRole === 'Driver';

  const navItems = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Đặt vé', path: '/booking' },
    ...(isDriver ? [
      { name: 'Tạo yêu cầu', path: '/create-request' },
      { name: 'Chuyến đi của tôi', path: '/driver/trips' }
    ] : []),
    { name: 'Lịch sử', path: '/history' },
  ];

  // Determine profile path based on role
  const getProfilePath = () => {
    const role = user?.Roles || '';
    if (role === 'Admin') return '/admin/profile';
    if (role === 'ADMIN_COMPANY') return '/company-admin/profile';
    return '/profile';
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-lg shadow-md border-b border-slate-200/50 py-3' : 'bg-white/95 border-b border-slate-100 py-4'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link to={getPathWithQuery('/')} className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5 hover:opacity-90">
          <span className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-black text-base shadow-md shadow-emerald-500/20">N</span>
          <span>NexusRide</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {isAuthenticated && navItems.map((item) => (
            <NavLink
              key={item.name}
              to={getPathWithQuery(item.path)}
              className={({ isActive }) =>
                `text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
                  isActive
                    ? 'text-emerald-600 border-b-2 border-emerald-500 pb-1'
                    : 'text-slate-600 hover:text-slate-900 pb-1'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-6">
          {!isAuthenticated ? (
            <>
              <Link to={getPathWithQuery('/login')} className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">
                Đăng nhập
              </Link>
              <Link to={getPathWithQuery('/register')} className="inline-flex items-center justify-center px-4.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-200 cursor-pointer">
                Đăng ký
              </Link>
            </>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 focus:outline-none cursor-pointer group py-1.5 px-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <img 
                  src={getFullImageUrl(profileInfo?.avatarUrl)} 
                  alt="User Avatar" 
                  className="w-8.5 h-8.5 rounded-full object-cover border border-slate-200 shadow-sm"
                  onError={(e) => { e.target.src = 'https://a.storyblok.com/f/191576/1200x800/215e59568f/round_profil_picture_after_.webp'; }}
                />
                <span className="text-sm font-bold text-slate-700 max-w-[120px] truncate group-hover:text-slate-900">
                  {profileInfo?.fullName || user?.fullName || 'Tài khoản'}
                </span>
                <svg className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  
                  <div className="absolute right-0 mt-2.5 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2.5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4.5 py-3 border-b border-slate-100 mb-1">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Đăng nhập bằng</p>
                      <p className="text-sm font-extrabold text-slate-800 truncate mt-0.5">{profileInfo?.email || user?.email || ''}</p>
                    </div>
                    
                    <Link 
                      to={getPathWithQuery(getProfilePath())}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4.5 py-2.5 text-sm text-slate-700 font-medium hover:bg-slate-50 hover:text-emerald-600 transition-all"
                    >
                      <svg className="w-4.5 h-4.5 text-slate-400 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Hồ sơ cá nhân
                    </Link>
                    
                    <hr className="border-slate-100 my-1" />
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4.5 py-2.5 text-sm text-red-600 font-semibold hover:bg-red-50 transition-colors text-left cursor-pointer"
                    >
                      <svg className="w-4.5 h-4.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl py-6 px-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-5 duration-200">
          {isAuthenticated && navItems.map((item) => (
            <NavLink
              key={item.name}
              to={getPathWithQuery(item.path)}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `text-base font-semibold py-2 px-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
          
          {isAuthenticated && <hr className="border-slate-100 my-2" />}
          
          <div className="flex flex-col gap-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to={getPathWithQuery('/login')}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-lg border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50"
                >
                  Đăng nhập
                </Link>
                <Link
                  to={getPathWithQuery('/register')}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md shadow-emerald-500/10"
                >
                  Đăng ký
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <img 
                    src={getFullImageUrl(profileInfo?.avatarUrl)} 
                    alt="User Avatar" 
                    className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-sm"
                    onError={(e) => { e.target.src = 'https://a.storyblok.com/f/191576/1200x800/215e59568f/round_profil_picture_after_.webp'; }}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-slate-800 truncate">{profileInfo?.fullName || user?.fullName || 'Tài khoản'}</span>
                    <span className="text-xs text-slate-400 truncate">{profileInfo?.email || user?.email || ''}</span>
                  </div>
                </div>
                
                <Link
                  to={getPathWithQuery(getProfilePath())}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors font-semibold"
                >
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Hồ sơ cá nhân
                </Link>
                
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold text-left w-full cursor-pointer"
                >
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Đăng xuất
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
