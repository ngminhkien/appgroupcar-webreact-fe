import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import './AdminSysLayout.css';

const AdminSysLayout = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminTopbar />
        <div className="admin-content">
          <Outlet />
        </div>
        <footer className="admin-footer">
          <div className="admin-footer-left">
            <span className="footer-status">
              <span className="footer-status-dot" />
              API STATUS: ONLINE
            </span>
            <span className="footer-status">
              <span className="footer-status-dot" />
              DATABASE: ACTIVE
            </span>
          </div>
          <span className="admin-footer-right">
            © 2024 NexusRide Dashboard. Hệ thống đang vận hành ổn định.
          </span>
        </footer>
      </div>
    </div>
  );
};

export default AdminSysLayout;
