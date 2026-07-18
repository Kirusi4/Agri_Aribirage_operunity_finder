import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserLayout from './components/user/UserLayout';
import UserDashboard from './pages/user/Dashboard';
import UserMarkets from './pages/user/Markets';
import UserOpportunities from './pages/user/Opportunities';
import PriceCompare from './pages/user/PriceCompare';
import UserProfile from './pages/user/Profile';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminAlerts from './pages/admin/Alerts';

function App() {
  return (
    <Routes>
      {/* Root redirection to Login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* User Routes - Protected */}
      <Route element={<ProtectedRoute />}>
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="markets" element={<UserMarkets />} />
          <Route path="opportunities" element={<UserOpportunities />} />
          <Route path="price-compare" element={<PriceCompare />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>
      </Route>

      {/* Admin Routes - Protected by Admin Role */}
      <Route element={<ProtectedRoute requiredRole="admin" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="alerts" element={<AdminAlerts />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
