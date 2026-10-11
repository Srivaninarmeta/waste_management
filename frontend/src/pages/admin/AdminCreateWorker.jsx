import React, { useState } from 'react';
import { adminService } from '../../services/api';
import { UserPlus, Mail, Lock, User, Phone, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

const AdminCreateWorker = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    locality: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const localities = [
    'Koramangala', 'Indiranagar', 'Whitefield', 'Jayanagar', 'Malleswaram',
    'Rajajinagar', 'Electronic City', 'HSR Layout', 'Marathahalli', 'Banashankari',
    'BTM Layout', 'JP Nagar', 'Yelahanka', 'Hebbal', 'Sarjapur'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await adminService.createWorker(formData);
      setSuccess(`Worker account for "${formData.fullName}" created successfully! They can now log in.`);
      setFormData({ fullName: '', email: '', password: '', phone: '', locality: '', address: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create worker account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
          <UserPlus size={22} className="text-success" /> Create Worker Account
        </h4>
        <p className="text-muted small">Register a new waste collection worker in the system</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="custom-card p-4">
            {success && (
              <div className="alert alert-success d-flex align-items-center gap-2 rounded-3 mb-4">
                <CheckCircle size={16} />
                <span className="small">{success}</span>
              </div>
            )}
            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 mb-4">
                <AlertCircle size={16} />
                <span className="small">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} id="create-worker-form">
              <div className="row g-3">
                <div className="col-12">
                  <label htmlFor="worker-fullName" className="form-label fw-semibold small">Full Name *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><User size={16} className="text-success" /></span>
                    <input type="text" id="worker-fullName" name="fullName" className="form-control border-start-0 ps-0"
                      placeholder="Worker's full name" value={formData.fullName} onChange={handleChange} required />
                  </div>
                </div>

                <div className="col-12">
                  <label htmlFor="worker-email" className="form-label fw-semibold small">Email Address *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><Mail size={16} className="text-success" /></span>
                    <input type="email" id="worker-email" name="email" className="form-control border-start-0 ps-0"
                      placeholder="worker@example.com" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>

                <div className="col-sm-6">
                  <label htmlFor="worker-password" className="form-label fw-semibold small">Password *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><Lock size={16} className="text-success" /></span>
                    <input type="password" id="worker-password" name="password" className="form-control border-start-0 ps-0"
                      placeholder="Min 8 characters" value={formData.password} onChange={handleChange} required minLength="8" />
                  </div>
                </div>

                <div className="col-sm-6">
                  <label htmlFor="worker-phone" className="form-label fw-semibold small">Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><Phone size={16} className="text-success" /></span>
                    <input type="tel" id="worker-phone" name="phone" className="form-control border-start-0 ps-0"
                      placeholder="10-digit number" value={formData.phone} onChange={handleChange} />
                  </div>
                </div>

                <div className="col-sm-6">
                  <label htmlFor="worker-locality" className="form-label fw-semibold small">Assigned Locality *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><MapPin size={16} className="text-success" /></span>
                    <select id="worker-locality" name="locality" className="form-select border-start-0"
                      value={formData.locality} onChange={handleChange} required>
                      <option value="">Select area...</option>
                      {localities.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>

                <div className="col-sm-6">
                  <label htmlFor="worker-address" className="form-label fw-semibold small">Address</label>
                  <input type="text" id="worker-address" name="address" className="form-control"
                    placeholder="Worker's address" value={formData.address} onChange={handleChange} />
                </div>
              </div>

              <button
                type="submit"
                id="create-worker-btn"
                className="btn btn-eco mt-4 px-5 d-inline-flex align-items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm" /> Creating...</>
                ) : (
                  <><UserPlus size={18} /> Create Worker Account</>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="custom-card p-4">
            <h6 className="fw-bold mb-3 text-success">📋 About Worker Accounts</h6>
            <ul className="text-muted small ps-3">
              <li className="mb-2">Workers are created by admins only — they cannot self-register</li>
              <li className="mb-2">Workers can log in using their email and the password you set</li>
              <li className="mb-2">They will see only <strong>assigned tasks</strong> in their portal</li>
              <li className="mb-2">Workers can update task status (Accept → In Progress → Collected)</li>
              <li>Assign them to a locality for easy task routing</li>
            </ul>
          </div>

          <div className="custom-card p-4 mt-3 bg-warning-subtle border-warning">
            <h6 className="fw-bold mb-2 text-warning">⚠️ Security Tip</h6>
            <p className="text-muted small mb-0">
              Ensure the worker receives their credentials securely. Advise them to change their password after first login.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateWorker;
