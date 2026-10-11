import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Recycle, User, Mail, Lock, Phone, MapPin, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    locality: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const localities = [
    'Koramangala', 'Indiranagar', 'Whitefield', 'Jayanagar', 'Malleswaram',
    'Rajajinagar', 'Electronic City', 'HSR Layout', 'Marathahalli', 'Banashankari',
    'BTM Layout', 'JP Nagar', 'Yelahanka', 'Hebbal', 'Sarjapur'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      await register({ ...registerData, role: 'RESIDENT' });
      navigate('/resident/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5"
      style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #e0f7fa 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-9 col-lg-7 col-xl-6">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              {/* Card Header */}
              <div className="p-4 text-white text-center" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)' }}>
                <div className="d-inline-flex align-items-center justify-content-center bg-white rounded-3 p-3 mb-3 shadow-sm">
                  <Recycle size={32} className="text-success" />
                </div>
                <h1 className="h4 fw-bold mb-1">Create Your Account</h1>
                <p className="mb-0 opacity-75 small">Join SmartWaste as a Resident</p>
              </div>

              <div className="card-body p-4">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 py-2 mb-3" role="alert">
                    <AlertCircle size={16} />
                    <small>{error}</small>
                  </div>
                )}

                <form onSubmit={handleSubmit} id="register-form">
                  <div className="row g-3">
                    {/* Full Name */}
                    <div className="col-12">
                      <label htmlFor="reg-fullName" className="form-label fw-semibold small text-secondary">Full Name *</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <User size={16} className="text-success" />
                        </span>
                        <input
                          type="text"
                          id="reg-fullName"
                          name="fullName"
                          className="form-control border-start-0 ps-0"
                          placeholder="Your full name"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-12">
                      <label htmlFor="reg-email" className="form-label fw-semibold small text-secondary">Email Address *</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <Mail size={16} className="text-success" />
                        </span>
                        <input
                          type="email"
                          id="reg-email"
                          name="email"
                          className="form-control border-start-0 ps-0"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="col-12 col-sm-6">
                      <label htmlFor="reg-phone" className="form-label fw-semibold small text-secondary">Phone Number</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <Phone size={16} className="text-success" />
                        </span>
                        <input
                          type="tel"
                          id="reg-phone"
                          name="phone"
                          className="form-control border-start-0 ps-0"
                          placeholder="10-digit number"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Locality */}
                    <div className="col-12 col-sm-6">
                      <label htmlFor="reg-locality" className="form-label fw-semibold small text-secondary">Locality *</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <MapPin size={16} className="text-success" />
                        </span>
                        <select
                          id="reg-locality"
                          name="locality"
                          className="form-select border-start-0"
                          value={formData.locality}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select area...</option>
                          {localities.map(l => (
                            <option key={l} value={l}>{l}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="col-12">
                      <label htmlFor="reg-address" className="form-label fw-semibold small text-secondary">Full Address</label>
                      <textarea
                        id="reg-address"
                        name="address"
                        className="form-control"
                        placeholder="House/Flat No., Street, Area..."
                        value={formData.address}
                        onChange={handleChange}
                        rows="2"
                      />
                    </div>

                    {/* Password */}
                    <div className="col-12 col-sm-6">
                      <label htmlFor="reg-password" className="form-label fw-semibold small text-secondary">Password *</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <Lock size={16} className="text-success" />
                        </span>
                        <input
                          type="password"
                          id="reg-password"
                          name="password"
                          className="form-control border-start-0 ps-0"
                          placeholder="Min 8 chars"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          minLength="8"
                        />
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="col-12 col-sm-6">
                      <label htmlFor="reg-confirmPassword" className="form-label fw-semibold small text-secondary">Confirm Password *</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <CheckCircle size={16} className={formData.password && formData.confirmPassword === formData.password ? 'text-success' : 'text-muted'} />
                        </span>
                        <input
                          type="password"
                          id="reg-confirmPassword"
                          name="confirmPassword"
                          className="form-control border-start-0 ps-0"
                          placeholder="Repeat password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="register-submit-btn"
                    className="btn btn-eco w-100 d-flex align-items-center justify-content-center gap-2 py-3 mt-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm" /> Creating account...</>
                    ) : (
                      <><UserPlus size={18} /> Create Account</>
                    )}
                  </button>
                </form>

                <hr className="my-3" />
                <p className="text-center small text-muted mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="text-success fw-semibold text-decoration-none">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
