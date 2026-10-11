import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  Clock,
  User,
  Truck,
  CheckCircle2,
  Users,
  UserPlus,
  BarChart3,
  LogOut,
  Recycle
} from 'lucide-react';

const Sidebar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinks = () => {
    switch (role) {
      case 'RESIDENT':
        return [
          { to: '/resident/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/resident/create-pickup', label: 'Request Pickup', icon: PlusCircle },
          { to: '/resident/my-requests', label: 'My Requests', icon: Clock },
          { to: '/resident/profile', label: 'Profile', icon: User },
        ];
      case 'WORKER':
        return [
          { to: '/worker/dashboard', label: 'Worker Dashboard', icon: LayoutDashboard },
          { to: '/worker/tasks', label: 'Assigned Tasks', icon: Truck },
          { to: '/worker/history', label: 'Collection History', icon: CheckCircle2 },
        ];
      case 'ADMIN':
        return [
          { to: '/admin/dashboard', label: 'Operations Overview', icon: LayoutDashboard },
          { to: '/admin/pickup-requests', label: 'All Pickup Requests', icon: Truck },
          { to: '/admin/users', label: 'User Directory', icon: Users },
          { to: '/admin/workers', label: 'Create Worker', icon: UserPlus },
          { to: '/admin/reports', label: 'Reports & Export', icon: BarChart3 },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside className="d-flex flex-column flex-shrink-0 p-3 text-white" style={{ width: '260px', minHeight: '100vh', backgroundColor: '#064e3b' }}>
      <div className="d-flex align-items-center gap-2 mb-4 px-2 text-white text-decoration-none">
        <div className="bg-white text-success p-2 rounded-3 d-flex align-items-center justify-content-center shadow-sm">
          <Recycle size={22} />
        </div>
        <div>
          <div className="fs-5 fw-bold tracking-tight">SmartWaste</div>
          <div className="small text-white-50" style={{ fontSize: '0.75rem' }}>{role} PORTAL</div>
        </div>
      </div>

      <hr className="my-2 border-white-50 opacity-25" />

      <ul className="nav nav-pills flex-column mb-auto mt-3 gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <li className="nav-item" key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 fw-medium transition-all ${
                    isActive
                      ? 'bg-success text-white shadow-sm fw-bold'
                      : 'text-white-50 hover-light'
                  }`
                }
                style={({ isActive }) => ({
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.75)',
                  backgroundColor: isActive ? '#10b981' : 'transparent',
                })}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>

      <hr className="my-3 border-white-50 opacity-25" />

      {/* User Info & Logout Button */}
      <div className="p-2 bg-black bg-opacity-25 rounded-3 mb-2">
        <div className="fw-semibold text-truncate small">{user?.fullName}</div>
        <div className="text-white-50 text-truncate" style={{ fontSize: '0.75rem' }}>{user?.email}</div>
        <div className="mt-1">
          <span className="badge bg-success-subtle text-white rounded-pill px-2 py-0.5" style={{ fontSize: '0.65rem' }}>
            {user?.locality || 'Zone Active'}
          </span>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="btn btn-outline-light border-0 text-white-50 hover-danger d-flex align-items-center gap-2 w-100 px-3 py-2 rounded-3 text-start mt-1"
        style={{ fontSize: '0.9rem' }}
      >
        <LogOut size={16} />
        <span>Sign Out</span>
      </button>
    </aside>
  );
};

export default Sidebar;
