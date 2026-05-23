import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Column 1: Brand Info */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5 hover:opacity-90">
            <span className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-black text-base shadow-md shadow-emerald-500/20">N</span>
            <span>NexusRide</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2" />
          </Link>
          <p className="text-sm leading-relaxed text-slate-500">
            Nền tảng công nghệ vận tải đa phương thức hàng đầu Việt Nam. Mang lại trải nghiệm di chuyển và giao nhận thông minh, an toàn, nhanh chóng.
          </p>
        </div>

        {/* Column 2: Navigation Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white text-sm font-bold uppercase tracking-wider">Khám phá</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition-colors duration-200">Trang chủ</Link>
            </li>
            <li>
              <Link to="/booking" className="hover:text-white transition-colors duration-200">Đặt vé</Link>
            </li>
            <li>
              <Link to="/create-request" className="hover:text-white transition-colors duration-200">Tạo yêu cầu</Link>
            </li>
            <li>
              <Link to="/history" className="hover:text-white transition-colors duration-200">Lịch sử hành trình</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Services */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white text-sm font-bold uppercase tracking-wider">Dịch vụ</h4>
          <ul className="space-y-2.5 text-sm text-slate-500">
            <li>Đặt vé xe khách</li>
            <li>Giải pháp đi chung xe</li>
            <li>Gửi hàng Express siêu tốc</li>
            <li>Vận tải xe tải hai chiều</li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white text-sm font-bold uppercase tracking-wider">Liên hệ</h4>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>1900 6868</span>
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>support@nexusride.vn</span>
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-slate-500">Cầu Giấy, Hà Nội, Việt Nam</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 w-full mt-12 pt-8 border-t border-slate-900/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <span>© {new Date().getFullYear()} NexusRide. Tất cả quyền được bảo lưu.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-400">Điều khoản dịch vụ</a>
          <a href="#" className="hover:text-slate-400">Chính sách bảo mật</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
