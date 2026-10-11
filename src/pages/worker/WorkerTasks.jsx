import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { workerService } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Truck, Filter, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

const WorkerTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchTasks = async (p = 0, status = '') => {
    setLoading(true);
    try {
      const res = await workerService.getAssignedTasks(status, p, 8);
      setTasks(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(page, statusFilter);
  }, [page, statusFilter]);

  const statusOptions = ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'];

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <Truck size={22} className="text-primary" /> Assigned Tasks
          </h4>
          <p className="text-muted small mb-0">All pickup requests assigned to you</p>
        </div>
      </div>

      {/* Filter */}
      <div className="custom-card p-3 mb-4 d-flex align-items-center gap-3 flex-wrap">
        <Filter size={16} className="text-muted" />
        <span className="small text-muted fw-semibold">Filter by status:</span>
        <div className="d-flex flex-wrap gap-2">
          <button
            className={`btn btn-sm rounded-pill ${!statusFilter ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => { setStatusFilter(''); setPage(0); }}
          >All Active</button>
          {statusOptions.map(s => (
            <button
              key={s}
              className={`btn btn-sm rounded-pill ${statusFilter === s ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => { setStatusFilter(s); setPage(0); }}
            >
              {s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          {tasks.length === 0 ? (
            <div className="custom-card p-5 text-center">
              <Truck size={40} className="text-muted mb-3" />
              <h6 className="fw-bold">No tasks found</h6>
              <p className="text-muted small">No tasks match the selected filter.</p>
            </div>
          ) : (
            <div className="custom-card p-0 overflow-hidden">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="px-4 py-3 small text-muted fw-semibold">ID</th>
                      <th className="py-3 small text-muted fw-semibold">Category</th>
                      <th className="py-3 small text-muted fw-semibold">Resident</th>
                      <th className="py-3 small text-muted fw-semibold">Location</th>
                      <th className="py-3 small text-muted fw-semibold">Pickup Date</th>
                      <th className="py-3 small text-muted fw-semibold">Status</th>
                      <th className="py-3 small text-muted fw-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map(task => (
                      <tr key={task.id}>
                        <td className="px-4"><span className="badge bg-light text-dark border">#{task.id}</span></td>
                        <td className="fw-medium">{task.wasteCategory?.replace(/_/g, ' ')}</td>
                        <td className="small">{task.residentName}</td>
                        <td className="text-muted small">{task.locality}</td>
                        <td className="text-muted small">
                          {new Date(task.preferredDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
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
            </div>
          )}

          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
              <button className="btn btn-outline-secondary btn-sm rounded-pill" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft size={16} />
              </button>
              <span className="small text-muted">Page {page + 1} of {totalPages}</span>
              <button className="btn btn-outline-secondary btn-sm rounded-pill" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WorkerTasks;
