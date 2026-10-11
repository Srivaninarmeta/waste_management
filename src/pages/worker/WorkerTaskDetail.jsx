import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workerService } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ArrowLeft, MapPin, Calendar, User, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';

const STATUS_TRANSITIONS = {
  ASSIGNED: [{ value: 'ACCEPTED', label: '✅ Accept Task', color: 'success' }],
  ACCEPTED: [{ value: 'IN_PROGRESS', label: '🚛 Start Collection', color: 'warning' }],
  IN_PROGRESS: [{ value: 'COLLECTED', label: '✅ Mark as Collected', color: 'success' }],
};

const WorkerTaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await workerService.getTaskById(id);
        setTask(res.data);
      } catch (err) {
        setError('Task not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    setError('');
    setSuccess('');
    try {
      const res = await workerService.updateTaskStatus(id, { status: newStatus, note });
      setTask(res.data);
      setNote('');
      setSuccess(`Status updated to ${newStatus.replace(/_/g, ' ')}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!task && error) return (
    <div className="text-center py-5">
      <AlertCircle size={40} className="text-danger mb-3" />
      <p className="text-danger">{error}</p>
      <button className="btn btn-eco" onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );

  const transitions = STATUS_TRANSITIONS[task?.status] || [];

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <button className="btn btn-light btn-sm rounded-3" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h4 className="fw-bold mb-0">Task #{task?.id}</h4>
          <p className="text-muted small mb-0">Pickup Task Details</p>
        </div>
        <div className="ms-auto">
          <StatusBadge status={task?.status} />
        </div>
      </div>

      {success && (
        <div className="alert alert-success d-flex align-items-center gap-2 rounded-3 mb-4">
          <CheckCircle size={16} /> <small>{success}</small>
        </div>
      )}
      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 mb-4">
          <AlertCircle size={16} /> <small>{error}</small>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-8">
          {/* Task Details */}
          <div className="custom-card p-4 mb-4">
            <h6 className="fw-bold border-bottom pb-3 mb-4">Task Information</h6>
            <div className="row g-3">
              <div className="col-sm-6">
                <div className="small text-muted fw-semibold mb-1">Waste Category</div>
                <div className="fw-bold">{task?.wasteCategory?.replace(/_/g, ' ')}</div>
              </div>
              <div className="col-sm-6">
                <div className="d-flex align-items-center gap-1 small text-muted fw-semibold mb-1">
                  <Calendar size={14} /> Preferred Date
                </div>
                <div className="fw-bold">
                  {new Date(task?.preferredDate).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
              </div>
              <div className="col-12">
                <div className="d-flex align-items-center gap-1 small text-muted fw-semibold mb-1">
                  <MapPin size={14} /> Pickup Address
                </div>
                <div className="fw-medium">{task?.address}</div>
                <div className="text-muted small">{task?.locality}</div>
              </div>
              {task?.estimatedQuantity && (
                <div className="col-sm-6">
                  <div className="small text-muted fw-semibold mb-1">Estimated Quantity</div>
                  <div>{task.estimatedQuantity}</div>
                </div>
              )}
              {task?.description && (
                <div className="col-12">
                  <div className="small text-muted fw-semibold mb-1">Special Instructions</div>
                  <div className="bg-warning-subtle rounded-3 p-3 small border border-warning-subtle">{task.description}</div>
                </div>
              )}
            </div>
          </div>

          {/* Resident Info */}
          {task?.resident && (
            <div className="custom-card p-4 mb-4">
              <h6 className="fw-bold border-bottom pb-3 mb-4">Resident Information</h6>
              <div className="d-flex align-items-center gap-3">
                <div className="bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                  <User size={22} className="text-primary" />
                </div>
                <div>
                  <div className="fw-bold">{task.resident.fullName}</div>
                  <div className="text-muted small">{task.resident.email}</div>
                  {task.resident.phone && <div className="text-muted small">📞 {task.resident.phone}</div>}
                </div>
              </div>
            </div>
          )}

          {/* Status History */}
          {task?.statusHistory && task.statusHistory.length > 0 && (
            <div className="custom-card p-4">
              <h6 className="fw-bold border-bottom pb-3 mb-4">Status History</h6>
              <div className="timeline">
                {task.statusHistory.map((h, i) => (
                  <div key={i} className={`timeline-item ${i === 0 ? 'active' : ''}`}>
                    <div className="fw-semibold small">{h.status?.replace(/_/g, ' ')}</div>
                    <div className="text-muted" style={{ fontSize: '0.78rem' }}>
                      {new Date(h.changedAt).toLocaleString('en-IN')}
                    </div>
                    {h.note && <div className="text-muted small fst-italic">"{h.note}"</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-lg-4">
          {/* Update Status */}
          {transitions.length > 0 && (
            <div className="custom-card p-4 mb-4">
              <h6 className="fw-bold mb-3">Update Status</h6>
              <div className="mb-3">
                <label htmlFor="worker-note" className="form-label small text-muted fw-semibold">
                  <MessageSquare size={14} className="me-1" /> Add a note (optional)
                </label>
                <textarea
                  id="worker-note"
                  className="form-control"
                  rows="3"
                  placeholder="e.g., Reached location, accessing compound..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                />
              </div>
              {transitions.map(t => (
                <button
                  key={t.value}
                  id={`update-status-${t.value.toLowerCase()}`}
                  className={`btn btn-${t.color} w-100 mb-2 d-flex align-items-center justify-content-center gap-2`}
                  onClick={() => handleStatusUpdate(t.value)}
                  disabled={updating}
                >
                  {updating ? <span className="spinner-border spinner-border-sm" /> : t.label}
                </button>
              ))}
            </div>
          )}

          {task?.status === 'COLLECTED' && (
            <div className="custom-card p-4 text-center mb-4">
              <CheckCircle size={40} className="text-success mb-2" />
              <h6 className="fw-bold text-success">Collection Complete!</h6>
              <p className="text-muted small mb-0">This task has been successfully completed.</p>
            </div>
          )}

          <div className="custom-card p-4">
            <div className="small text-muted mb-1">Submitted On</div>
            <div className="small fw-semibold">
              {new Date(task?.createdAt).toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerTaskDetail;
