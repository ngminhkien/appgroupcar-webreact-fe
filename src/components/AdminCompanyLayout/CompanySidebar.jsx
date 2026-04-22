import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/store/AuthContext';
import '../AdminSysLayout/AdminSidebar.css';

const navItems = [
  {
    path: '/company-admin/dashboard',
    label: 'Tổng quan',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    path: '/company-admin/accounts',
    label: 'Tài khoản nhân sự',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    path: '/company-admin/vehicles',
    label: 'Phương tiện công ty',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
];

const SidebarSubMenuItem = ({ item }) => {
  const location = useLocation();
  const isActiveGroup = location.pathname.startsWith(item.path);
  const [isExpanded, setIsExpanded] = useState(isActiveGroup);

  useEffect(() => {
    if (isActiveGroup) setIsExpanded(true);
  }, [isActiveGroup]);

  return (
    <div className="sidebar-nav-item-wrapper" aria-expanded={isExpanded}>
      <button 
        className={`sidebar-nav-item ${isActiveGroup && !isExpanded ? 'sidebar-nav-item--active' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <span className="sidebar-nav-icon">{item.icon}</span>
        <span className="sidebar-nav-label">{item.label}</span>
        <svg className="sidebar-nav-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
      <div className="sidebar-nav-sub">
        {item.subMenus.map((sub, idx) => (
          <NavLink
            key={idx}
            to={sub.path}
            end={sub.end}
            className={({ isActive }) =>
              `sidebar-nav-sub-item ${isActive ? 'sidebar-nav-sub-item--active' : ''}`
            }
          >
            <span className="sidebar-nav-sub-label">{sub.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

const CompanySidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const renderItem = (item) => {
    if (item.subMenus) {
      return <SidebarSubMenuItem key={item.path} item={item} />;
    }
    return (
      <NavLink
        key={item.path}
        to={item.path}
        end
        className={({ isActive }) =>
          `sidebar-nav-item ${isActive ? 'sidebar-nav-item--active' : ''}`
        }
      >
        <span className="sidebar-nav-icon">{item.icon}</span>
        <span className="sidebar-nav-label">{item.label}</span>
      </NavLink>
    );
  }
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">Company Portal</div>
        <span className="sidebar-subtitle">Quản trị Công ty</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(renderItem)}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user" onClick={() => navigate('/company-admin/profile')} style={{ cursor: 'pointer' }}>
          <div className="sidebar-user-avatar">CT</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.Email?.split('@')[0] || 'Công ty'}</span>
            <span className="sidebar-user-version"><span className="version-dot" />Đang hoạt động</span>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default CompanySidebar;
