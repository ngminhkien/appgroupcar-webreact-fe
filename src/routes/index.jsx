import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '@/features/landing';
import { LoginPage, RegisterPage } from '@/features/auth';
import { 
  DashboardPage, 
  CompaniesPage, 
  UsersPage,
  PendingCompaniesPage,
  PendingDriversPage,
  PendingVehiclesPage,
  AdminProfilePage,
  DriversPage,
  VehiclesPage
} from '@/features/system-admin';
import CompanyAdminDashboardPage from '@/features/company-admin/DashboardPage';
import CompanyAdminAccountsPage from '@/features/company-admin/AccountsPage';
import CompanyAdminVehiclesPage from '@/features/company-admin/VehiclesPage';
import { PublicLayout } from '@/components/PublicLayout';
import { AuthLayout } from '@/components/AuthLayout';
import { AdminSysLayout } from '@/components/AdminSysLayout';
import { AdminCompanyLayout } from '@/components/AdminCompanyLayout';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages with Header + Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Auth pages — standalone layout (no Header/Footer) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Admin System — Protected, role-based */}
        <Route element={<ProtectedRoute allowedRoles={['Admin', 'User']} />}>
          <Route element={<AdminSysLayout />}>
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/companies" element={<CompaniesPage />} />
            <Route path="/admin/companies/pending" element={<PendingCompaniesPage />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/drivers" element={<DriversPage />} />
            <Route path="/admin/drivers/pending" element={<PendingDriversPage />} />
            <Route path="/admin/vehicles" element={<VehiclesPage />} />
            <Route path="/admin/vehicles/pending" element={<PendingVehiclesPage />} />
            <Route path="/admin/profile" element={<AdminProfilePage />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
        </Route>

        {/* Company Admin System — Protected, role-based ONLY for ADMIN_COMPANY */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN_COMPANY']} />}>
          <Route element={<AdminCompanyLayout />}>
            <Route path="/company-admin/dashboard" element={<CompanyAdminDashboardPage />} />
            <Route path="/company-admin/accounts" element={<CompanyAdminAccountsPage />} />
            <Route path="/company-admin/vehicles" element={<CompanyAdminVehiclesPage />} />
            <Route path="/company-admin/profile" element={<AdminProfilePage />} />
            <Route path="/company-admin" element={<Navigate to="/company-admin/dashboard" replace />} />
          </Route>
        </Route>

        {/* Unauthorized page */}
        <Route path="/unauthorized" element={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 16, fontFamily: 'var(--font-family)' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ba1a1a' }}>403</h1>
            <p style={{ color: '#43474e' }}>Bạn không có quyền truy cập trang này.</p>
            <a href="/" style={{ color: '#001f3f', fontWeight: 700 }}>Về trang chủ</a>
          </div>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
