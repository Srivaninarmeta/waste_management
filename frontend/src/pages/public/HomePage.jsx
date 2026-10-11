import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, ShieldCheck, Truck, BarChart3, ArrowRight, MapPin, Clock, CheckCircle2 } from 'lucide-react';

const features = [
  {
    icon: <Recycle size={28} className="text-success" />,
    title: 'Smart Pickup Requests',
    desc: 'Submit waste pickup requests in seconds. Choose category, set preferred date, and track status in real-time.',
    color: 'bg-success-subtle',
  },
  {
    icon: <Truck size={28} className="text-primary" />,
    title: 'Efficient Worker Dispatch',
    desc: 'Admins assign requests to available workers. Workers receive tasks on their dashboard and update status instantly.',
    color: 'bg-primary-subtle',
  },
  {
    icon: <BarChart3 size={28} className="text-warning" />,
    title: 'Analytics & Reports',
    desc: 'Generate detailed reports, track completion rates, and export data in CSV for administrative insights.',
    color: 'bg-warning-subtle',
  },
  {
    icon: <ShieldCheck size={28} className="text-info" />,
    title: 'Secure & Role-Based',
    desc: 'JWT-secured authentication with separate portals for Residents, Workers, and Administrators.',
    color: 'bg-info-subtle',
  },
];

const steps = [
  { icon: <UserPlus />, title: 'Register', desc: 'Create a resident account with your address details.' },
  { icon: <MapPin size={20} />, title: 'Submit Request', desc: 'Choose waste type, address, and preferred date.' },
  { icon: <Clock size={20} />, title: 'Track Status', desc: 'Get real-time updates as workers handle your request.' },
  { icon: <CheckCircle2 size={20} />, title: 'Done!', desc: 'Waste collected. Rate and submit a new request anytime.' },
];

function UserPlus() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>;
}

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="py-5 text-white position-relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)', minHeight: '80vh' }}
      >
        {/* Background decorative circles */}
        <div className="position-absolute top-0 end-0 opacity-10" style={{ width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #a7f3d0, transparent)', transform: 'translate(30%, -30%)' }} />
        <div className="position-absolute bottom-0 start-0 opacity-10" style={{ width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, #6ee7b7, transparent)', transform: 'translate(-30%, 30%)' }} />

        <div className="container py-5 position-relative">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge rounded-pill px-3 py-2 mb-4 fw-semibold" style={{ background: 'rgba(167, 243, 208, 0.2)', color: '#a7f3d0', border: '1px solid rgba(167, 243, 208, 0.3)', fontSize: '0.85rem' }}>
                🌱 Sustainable Waste Solutions
              </span>
              <h1 className="display-4 fw-bold lh-1 mb-4" style={{ letterSpacing: '-0.02em' }}>
                Smart Waste Management
                <span className="d-block mt-2" style={{ color: '#6ee7b7' }}>Made Simple</span>
              </h1>
              <p className="fs-5 mb-5 opacity-75 lh-relaxed" style={{ maxWidth: 480 }}>
                Connect residents, collection workers, and administrators on one intelligent platform.
                Request pickups, track in real-time, and keep your community clean.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/register" id="hero-register-btn" className="btn btn-light text-success fw-bold px-5 py-3 rounded-pill shadow-sm d-inline-flex align-items-center gap-2" style={{ fontSize: '1.05rem' }}>
                  Get Started Free <ArrowRight size={18} />
                </Link>
                <Link to="/login" id="hero-login-btn" className="btn btn-outline-light fw-semibold px-5 py-3 rounded-pill d-inline-flex align-items-center gap-2">
                  Sign In
                </Link>
              </div>

              <div className="d-flex gap-5 mt-5">
                <div>
                  <div className="fs-2 fw-bold" style={{ color: '#6ee7b7' }}>500+</div>
                  <div className="small opacity-75">Active Residents</div>
                </div>
                <div>
                  <div className="fs-2 fw-bold" style={{ color: '#6ee7b7' }}>98%</div>
                  <div className="small opacity-75">Collection Rate</div>
                </div>
                <div>
                  <div className="fs-2 fw-bold" style={{ color: '#6ee7b7' }}>24h</div>
                  <div className="small opacity-75">Avg. Response</div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 d-none d-lg-flex justify-content-center">
              {/* Hero Visual Card */}
              <div className="position-relative" style={{ width: 380 }}>
                <div className="card border-0 rounded-4 shadow-lg p-4" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="bg-success rounded-3 p-2">
                      <Recycle size={24} className="text-white" />
                    </div>
                    <div>
                      <div className="fw-bold text-white">Pickup Request #1042</div>
                      <div className="small opacity-75">Organic Waste • Koramangala</div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="small opacity-75">Collection Progress</span>
                      <span className="small text-success fw-bold">In Progress</span>
                    </div>
                    <div className="progress rounded-pill" style={{ height: 8 }}>
                      <div className="progress-bar bg-success" style={{ width: '65%' }} />
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                        <Truck size={16} className="text-success" />
                      </div>
                      <div className="small text-white">Worker Ravi Kumar</div>
                    </div>
                    <span className="badge rounded-pill" style={{ background: 'rgba(167,243,208,0.3)', color: '#a7f3d0' }}>ETA: 2h</span>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="position-absolute top-0 end-0 translate-middle" style={{ zIndex: 2 }}>
                  <div className="badge rounded-pill px-3 py-2 shadow" style={{ background: '#10b981', fontSize: '0.85rem' }}>
                    ✓ 12 Collected Today
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-3" style={{ color: '#064e3b' }}>Everything You Need</h2>
            <p className="text-muted fs-5 mx-auto" style={{ maxWidth: 550 }}>
              A complete ecosystem connecting all stakeholders in waste management
            </p>
          </div>
          <div className="row g-4">
            {features.map((f, i) => (
              <div key={i} className="col-sm-6 col-lg-3">
                <div className="custom-card h-100 p-4 text-center">
                  <div className={`d-inline-flex align-items-center justify-content-center rounded-3 p-3 mb-3 ${f.color}`} style={{ width: 64, height: 64 }}>
                    {f.icon}
                  </div>
                  <h5 className="fw-bold mb-2">{f.title}</h5>
                  <p className="text-muted small mb-0">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-5" style={{ background: '#f0fdf4' }}>
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-3" style={{ color: '#064e3b' }}>How It Works</h2>
            <p className="text-muted fs-5">4 simple steps to cleaner surroundings</p>
          </div>
          <div className="row g-4 justify-content-center">
            {steps.map((step, i) => (
              <div key={i} className="col-sm-6 col-md-3 text-center">
                <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow" style={{ width: 56, height: 56 }}>
                  {step.icon}
                </div>
                <div className="badge rounded-pill bg-success-subtle text-success mb-2 px-3 py-1">Step {i + 1}</div>
                <h6 className="fw-bold mb-1">{step.title}</h6>
                <p className="text-muted small">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 text-white text-center" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)' }}>
        <div className="container py-4">
          <h2 className="display-6 fw-bold mb-3">Ready to Get Started?</h2>
          <p className="fs-5 opacity-75 mb-4">Join thousands of residents making their communities cleaner.</p>
          <Link to="/register" className="btn btn-light text-success fw-bold px-5 py-3 rounded-pill shadow-sm d-inline-flex align-items-center gap-2" style={{ fontSize: '1.05rem' }}>
            Register Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
