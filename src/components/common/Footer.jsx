import React from 'react';
import { Recycle, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-top py-5 mt-auto">
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-5 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3 text-success fw-bold fs-4">
              <div className="bg-success text-white p-2 rounded-3 d-flex align-items-center justify-content-center">
                <Recycle size={20} />
              </div>
              <span style={{ color: '#064e3b' }}>SmartWaste</span>
            </div>
            <p className="text-secondary small pe-lg-4">
              A comprehensive municipal platform connecting residents, collection workers, and city administrators to streamline scheduled waste collection, prevent delays, and foster cleaner, greener communities.
            </p>
          </div>

          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="fw-bold text-dark mb-3">Waste Streams</h6>
            <ul className="list-unstyled small text-muted d-flex flex-column gap-2 mb-0">
              <li>General Household</li>
              <li>Recyclable Paper & Plastic</li>
              <li>Organic & Compost</li>
              <li>E-Waste & Electronics</li>
              <li>Hazardous & Medical</li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="fw-bold text-dark mb-3">System Portals</h6>
            <ul className="list-unstyled small text-muted d-flex flex-column gap-2 mb-0">
              <li>Resident Request Portal</li>
              <li>Worker Dispatch & Tracking</li>
              <li>Operations Dashboard</li>
              <li>Reporting & Metrics</li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-dark mb-3">College Demo Ready</h6>
            <p className="text-secondary small mb-2">
              Equipped with complete test data, automated workflows, and role-based permissions ready for evaluation.
            </p>
            <div className="badge bg-success-subtle text-success p-2 rounded-3 small">
              Spring Boot + React + MySQL
            </div>
          </div>
        </div>

        <hr className="my-4 text-muted opacity-25" />

        <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2 small text-muted">
          <div>
            &copy; {new Date().getFullYear()} Smart Waste Management and Pickup System. All rights reserved.
          </div>
          <div className="d-flex align-items-center gap-1">
            Built with modern full-stack architecture
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
