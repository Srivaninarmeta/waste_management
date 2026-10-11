import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import AboutPage from './pages/public/AboutPage';

// Resident Pages
import ResidentDashboard from './pages/resident/ResidentDashboard';
import CreatePickup from './pages/resident/CreatePickup';
import MyRequests from './pages/resident/MyRequests';
import RequestDetail from './pages/resident/RequestDetail';
import ResidentProfile from './pages/resident/ResidentProfile';

// Worker Pages
import WorkerDashboard from './pages/worker/WorkerDashboard';
import WorkerTasks from './pages/worker/WorkerTasks';
import WorkerTaskDetail from './pages/worker/WorkerTaskDetail';
import WorkerHistory from './pages/worker/WorkerHistory';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRequests from './pages/admin/AdminRequests';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCreateWorker from './pages/admin/AdminCreateWorker';
import AdminReports from './pages/admin/AdminReports';

import LoadingSpinner from './components/common/LoadingSpinner';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to appropriate dashboard
    if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'WORKER') return <Navigate to="/worker/dashboard" replace />;
    return <Navigate to="/resident/dashboard" replace />;
  }
  return children;
};

// Public Only Route (redirect if already logged in)
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, role, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (isAuthenticated) {
    if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'WORKER') return <Navigate to="/worker/dashboard" replace />;
    return <Navigate to="/resident/dashboard" replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
      </Route>

      {/* Resident Routes */}
      <Route
        path="/resident"
        element={
          <ProtectedRoute allowedRoles={['RESIDENT']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/resident/dashboard" replace />} />
        <Route path="dashboard" element={<ResidentDashboard />} />
        <Route path="create-pickup" element={<CreatePickup />} />
        <Route path="my-requests" element={<MyRequests />} />
        <Route path="my-requests/:id" element={<RequestDetail />} />
        <Route path="profile" element={<ResidentProfile />} />
      </Route>

      {/* Worker Routes */}
      <Route
        path="/worker"
        element={
          <ProtectedRoute allowedRoles={['WORKER']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/worker/dashboard" replace />} />
        <Route path="dashboard" element={<WorkerDashboard />} />
        <Route path="tasks" element={<WorkerTasks />} />
        <Route path="tasks/:id" element={<WorkerTaskDetail />} />
        <Route path="history" element={<WorkerHistory />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="pickup-requests" element={<AdminRequests />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="workers" element={<AdminCreateWorker />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      {/* Catch All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
