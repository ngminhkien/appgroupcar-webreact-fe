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
  PendingVehiclesPage
} from '@/features/system-admin';
import { PublicLayout } from '@/components/PublicLayout';
import { AuthLayout } from '@/components/AuthLayout';
import { AdminSysLayout } from '@/components/AdminSysLayout';
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
            <Route path="/admin/drivers" element={<div style={{ padding: 40 }}>Tài xế (Quản lý)</div>} />
            <Route path="/admin/drivers/pending" element={<PendingDriversPage />} />
            <Route path="/admin/vehicles" element={<div style={{ padding: 40 }}>Phương tiện (Quản lý)</div>} />
            <Route path="/admin/vehicles/pending" element={<PendingVehiclesPage />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
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
