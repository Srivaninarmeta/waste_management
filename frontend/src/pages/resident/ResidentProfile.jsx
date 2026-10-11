import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import { User, Mail, Phone, MapPin, Lock, Save, CheckCircle, AlertCircle } from 'lucide-react';

const ResidentProfile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    locality: user?.locality || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

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

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await authService.updateProfile({
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        locality: formData.locality,
      });
      updateUser(res.data);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (formData.newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await authService.updateProfile({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setSuccess('Password updated successfully!');
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmNewPassword: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password. Check current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
          <User size={22} className="text-success" /> My Profile
        </h4>
        <p className="text-muted small">Manage your account information</p>
      </div>

      <div className="row g-4">
        <div className="col-md-3">
          <div className="custom-card p-4 text-center">
            <div className="bg-success-subtle rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 72, height: 72 }}>
              <User size={36} className="text-success" />
            </div>
            <h6 className="fw-bold mb-1">{user?.fullName}</h6>
            <div className="text-muted small mb-2">{user?.email}</div>
            <span className="badge bg-success-subtle text-success px-3 py-1 rounded-pill">RESIDENT</span>
          </div>

          <div className="list-group mt-3 rounded-3 overflow-hidden border-0 shadow-sm">
            <button
              className={`list-group-item list-group-item-action border-0 py-3 px-4 ${activeTab === 'profile' ? 'bg-success-subtle text-success fw-bold' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={16} className="me-2" /> Edit Profile
            </button>
            <button
              className={`list-group-item list-group-item-action border-0 py-3 px-4 ${activeTab === 'password' ? 'bg-success-subtle text-success fw-bold' : ''}`}
              onClick={() => setActiveTab('password')}
            >
              <Lock size={16} className="me-2" /> Change Password
            </button>
          </div>
        </div>

        <div className="col-md-9">
          {success && (
            <div className="alert alert-success d-flex align-items-center gap-2 rounded-3 mb-3">
              <CheckCircle size={16} />
              <span className="small">{success}</span>
            </div>
          )}
          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 mb-3">
              <AlertCircle size={16} />
              <span className="small">{error}</span>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="custom-card p-4">
              <h6 className="fw-bold border-bottom pb-3 mb-4">Personal Information</h6>
              <form onSubmit={handleProfileUpdate}>
                <div className="row g-3">
                  <div className="col-12">
                    <label htmlFor="profile-fullName" className="form-label fw-semibold small">Full Name *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><User size={16} className="text-success" /></span>
                      <input type="text" id="profile-fullName" name="fullName" className="form-control border-start-0 ps-0"
                        value={formData.fullName} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold small">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><Mail size={16} className="text-muted" /></span>
                      <input type="email" className="form-control border-start-0 ps-0 bg-light" value={user?.email} disabled />
                    </div>
                    <small className="text-muted">Email cannot be changed.</small>
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="profile-phone" className="form-label fw-semibold small">Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><Phone size={16} className="text-success" /></span>
                      <input type="tel" id="profile-phone" name="phone" className="form-control border-start-0 ps-0"
                        value={formData.phone} onChange={handleChange} placeholder="10-digit number" />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="profile-locality" className="form-label fw-semibold small">Locality *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><MapPin size={16} className="text-success" /></span>
                      <select id="profile-locality" name="locality" className="form-select border-start-0"
                        value={formData.locality} onChange={handleChange} required>
                        <option value="">Select...</option>
                        {localities.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="col-12">
                    <label htmlFor="profile-address" className="form-label fw-semibold small">Full Address</label>
                    <textarea id="profile-address" name="address" className="form-control" rows="2"
                      value={formData.address} onChange={handleChange} placeholder="Your full address..." />
                  </div>
                </div>
                <button type="submit" id="save-profile-btn" className="btn btn-eco mt-4 d-inline-flex align-items-center gap-2" disabled={loading}>
                  {loading ? <><span className="spinner-border spinner-border-sm" /> Saving...</> : <><Save size={16} /> Save Changes</>}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="custom-card p-4">
              <h6 className="fw-bold border-bottom pb-3 mb-4">Change Password</h6>
              <form onSubmit={handlePasswordUpdate}>
                <div className="row g-3">
                  <div className="col-12">
                    <label htmlFor="current-password" className="form-label fw-semibold small">Current Password *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><Lock size={16} className="text-muted" /></span>
                      <input type="password" id="current-password" name="currentPassword" className="form-control border-start-0 ps-0"
                        value={formData.currentPassword} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="new-password" className="form-label fw-semibold small">New Password *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><Lock size={16} className="text-success" /></span>
                      <input type="password" id="new-password" name="newPassword" className="form-control border-start-0 ps-0"
                        value={formData.newPassword} onChange={handleChange} required minLength="8" />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="confirm-new-password" className="form-label fw-semibold small">Confirm New Password *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><Lock size={16} className="text-success" /></span>
                      <input type="password" id="confirm-new-password" name="confirmNewPassword" className="form-control border-start-0 ps-0"
                        value={formData.confirmNewPassword} onChange={handleChange} required />
                    </div>
                  </div>
                </div>
                <button type="submit" id="save-password-btn" className="btn btn-eco mt-4 d-inline-flex align-items-center gap-2" disabled={loading}>
                  {loading ? <><span className="spinner-border spinner-border-sm" /> Updating...</> : <><Lock size={16} /> Update Password</>}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResidentProfile;
