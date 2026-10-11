import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { residentService } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Clock, Filter, PlusCircle, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchRequests = async (p = 0) => {
    setLoading(true);
    try {
      const res = await residentService.getMyRequests(p, 8);
      setRequests(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setError('Failed to load your requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(page);
  }, [page]);

  const filtered = statusFilter ? requests.filter(r => r.status === statusFilter) : requests;

  const statusOptions = ['PENDING', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'COLLECTED', 'CANCELLED'];

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <Clock size={22} className="text-success" /> My Pickup Requests
          </h4>
          <p className="text-muted small mb-0">Track all your waste collection requests</p>
        </div>
        <Link to="/resident/create-pickup" className="btn btn-eco d-inline-flex align-items-center gap-2">
          <PlusCircle size={16} /> New Request
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="custom-card p-3 mb-4 d-flex align-items-center gap-3 flex-wrap">
        <Filter size={16} className="text-muted" />
        <span className="small text-muted fw-semibold">Filter by status:</span>
        <div className="d-flex flex-wrap gap-2">
          <button
            className={`btn btn-sm rounded-pill ${!statusFilter ? 'btn-success' : 'btn-outline-secondary'}`}
            onClick={() => setStatusFilter('')}
          >
            All
          </button>
          {statusOptions.map(s => (
            <button
              key={s}
              className={`btn btn-sm rounded-pill ${statusFilter === s ? 'btn-success' : 'btn-outline-secondary'}`}
              onClick={() => setStatusFilter(s)}
            >
              {s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="alert alert-danger rounded-3">{error}</div>}
      {loading && <LoadingSpinner />}

      {!loading && filtered.length === 0 ? (
        <div className="custom-card p-5 text-center">
          <Clock size={40} className="text-muted mb-3" />
          <h6 className="fw-bold">No requests found</h6>
          <p className="text-muted small">
            {statusFilter ? `No requests with status "${statusFilter}"` : 'You have not submitted any pickup requests yet.'}
          </p>
          <Link to="/resident/create-pickup" className="btn btn-eco btn-sm d-inline-flex align-items-center gap-2">
            <PlusCircle size={16} /> Create Request
          </Link>
        </div>
      ) : !loading && (
        <>
          <div className="row g-3 mb-4">
            {filtered.map(req => (
              <div key={req.id} className="col-12 col-md-6">
                <div className="custom-card p-4 h-100">
                  <div className="d-flex align-items-start justify-content-between mb-3">
                    <div>
                      <span className="badge bg-light text-dark border mb-1">#{req.id}</span>
                      <h6 className="fw-bold mb-0">{req.wasteCategory?.replace(/_/g, ' ')}</h6>
                      <div className="text-muted small mt-1">
                        <i className="bi bi-geo-alt me-1" />
                        {req.locality}
                      </div>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                  <div className="border-top pt-3 d-flex align-items-center justify-content-between">
                    <div className="text-muted small">
                      <i className="bi bi-calendar3 me-1" />
                      {new Date(req.preferredDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                    <Link to={`/resident/my-requests/${req.id}`} className="btn btn-sm btn-eco d-inline-flex align-items-center gap-1">
                      <Eye size={14} /> View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-3">
              <button
                className="btn btn-outline-secondary btn-sm rounded-pill"
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="small text-muted">Page {page + 1} of {totalPages}</span>
              <button
                className="btn btn-outline-secondary btn-sm rounded-pill"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => p + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyRequests;
