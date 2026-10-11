import React from 'react';

const LoadingSpinner = ({ message = 'Loading details...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-5">
      <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      {message && <p className="mt-3 text-muted fw-medium small">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
