import React from 'react';
import { Outlet } from 'react-router-dom';
import CompanySidebar from './CompanySidebar';
import CompanyTopbar from './CompanyTopbar';
import '../AdminSysLayout/AdminSysLayout.css';

const AdminCompanyLayout = () => {
  return (
    <div className="admin-layout">
      <CompanySidebar />
      <div className="admin-main">
        <CompanyTopbar />
        <div className="admin-content">
          <Outlet />
        </div>
        <footer className="admin-footer">
          <span className="admin-footer-right">
            © 2024 NexusRide Company Portal. Hoạt động trên quyền công ty đối tác.
          </span>
        </footer>
      </div>
    </div>
  );
};

export default AdminCompanyLayout;
