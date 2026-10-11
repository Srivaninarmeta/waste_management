import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, Bell, LogOut, Recycle } from 'lucide-react';

const DashboardLayout = () => {
  const { user, role, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Desktop Sidebar */}
      <div className="d-none d-lg-block sticky-top" style={{ height: '100vh', overflowY: 'auto' }}>
        <Sidebar />
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 z-3 d-lg-none"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`position-fixed top-0 start-0 h-100 z-3 d-lg-none transition-all ${
          mobileSidebarOpen ? 'translate-middle-x-0' : 'translate-middle-x'
        }`}
        style={{
          transform: mobileSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column min-vh-100" style={{ maxWidth: '100%', overflowX: 'hidden' }}>
        {/* Top Header */}
        <header className="bg-white border-bottom py-3 px-4 d-flex align-items-center justify-content-between sticky-top z-2 shadow-sm">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-light d-lg-none p-2 rounded-3 shadow-none border"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            >
              {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-bold">
                {role} CONSOLE
              </span>
              <span className="text-muted d-none d-sm-inline small">
                | Welcome, <strong className="text-dark">{user?.fullName}</strong>
              </span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="text-end d-none d-md-block">
              <div className="fw-semibold small text-dark">{user?.locality}</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>{user?.email}</div>
            </div>

            <div className="dropdown">
              <button
                className="btn btn-light rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center border"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <User size={18} className="text-success" />
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-2">
                <li className="px-3 py-2 border-bottom">
                  <div className="fw-bold">{user?.fullName}</div>
                  <div className="small text-muted">{user?.email}</div>
                </li>
                {role === 'RESIDENT' && (
                  <li>
                    <Link className="dropdown-item py-2" to="/resident/profile">
                      <i className="bi bi-person me-2"></i>Edit Profile
                    </Link>
                  </li>
                )}
                <li>
                  <button className="dropdown-item py-2 text-danger d-flex align-items-center gap-2" onClick={handleLogout}>
                    <LogOut size={16} /> Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-3 p-md-4 flex-grow-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
