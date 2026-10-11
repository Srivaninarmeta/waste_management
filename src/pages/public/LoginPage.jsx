import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Recycle, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(formData);
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'WORKER') navigate('/worker/dashboard');
      else navigate('/resident/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5"
      style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #e0f7fa 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              {/* Card Header */}
              <div className="p-4 text-white text-center" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)' }}>
                <div className="d-inline-flex align-items-center justify-content-center bg-white rounded-3 p-3 mb-3 shadow-sm">
                  <Recycle size={32} className="text-success" />
                </div>
                <h1 className="h4 fw-bold mb-1">Welcome Back</h1>
                <p className="mb-0 opacity-75 small">Sign in to SmartWaste Portal</p>
              </div>

              <div className="card-body p-4">
                {searchParams.get('session_expired') && (
                  <div className="alert alert-warning d-flex align-items-center gap-2 rounded-3 py-2 mb-3" role="alert">
                    <AlertCircle size={16} />
                    <small>Your session expired. Please sign in again.</small>
                  </div>
                )}
                {error && (
                  <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 py-2 mb-3" role="alert">
                    <AlertCircle size={16} />
                    <small>{error}</small>
                  </div>
                )}

                <form onSubmit={handleSubmit} id="login-form">
                  <div className="mb-3">
                    <label htmlFor="login-email" className="form-label fw-semibold small text-secondary">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Mail size={16} className="text-success" />
                      </span>
                      <input
                        type="email"
                        id="login-email"
                        name="email"
                        className="form-control border-start-0 ps-0"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="login-password" className="form-label fw-semibold small text-secondary">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Lock size={16} className="text-success" />
                      </span>
                      <input
                        type="password"
                        id="login-password"
                        name="password"
                        className="form-control border-start-0 ps-0"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="current-password"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="login-submit-btn"
                    className="btn btn-eco w-100 d-flex align-items-center justify-content-center gap-2 py-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm" /> Signing in...</>
                    ) : (
                      <><LogIn size={18} /> Sign In</>
                    )}
                  </button>
                </form>

                <hr className="my-4" />

                {/* Demo Credentials & Quick Fill */}
                <div className="bg-light rounded-3 p-3 mb-3 border">
                  <p className="small fw-bold text-center text-secondary mb-2">🎯 Demo Accounts (Click to autofill)</p>
                  <div className="d-grid gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-dark text-start d-flex justify-content-between align-items-center py-2 px-3"
                      onClick={() => setFormData({ email: 'admin@waste.com', password: 'admin123' })}
                    >
                      <span><strong>Admin:</strong> admin@waste.com</span>
                      <span className="badge bg-dark">Fill</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success text-start d-flex justify-content-between align-items-center py-2 px-3"
                      onClick={() => setFormData({ email: 'resident@waste.com', password: 'resident123' })}
                    >
                      <span><strong>Resident:</strong> resident@waste.com</span>
                      <span className="badge bg-success">Fill</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary text-start d-flex justify-content-between align-items-center py-2 px-3"
                      onClick={() => setFormData({ email: 'worker@waste.com', password: 'worker123' })}
                    >
                      <span><strong>Worker:</strong> worker@waste.com</span>
                      <span className="badge bg-primary">Fill</span>
                    </button>
                  </div>
                </div>

                <p className="text-center small text-muted mb-0">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-success fw-semibold text-decoration-none">
                    Register here
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

export default LoginPage;
