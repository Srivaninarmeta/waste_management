import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Recycle, LogIn, UserPlus, LogOut, LayoutDashboard, User } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'WORKER') return '/worker/dashboard';
    return '/resident/dashboard';
  };

  return (
    <nav className="navbar navbar-expand-lg glass-nav sticky-top py-3">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-success fs-4" to="/">
          <div className="bg-success text-white p-2 rounded-3 d-flex align-items-center justify-content-center shadow-sm">
            <Recycle size={22} />
          </div>
          <span className="tracking-tight" style={{ color: '#064e3b' }}>SmartWaste</span>
        </Link>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <Link className="nav-link fw-medium text-secondary" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium text-secondary" to="/about">About System</Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()} className="btn btn-eco d-inline-flex align-items-center gap-2">
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>
                <div className="dropdown ms-2">
                  <button
                    className="btn btn-light rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <User size={18} className="text-success" />
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-2">
                    <li className="px-3 py-2 border-bottom">
                      <div className="fw-bold text-dark">{user?.fullName}</div>
                      <div className="small text-muted">{user?.email}</div>
                      <span className="badge bg-success-subtle text-success rounded-pill mt-1">{role}</span>
                    </li>
                    {role === 'RESIDENT' && (
                      <li>
                        <Link className="dropdown-item py-2" to="/resident/profile">
                          <i className="bi bi-person me-2"></i>My Profile
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
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-secondary rounded-pill px-4 fw-semibold d-inline-flex align-items-center gap-2">
                  <LogIn size={16} /> Login
                </Link>
                <Link to="/register" className="btn btn-eco d-inline-flex align-items-center gap-2">
                  <UserPlus size={16} /> Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
