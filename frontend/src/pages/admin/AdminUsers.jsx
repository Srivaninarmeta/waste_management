import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Users, Filter, ChevronLeft, ChevronRight, ToggleLeft, ToggleRight, CheckCircle, AlertCircle } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ role: '', active: '' });
  const [notification, setNotification] = useState('');
  const [notifType, setNotifType] = useState('success');

  const fetchUsers = async (p = 0) => {
    setLoading(true);
    try {
      const res = await adminService.getAllUsers({ ...filters, page: p, size: 10 });
      setUsers(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page, filters.role, filters.active]);

  const handleToggleStatus = async (userId, currentActive) => {
    try {
      await adminService.updateUserStatus(userId, !currentActive);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, active: !currentActive } : u));
      setNotification(`User ${currentActive ? 'deactivated' : 'activated'} successfully.`);
      setNotifType('success');
    } catch (err) {
      setNotification('Failed to update user status.');
      setNotifType('danger');
    }
  };

  const roleOptions = ['ADMIN', 'WORKER', 'RESIDENT'];

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <Users size={22} className="text-info" /> User Directory
          </h4>
          <p className="text-muted small mb-0">Manage all registered users in the system</p>
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
      <div className="custom-card p-3 mb-4 d-flex align-items-center gap-3 flex-wrap">
        <Filter size={16} className="text-muted" />
        <div className="d-flex gap-2 flex-wrap">
          <select className="form-select form-select-sm" style={{ width: 'auto' }} value={filters.role}
            onChange={e => { setFilters(prev => ({ ...prev, role: e.target.value })); setPage(0); }}>
            <option value="">All Roles</option>
            {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select className="form-select form-select-sm" style={{ width: 'auto' }} value={filters.active}
            onChange={e => { setFilters(prev => ({ ...prev, active: e.target.value })); setPage(0); }}>
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <button className="btn btn-sm btn-outline-secondary"
            onClick={() => { setFilters({ role: '', active: '' }); setPage(0); }}>
            Clear
          </button>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          {users.length === 0 ? (
            <div className="custom-card p-5 text-center">
              <Users size={40} className="text-muted mb-3" />
              <h6 className="fw-bold">No users found</h6>
            </div>
          ) : (
            <div className="custom-card p-0 overflow-hidden">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="px-4 py-3 small text-muted fw-semibold">ID</th>
                      <th className="py-3 small text-muted fw-semibold">Name</th>
                      <th className="py-3 small text-muted fw-semibold">Email</th>
                      <th className="py-3 small text-muted fw-semibold">Phone</th>
                      <th className="py-3 small text-muted fw-semibold">Locality</th>
                      <th className="py-3 small text-muted fw-semibold">Role</th>
                      <th className="py-3 small text-muted fw-semibold">Status</th>
                      <th className="py-3 small text-muted fw-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td className="px-4"><span className="badge bg-light text-dark border">#{u.id}</span></td>
                        <td className="fw-semibold small">{u.fullName}</td>
                        <td className="small text-muted">{u.email}</td>
                        <td className="small text-muted">{u.phone || '—'}</td>
                        <td className="small text-muted">{u.locality || '—'}</td>
                        <td>
                          <span className={`badge rounded-pill ${
                            u.role === 'ADMIN' ? 'bg-danger-subtle text-danger' :
                            u.role === 'WORKER' ? 'bg-primary-subtle text-primary' :
                            'bg-success-subtle text-success'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <span className={`badge rounded-pill ${u.active ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                            {u.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          {u.role !== 'ADMIN' && (
                            <button
                              id={`toggle-user-${u.id}`}
                              className={`btn btn-sm rounded-pill d-inline-flex align-items-center gap-1 ${u.active ? 'btn-outline-danger' : 'btn-outline-success'}`}
                              onClick={() => handleToggleStatus(u.id, u.active)}
                              title={u.active ? 'Deactivate' : 'Activate'}
                            >
                              {u.active ? <><ToggleRight size={14} /> Deactivate</> : <><ToggleLeft size={14} /> Activate</>}
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
    </div>
  );
};

export default AdminUsers;
