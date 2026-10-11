import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, Target, Users, Code2, ArrowRight } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="py-5" style={{ background: 'linear-gradient(180deg, #f0fdf4, #ffffff)' }}>
      <div className="container py-4">
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center justify-content-center bg-success-subtle rounded-3 p-3 mb-3">
            <Recycle size={36} className="text-success" />
          </div>
          <h1 className="display-5 fw-bold mb-3" style={{ color: '#064e3b' }}>About SmartWaste System</h1>
          <p className="text-muted fs-5 mx-auto" style={{ maxWidth: 650 }}>
            A college project demonstrating a full-stack web application for smart urban waste collection management.
          </p>
        </div>

        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="custom-card h-100 p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="bg-success-subtle rounded-3 p-2">
                  <Target size={24} className="text-success" />
                </div>
                <h5 className="fw-bold mb-0">Project Objective</h5>
              </div>
              <p className="text-muted small">
                Build a role-based waste management platform connecting residents, workers, and administrators.
                Demonstrates full-stack development with Spring Boot + React + MySQL.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="custom-card h-100 p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="bg-primary-subtle rounded-3 p-2">
                  <Code2 size={24} className="text-primary" />
                </div>
                <h5 className="fw-bold mb-0">Tech Stack</h5>
              </div>
              <ul className="text-muted small list-unstyled mb-0">
                <li className="mb-1">⚙️ <strong>Backend:</strong> Spring Boot 3.3, Spring Security, JWT</li>
                <li className="mb-1">🗄️ <strong>Database:</strong> MySQL 8.0 + JPA/Hibernate</li>
                <li className="mb-1">⚛️ <strong>Frontend:</strong> React 19, Vite, React Router</li>
                <li className="mb-1">🎨 <strong>UI:</strong> Bootstrap 5, Lucide Icons</li>
                <li>📖 <strong>Docs:</strong> Swagger / OpenAPI</li>
              </ul>
            </div>
          </div>
          <div className="col-md-4">
            <div className="custom-card h-100 p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="bg-warning-subtle rounded-3 p-2">
                  <Users size={24} className="text-warning" />
                </div>
                <h5 className="fw-bold mb-0">Three User Roles</h5>
              </div>
              <ul className="text-muted small list-unstyled mb-0">
                <li className="mb-2">🏠 <strong>Resident:</strong> Register, submit & track pickup requests</li>
                <li className="mb-2">🚛 <strong>Worker:</strong> View assigned tasks, update collection status</li>
                <li>👑 <strong>Admin:</strong> Full oversight, assign workers, view reports</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/register" className="btn btn-eco px-5 py-3 rounded-pill d-inline-flex align-items-center gap-2">
            Try the System <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="btn btn-outline-secondary px-5 py-3 rounded-pill ms-3">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
