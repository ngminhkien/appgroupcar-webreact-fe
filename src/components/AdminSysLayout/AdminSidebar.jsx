import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import './AdminSidebar.css';

const navItems = [
  {
    path: '/admin/dashboard',
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
    path: '/admin/companies',
    label: 'Công ty',
    subMenus: [
      { path: '/admin/companies/pending', label: 'Danh sách chờ duyệt' },
      { path: '/admin/companies', label: 'Quản lý', end: true },
    ],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 21h18M3 7v14M21 7v14M6 11h4M6 15h4M14 11h4M14 15h4M10 21V17h4v4M12 3l9 4M12 3L3 7"/>
      </svg>
    ),
  },
  {
    path: '/admin/users',
    label: 'Người dùng',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    path: '/admin/drivers',
    label: 'Tài xế',
    subMenus: [
      { path: '/admin/drivers/pending', label: 'Danh sách chờ duyệt' },
      { path: '/admin/drivers', label: 'Quản lý', end: true },
    ],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 17h14M5 17a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2M9 21l3-4 3 4"/>
        <circle cx="7.5" cy="17" r="2.5"/>
        <circle cx="16.5" cy="17" r="2.5"/>
      </svg>
    ),
  },
  {
    path: '/admin/vehicles',
    label: 'Phương tiện',
    subMenus: [
      { path: '/admin/vehicles/pending', label: 'Danh sách chờ duyệt' },
      { path: '/admin/vehicles', label: 'Quản lý', end: true },
    ],
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

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
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
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">NexusRide</div>
        <span className="sidebar-subtitle">Hệ thống Quản trị</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(renderItem)}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">QT</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">Quản trị viên</span>
            <span className="sidebar-user-version">v1.2.4 <span className="version-dot" />Active</span>
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

export default AdminSidebar;
