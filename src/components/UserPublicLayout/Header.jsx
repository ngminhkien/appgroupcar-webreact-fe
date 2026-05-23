import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Đặt vé', path: '/booking' },
    { name: 'Tạo yêu cầu', path: '/create-request' },
    { name: 'Lịch sử', path: '/history' },
  ];

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-lg shadow-md border-b border-slate-200/50 py-3' : 'bg-white/95 border-b border-slate-100 py-4'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5 hover:opacity-90">
          <span className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-black text-base shadow-md shadow-emerald-500/20">N</span>
          <span>NexusRide</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
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
          <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">
            Đăng nhập
          </Link>
          <Link to="/register" className="inline-flex items-center justify-center px-4.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-200 cursor-pointer">
            Đăng ký
          </Link>
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
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
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
          <hr className="border-slate-100 my-2" />
          <div className="flex flex-col gap-3">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2.5 rounded-lg border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md shadow-emerald-500/10"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
