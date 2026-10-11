import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { workerService } from '../../services/api';
import { Truck, CheckCircle2, Clock, BarChart3, ArrowRight, Eye } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StatCard = ({ icon, label, value, bg, color }) => (
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

const WorkerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, tasksRes] = await Promise.all([
          workerService.getWorkerStats(),
          workerService.getAssignedTasks('', 0, 5),
        ]);
        setStats(statsRes.data);
        setTasks(tasksRes.data.content || []);
      } catch (err) {
        console.error('Failed to load worker dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Header */}
      <div className="mb-4 p-4 rounded-4 text-white" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)' }}>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div>
            <h2 className="fw-bold mb-1">Worker Dashboard 🚛</h2>
            <p className="mb-0 opacity-75">
              Welcome, <strong>{user?.fullName}</strong> • {user?.locality}
            </p>
          </div>
          <Link to="/worker/tasks" id="view-tasks-btn" className="btn btn-light text-primary fw-bold d-inline-flex align-items-center gap-2">
            <Truck size={18} /> View All Tasks
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <StatCard icon={<Truck size={22} className="text-primary" />} label="Total Assigned" value={stats?.totalAssigned ?? 0} color="text-primary" bg="bg-primary-subtle" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard icon={<Clock size={22} className="text-warning" />} label="Pending/Active" value={stats?.activeCount ?? 0} color="text-warning" bg="bg-warning-subtle" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard icon={<CheckCircle2 size={22} className="text-success" />} label="Collected Today" value={stats?.collectedToday ?? 0} color="text-success" bg="bg-success-subtle" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard icon={<BarChart3 size={22} className="text-info" />} label="Total Collected" value={stats?.totalCollected ?? 0} color="text-info" bg="bg-info-subtle" />
        </div>
      </div>

      {/* Active Tasks */}
      <div className="custom-card p-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h5 className="fw-bold mb-0">Assigned Tasks</h5>
          <Link to="/worker/tasks" className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-5">
            <div className="bg-primary-subtle rounded-3 d-inline-flex p-4 mb-3">
              <Truck size={40} className="text-primary" />
            </div>
            <h6 className="fw-bold mb-2">No active tasks</h6>
            <p className="text-muted small">You have no assigned pickup tasks at the moment.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="small text-muted fw-semibold">ID</th>
                  <th className="small text-muted fw-semibold">Category</th>
                  <th className="small text-muted fw-semibold">Location</th>
                  <th className="small text-muted fw-semibold">Date</th>
                  <th className="small text-muted fw-semibold">Status</th>
                  <th className="small text-muted fw-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id}>
                    <td><span className="badge bg-light text-dark border">#{task.id}</span></td>
                    <td className="fw-medium">{task.wasteCategory?.replace(/_/g, ' ')}</td>
                    <td className="text-muted small">{task.locality}</td>
                    <td className="text-muted small">{new Date(task.preferredDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                    <td><StatusBadge status={task.status} /></td>
                    <td>
                      <Link to={`/worker/tasks/${task.id}`} className="btn btn-sm btn-outline-primary rounded-pill d-inline-flex align-items-center gap-1">
                        <Eye size={14} /> View
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

export default WorkerDashboard;
