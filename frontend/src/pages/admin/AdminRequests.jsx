import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmModal from '../../components/common/ConfirmModal';
import { Truck, Filter, Search, UserCheck, ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ status: '', category: '', locality: '', search: '' });
  const [assignModal, setAssignModal] = useState(null); // { requestId, selectedWorker }
  const [assigning, setAssigning] = useState(false);
  const [notification, setNotification] = useState('');
  const [notifType, setNotifType] = useState('success');

  const statusOptions = ['PENDING', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'COLLECTED', 'CANCELLED'];
  const categoryOptions = ['GENERAL', 'RECYCLABLE', 'ORGANIC', 'E_WASTE', 'HAZARDOUS', 'CONSTRUCTION'];

  const fetchRequests = async (p = 0) => {
    setLoading(true);
    try {
      const res = await adminService.getAllRequests({ ...filters, page: p, size: 10 });
      setRequests(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkers = async () => {
    try {
      const res = await adminService.getActiveWorkers();
      setWorkers(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests(page);
  }, [page, filters.status]);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchRequests(0);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(0);
  };

  const handleAssign = async () => {
    if (!assignModal?.selectedWorker) {
      setNotification('Please select a worker.');
      setNotifType('danger');
      return;
    }
    setAssigning(true);
    try {
      await adminService.assignWorker(assignModal.requestId, { workerId: assignModal.selectedWorker });
      setNotification('Worker assigned successfully!');
      setNotifType('success');
      setAssignModal(null);
      fetchRequests(page);
    } catch (err) {
      setNotification(err.response?.data?.message || 'Failed to assign worker.');
      setNotifType('danger');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <Truck size={22} className="text-primary" /> All Pickup Requests
          </h4>
          <p className="text-muted small mb-0">Manage and assign workers to requests</p>
        </div>
      </div>

      {notification && (
        <div className={`alert alert-${notifType} d-flex align-items-center gap-2 rounded-3 mb-3`}>
          {notifType === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <small>{notification}</small>
          <button className="btn-close ms-auto btn-sm" onClick={() => setNotification('')} />
        </div>
      )}

      {/* Filters */}
      <div className="custom-card p-3 mb-4">
        <div className="row g-2 align-items-end">
          <div className="col-sm-6 col-md-3">
            <label className="form-label small fw-semibold mb-1">Status</label>
            <select className="form-select form-select-sm" value={filters.status}
              onChange={e => handleFilterChange('status', e.target.value)}>
              <option value="">All Statuses</option>
              {statusOptions.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div className="col-sm-6 col-md-3">
            <label className="form-label small fw-semibold mb-1">Category</label>
            <select className="form-select form-select-sm" value={filters.category}
              onChange={e => handleFilterChange('category', e.target.value)}>
              <option value="">All Categories</option>
              {categoryOptions.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-semibold mb-1">Search</label>
            <form onSubmit={handleSearch} className="d-flex gap-2">
              <input type="text" className="form-control form-control-sm" placeholder="Locality, resident..."
                value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} />
              <button type="submit" className="btn btn-sm btn-primary d-flex align-items-center gap-1">
                <Search size={14} />
              </button>
            </form>
          </div>
          <div className="col-md-2">
            <button className="btn btn-sm btn-outline-secondary w-100"
              onClick={() => { setFilters({ status: '', category: '', locality: '', search: '' }); setPage(0); }}>
              Clear
            </button>
          </div>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          {requests.length === 0 ? (
            <div className="custom-card p-5 text-center">
              <Truck size={40} className="text-muted mb-3" />
              <h6 className="fw-bold">No requests found</h6>
              <p className="text-muted small">Try adjusting filters.</p>
            </div>
          ) : (
            <div className="custom-card p-0 overflow-hidden">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="px-4 py-3 small text-muted fw-semibold">ID</th>
                      <th className="py-3 small text-muted fw-semibold">Resident</th>
                      <th className="py-3 small text-muted fw-semibold">Category</th>
                      <th className="py-3 small text-muted fw-semibold">Locality</th>
                      <th className="py-3 small text-muted fw-semibold">Date</th>
                      <th className="py-3 small text-muted fw-semibold">Status</th>
                      <th className="py-3 small text-muted fw-semibold">Worker</th>
                      <th className="py-3 small text-muted fw-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map(req => (
                      <tr key={req.id}>
                        <td className="px-4"><span className="badge bg-light text-dark border">#{req.id}</span></td>
                        <td className="small fw-medium">{req.residentName}</td>
                        <td className="small">{req.wasteCategory?.replace(/_/g, ' ')}</td>
                        <td className="small text-muted">{req.locality}</td>
                        <td className="small text-muted">
                          {new Date(req.preferredDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </td>
                        <td><StatusBadge status={req.status} /></td>
                        <td className="small text-muted">{req.assignedWorkerName || '—'}</td>
                        <td>
                          {['PENDING', 'ASSIGNED'].includes(req.status) && (
                            <button
                              id={`assign-worker-${req.id}`}
                              className="btn btn-sm btn-outline-primary rounded-pill d-inline-flex align-items-center gap-1"
                              onClick={() => setAssignModal({ requestId: req.id, selectedWorker: '' })}
                            >
                              <UserCheck size={14} /> Assign
                            </button>
                          )}
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

      {/* Assign Worker Modal */}
      {assignModal && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  <UserCheck size={20} className="text-primary me-2" /> Assign Worker
                </h5>
                <button className="btn-close" onClick={() => setAssignModal(null)} />
              </div>
              <div className="modal-body pt-3">
                <p className="text-muted small mb-3">Select a worker to assign to Request #{assignModal.requestId}:</p>
                {workers.length === 0 ? (
                  <div className="alert alert-warning small">No active workers available.</div>
                ) : (
                  <div className="list-group">
                    {workers.map(w => (
                      <label key={w.id} className="list-group-item list-group-item-action d-flex align-items-center gap-3 cursor-pointer"
                        style={{ cursor: 'pointer' }}>
                        <input type="radio" name="worker" value={w.id}
                          checked={assignModal.selectedWorker === w.id}
                          onChange={() => setAssignModal(prev => ({ ...prev, selectedWorker: w.id }))} />
                        <div>
                          <div className="fw-semibold">{w.fullName}</div>
                          <div className="text-muted small">{w.email} • {w.locality}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-outline-secondary" onClick={() => setAssignModal(null)}>Cancel</button>
                <button
                  id="confirm-assign-btn"
                  className="btn btn-primary d-inline-flex align-items-center gap-2"
                  onClick={handleAssign}
                  disabled={assigning || !assignModal.selectedWorker}
                >
                  {assigning ? <span className="spinner-border spinner-border-sm" /> : <UserCheck size={16} />}
                  Assign Worker
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequests;
