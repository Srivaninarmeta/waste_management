import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { residentService } from '../../services/api';
import { PlusCircle, Clock, CheckCircle2, XCircle, Truck, Recycle, ArrowRight } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StatCard = ({ icon, label, value, color, bg }) => (
  <div className="custom-card p-4 d-flex align-items-center gap-3">
    <div className={`rounded-3 p-3 ${bg}`} style={{ minWidth: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icon}
    </div>
    <div>
      <div className="text-muted small">{label}</div>
      <div className={`fs-2 fw-bold ${color}`}>{value}</div>
    </div>
  </div>
);

const ResidentDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await residentService.getMyRequests(0, 5);
        setRequests(res.data.content || []);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'PENDING').length,
    inProgress: requests.filter(r => ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'].includes(r.status)).length,
    collected: requests.filter(r => r.status === 'COLLECTED').length,
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-4 p-4 rounded-4 text-white" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)' }}>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div>
            <h2 className="fw-bold mb-1">Welcome back, {user?.fullName?.split(' ')[0]}! 👋</h2>
            <p className="mb-0 opacity-75">
              <i className="bi bi-geo-alt me-1" />
              {user?.locality} • {user?.email}
            </p>
          </div>
          <Link to="/resident/create-pickup" id="create-pickup-btn" className="btn btn-light text-success fw-bold d-inline-flex align-items-center gap-2">
            <PlusCircle size={18} /> New Pickup Request
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-danger rounded-3">{error}</div>}

      {/* Stats Row */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <StatCard icon={<Recycle size={22} className="text-primary" />} label="Total Requests" value={stats.total} color="text-primary" bg="bg-primary-subtle" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard icon={<Clock size={22} className="text-warning" />} label="Pending" value={stats.pending} color="text-warning" bg="bg-warning-subtle" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard icon={<Truck size={22} className="text-info" />} label="In Progress" value={stats.inProgress} color="text-info" bg="bg-info-subtle" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard icon={<CheckCircle2 size={22} className="text-success" />} label="Collected" value={stats.collected} color="text-success" bg="bg-success-subtle" />
        </div>
      </div>

      {/* Recent Requests */}
      <div className="custom-card p-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h5 className="fw-bold mb-0">Recent Pickup Requests</h5>
          <Link to="/resident/my-requests" className="btn btn-sm btn-eco-outline d-inline-flex align-items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-5">
            <div className="bg-success-subtle rounded-3 d-inline-flex p-4 mb-3">
              <Recycle size={40} className="text-success" />
            </div>
            <h6 className="fw-bold mb-2">No requests yet</h6>
            <p className="text-muted small mb-3">Submit your first waste pickup request to get started!</p>
            <Link to="/resident/create-pickup" className="btn btn-eco btn-sm d-inline-flex align-items-center gap-2">
              <PlusCircle size={16} /> Create First Request
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr className="table-light">
                  <th className="small text-muted fw-semibold">ID</th>
                  <th className="small text-muted fw-semibold">Category</th>
                  <th className="small text-muted fw-semibold">Preferred Date</th>
                  <th className="small text-muted fw-semibold">Status</th>
                  <th className="small text-muted fw-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id}>
                    <td><span className="badge bg-light text-dark border">#{req.id}</span></td>
                    <td><span className="fw-medium">{req.wasteCategory?.replace(/_/g, ' ')}</span></td>
                    <td className="text-muted small">{new Date(req.preferredDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td><StatusBadge status={req.status} /></td>
                    <td>
                      <Link to={`/resident/my-requests/${req.id}`} className="btn btn-sm btn-outline-success rounded-pill">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResidentDashboard;
