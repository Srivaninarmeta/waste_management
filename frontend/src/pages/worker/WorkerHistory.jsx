import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { workerService } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CheckCircle2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

const WorkerHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await workerService.getTaskHistory(page, 10);
        setHistory(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [page]);

  return (
    <div>
      <div className="mb-4">
        <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
          <CheckCircle2 size={22} className="text-success" /> Collection History
        </h4>
        <p className="text-muted small mb-0">All completed waste collection records</p>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          {history.length === 0 ? (
            <div className="custom-card p-5 text-center">
              <CheckCircle2 size={40} className="text-muted mb-3" />
              <h6 className="fw-bold">No history yet</h6>
              <p className="text-muted small">Completed collections will appear here.</p>
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
                    {history.map(item => (
                      <tr key={item.id}>
                        <td className="px-4"><span className="badge bg-light text-dark border">#{item.id}</span></td>
                        <td className="fw-medium">{item.wasteCategory?.replace(/_/g, ' ')}</td>
                        <td className="small">{item.residentName}</td>
                        <td className="text-muted small">{item.locality}</td>
                        <td className="text-muted small">
                          {new Date(item.preferredDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td><StatusBadge status={item.status} /></td>
                        <td>
                          <Link to={`/worker/tasks/${item.id}`} className="btn btn-sm btn-outline-secondary rounded-pill d-inline-flex align-items-center gap-1">
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

export default WorkerHistory;
