import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/api';
import { Truck, Users, CheckCircle2, Clock, BarChart3, ArrowRight, AlertTriangle } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StatCard = ({ icon, label, value, bg, color, to }) => (
  <Link to={to || '#'} className="text-decoration-none">
    <div className="custom-card p-4 d-flex align-items-center gap-3 h-100">
      <div className={`rounded-3 p-3 ${bg}`} style={{ minWidth: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div>
        <div className="text-muted small">{label}</div>
        <div className={`fs-2 fw-bold ${color}`}>{value}</div>
      </div>
    </div>
  </Link>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getDashboardStats();
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Header */}
      <div className="mb-4 p-4 rounded-4 text-white" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)' }}>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div>
            <h2 className="fw-bold mb-1">Admin Operations Overview 👑</h2>
            <p className="mb-0 opacity-75">Monitor and manage all waste collection activities</p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <Link to="/admin/pickup-requests" className="btn btn-light text-primary fw-bold d-inline-flex align-items-center gap-2">
              <Truck size={18} /> Manage Requests
            </Link>
            <Link to="/admin/reports" className="btn btn-outline-light fw-semibold d-inline-flex align-items-center gap-2">
              <BarChart3 size={18} /> Reports
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <StatCard to="/admin/pickup-requests"
            icon={<Truck size={24} className="text-primary" />}
            label="Total Requests"
            value={stats?.totalRequests ?? stats?.totalPickupRequests ?? 0}
            color="text-primary" bg="bg-primary-subtle" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard to="/admin/pickup-requests?status=PENDING"
            icon={<Clock size={24} className="text-warning" />}
            label="Pending"
            value={stats?.pendingCount ?? stats?.pendingRequests ?? 0}
            color="text-warning" bg="bg-warning-subtle" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard to="/admin/pickup-requests?status=IN_PROGRESS"
            icon={<AlertTriangle size={24} className="text-orange" style={{ color: '#f97316' }} />}
            label="In Progress"
            value={(stats?.assignedRequests ?? stats?.assignedCount ?? 0) + (stats?.inProgressRequests ?? stats?.inProgressCount ?? 0)}
            color="" bg="bg-orange-subtle" style={{ color: '#f97316' }} />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard to="/admin/pickup-requests?status=COLLECTED"
            icon={<CheckCircle2 size={24} className="text-success" />}
            label="Collected"
            value={stats?.collectedCount ?? stats?.completedRequests ?? 0}
            color="text-success" bg="bg-success-subtle" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard to="/admin/users"
            icon={<Users size={24} className="text-info" />}
            label="Total Workers"
            value={stats?.totalWorkers ?? 0}
            color="text-info" bg="bg-info-subtle" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard to="/admin/users?role=WORKER"
            icon={<Truck size={24} className="text-secondary" />}
            label="Active Workers"
            value={stats?.activeWorkers ?? stats?.totalActiveWorkers ?? 0}
            color="text-secondary" bg="bg-secondary-subtle" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard to="/admin/users?role=RESIDENT"
            icon={<Users size={24} className="text-purple" style={{ color: '#8b5cf6' }} />}
            label="Residents"
            value={stats?.totalResidents ?? 0}
            color="" bg="bg-purple-subtle" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard
            icon={<BarChart3 size={24} className="text-danger" />}
            label="Cancelled"
            value={stats?.cancelledRequests ?? stats?.cancelledCount ?? 0}
            color="text-danger" bg="bg-danger-subtle" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row g-4">
        <div className="col-md-4">
          <div className="custom-card p-4 h-100">
            <h6 className="fw-bold mb-3">⚡ Quick Actions</h6>
            <div className="d-flex flex-column gap-2">
              <Link to="/admin/pickup-requests" className="btn btn-outline-primary d-flex align-items-center gap-2">
                <Truck size={16} /> Manage Pickup Requests
              </Link>
              <Link to="/admin/workers" className="btn btn-outline-success d-flex align-items-center gap-2">
                <Users size={16} /> Create New Worker
              </Link>
              <Link to="/admin/users" className="btn btn-outline-info d-flex align-items-center gap-2">
                <Users size={16} /> View All Users
              </Link>
              <Link to="/admin/reports" className="btn btn-outline-warning d-flex align-items-center gap-2">
                <BarChart3 size={16} /> View Reports
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="custom-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h6 className="fw-bold mb-0">📊 Request Status Breakdown</h6>
            </div>
            <div className="row g-3">
              {[
                { label: 'Pending', count: stats?.pendingCount ?? 0, color: '#f59e0b', bg: '#fef3c7' },
                { label: 'Assigned', count: stats?.assignedCount ?? 0, color: '#0284c7', bg: '#e0f2fe' },
                { label: 'Accepted', count: stats?.acceptedCount ?? 0, color: '#7c3aed', bg: '#ede9fe' },
                { label: 'In Progress', count: stats?.inProgressCount ?? 0, color: '#c2410c', bg: '#ffedd5' },
                { label: 'Collected', count: stats?.collectedCount ?? 0, color: '#047857', bg: '#d1fae5' },
                { label: 'Cancelled', count: stats?.cancelledCount ?? 0, color: '#b91c1c', bg: '#fee2e2' },
              ].map(item => {
                const total = stats?.totalRequests || 1;
                const pct = Math.round((item.count / total) * 100);
                return (
                  <div key={item.label} className="col-12">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="small fw-semibold" style={{ color: item.color }}>{item.label}</span>
                      <span className="small text-muted">{item.count} ({pct}%)</span>
                    </div>
                    <div className="progress rounded-pill" style={{ height: 8 }}>
                      <div
                        className="progress-bar rounded-pill"
                        style={{ width: `${pct}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
