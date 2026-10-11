import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { residentService } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmModal from '../../components/common/ConfirmModal';
import { ArrowLeft, MapPin, Calendar, FileText, User, Clock, XCircle, AlertCircle } from 'lucide-react';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await residentService.getRequestById(id);
        setRequest(res.data);
      } catch (err) {
        setError('Request not found or you do not have permission to view it.');
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await residentService.cancelRequest(id);
      setRequest(prev => ({ ...prev, status: 'CANCELLED' }));
      setShowCancel(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Cannot cancel this request.');
      setShowCancel(false);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return (
    <div className="text-center py-5">
      <AlertCircle size={40} className="text-danger mb-3" />
      <p className="text-danger">{error}</p>
      <Link to="/resident/my-requests" className="btn btn-eco">Back to My Requests</Link>
    </div>
  );

  const canCancel = ['PENDING', 'ASSIGNED'].includes(request?.status);

  const statusFlow = ['PENDING', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'COLLECTED'];
  const currentIdx = statusFlow.indexOf(request?.status);

  return (
    <div>
      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <button className="btn btn-light btn-sm rounded-3" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h4 className="fw-bold mb-0">Request #{request?.id}</h4>
          <p className="text-muted small mb-0">Pickup Request Details</p>
        </div>
        <div className="ms-auto">
          <StatusBadge status={request?.status} large />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          {/* Main Details Card */}
          <div className="custom-card p-4 mb-4">
            <h6 className="fw-bold border-bottom pb-3 mb-4">Request Information</h6>
            <div className="row g-3">
              <div className="col-sm-6">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <FileText size={16} className="text-success" />
                  <span className="small text-muted fw-semibold">Waste Category</span>
                </div>
                <div className="fw-bold">{request?.wasteCategory?.replace(/_/g, ' ')}</div>
              </div>
              <div className="col-sm-6">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <Calendar size={16} className="text-success" />
                  <span className="small text-muted fw-semibold">Preferred Date</span>
                </div>
                <div className="fw-bold">
                  {new Date(request?.preferredDate).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
              </div>
              <div className="col-12">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <MapPin size={16} className="text-success" />
                  <span className="small text-muted fw-semibold">Pickup Address</span>
                </div>
                <div className="fw-medium">{request?.address}</div>
                <div className="text-muted small">{request?.locality}</div>
              </div>
              {request?.estimatedQuantity && (
                <div className="col-sm-6">
                  <div className="small text-muted fw-semibold mb-1">Estimated Quantity</div>
                  <div>{request.estimatedQuantity}</div>
                </div>
              )}
              {request?.description && (
                <div className="col-12">
                  <div className="small text-muted fw-semibold mb-1">Additional Notes</div>
                  <div className="bg-light rounded-3 p-3 small">{request.description}</div>
                </div>
              )}
            </div>
          </div>

          {/* Assigned Worker */}
          {request?.assignedWorker && (
            <div className="custom-card p-4 mb-4">
              <h6 className="fw-bold border-bottom pb-3 mb-4">Assigned Worker</h6>
              <div className="d-flex align-items-center gap-3">
                <div className="bg-success-subtle rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                  <User size={22} className="text-success" />
                </div>
                <div>
                  <div className="fw-bold">{request.assignedWorker.fullName}</div>
                  <div className="text-muted small">{request.assignedWorker.email}</div>
                  <div className="text-muted small">{request.assignedWorker.locality}</div>
                </div>
              </div>
            </div>
          )}

          {/* Status History Timeline */}
          {((request?.statusHistories && request.statusHistories.length > 0) || (request?.statusHistory && request.statusHistory.length > 0)) && (
            <div className="custom-card p-4">
              <h6 className="fw-bold border-bottom pb-3 mb-4">
                <Clock size={18} className="text-success me-2" />Status Timeline
              </h6>
              <div className="timeline">
                {(request.statusHistories || request.statusHistory || []).map((h, i) => (
                  <div key={i} className={`timeline-item ${i === 0 ? 'active' : ''}`}>
                    <div className="fw-semibold small">{(h.newStatus || h.status)?.replace(/_/g, ' ')}</div>
                    <div className="text-muted" style={{ fontSize: '0.78rem' }}>
                      {h.changedAt ? new Date(h.changedAt).toLocaleString('en-IN') : 'Recent'}
                      {(h.changedByUserName || h.changedBy) && ` • ${h.changedByUserName || h.changedBy}`}
                    </div>
                    {(h.notes || h.note) && <div className="text-muted small mt-1 fst-italic">"{h.notes || h.note}"</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-lg-4">
          {/* Status Progress */}
          <div className="custom-card p-4 mb-4">
            <h6 className="fw-bold mb-4">Collection Progress</h6>
            {request?.status === 'CANCELLED' ? (
              <div className="text-center py-3">
                <XCircle size={32} className="text-danger mb-2" />
                <div className="text-danger fw-semibold">Request Cancelled</div>
              </div>
            ) : (
              statusFlow.map((s, i) => (
                <div key={s} className="d-flex align-items-center gap-3 mb-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: 28, height: 28,
                      backgroundColor: i <= currentIdx ? '#10b981' : '#e2e8f0',
                      color: i <= currentIdx ? 'white' : '#94a3b8',
                    }}
                  >
                    {i <= currentIdx ? '✓' : i + 1}
                  </div>
                  <div className={`small fw-semibold ${i === currentIdx ? 'text-success' : i < currentIdx ? 'text-muted text-decoration-line-through' : 'text-muted'}`}>
                    {s.replace(/_/g, ' ')}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Actions */}
          {canCancel && (
            <div className="custom-card p-4">
              <h6 className="fw-bold mb-3">Actions</h6>
              <button
                id="cancel-request-btn"
                className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={() => setShowCancel(true)}
              >
                <XCircle size={16} /> Cancel Request
              </button>
              <p className="text-muted small mt-2 mb-0">You can cancel requests that are Pending or Assigned.</p>
            </div>
          )}

          {/* Submitted On */}
          <div className="custom-card p-4 mt-3">
            <div className="small text-muted mb-1">Submitted On</div>
            <div className="small fw-semibold">
              {new Date(request?.createdAt).toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        show={showCancel}
        title="Cancel Pickup Request"
        message="Are you sure you want to cancel this pickup request? This action cannot be undone."
        confirmText="Yes, Cancel Request"
        confirmVariant="danger"
        onConfirm={handleCancel}
        onCancel={() => setShowCancel(false)}
        loading={cancelling}
      />
    </div>
  );
};

export default RequestDetail;
