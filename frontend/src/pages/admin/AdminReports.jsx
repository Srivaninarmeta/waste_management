import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { BarChart3, Download, Calendar, RefreshCw, CheckCircle2, XCircle, Clock, Truck } from 'lucide-react';

const AdminReports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [downloading, setDownloading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await adminService.getReports(startDate, endDate);
      setReport(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await adminService.downloadCsv({ startDate, endDate });
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smartwaste_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed', err);
    } finally {
      setDownloading(false);
    }
  };

  const categories = report?.byCategory ? Object.entries(report.byCategory) : [];
  const localities = report?.byLocality ? Object.entries(report.byLocality).sort((a, b) => b[1] - a[1]).slice(0, 8) : [];

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <BarChart3 size={22} className="text-warning" /> Reports & Analytics
          </h4>
          <p className="text-muted small mb-0">View system-wide reports and export data</p>
        </div>
        <button
          id="download-csv-btn"
          className="btn btn-success d-inline-flex align-items-center gap-2"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? <span className="spinner-border spinner-border-sm" /> : <Download size={18} />}
          Export CSV
        </button>
      </div>

      {/* Date Filter */}
      <div className="custom-card p-3 mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-sm-4">
            <label className="form-label small fw-semibold mb-1">
              <Calendar size={14} className="me-1" /> Start Date
            </label>
            <input type="date" className="form-control form-control-sm" value={startDate}
              onChange={e => setStartDate(e.target.value)} />
          </div>
          <div className="col-sm-4">
            <label className="form-label small fw-semibold mb-1">
              <Calendar size={14} className="me-1" /> End Date
            </label>
            <input type="date" className="form-control form-control-sm" value={endDate}
              onChange={e => setEndDate(e.target.value)} />
          </div>
          <div className="col-sm-4">
            <button className="btn btn-primary btn-sm d-inline-flex align-items-center gap-2" onClick={fetchReport}>
              <RefreshCw size={14} /> Generate Report
            </button>
          </div>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : report && (
        <>
          {/* Summary Cards */}
          <div className="row g-3 mb-4">
            {[
              { icon: <Truck size={20} />, label: 'Total Requests', value: report.totalRequests ?? 0, color: 'text-primary', bg: 'bg-primary-subtle' },
              { icon: <CheckCircle2 size={20} />, label: 'Collected', value: report.collectedCount ?? 0, color: 'text-success', bg: 'bg-success-subtle' },
              { icon: <Clock size={20} />, label: 'Pending', value: report.pendingCount ?? 0, color: 'text-warning', bg: 'bg-warning-subtle' },
              { icon: <XCircle size={20} />, label: 'Cancelled', value: report.cancelledCount ?? 0, color: 'text-danger', bg: 'bg-danger-subtle' },
            ].map((s, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="custom-card p-4 d-flex align-items-center gap-3">
                  <div className={`rounded-3 p-3 ${s.bg}`} style={{ minWidth: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className={s.color}>{s.icon}</span>
                  </div>
                  <div>
                    <div className="text-muted small">{s.label}</div>
                    <div className={`fs-2 fw-bold ${s.color}`}>{s.value}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Completion Rate */}
          {report.totalRequests > 0 && (
            <div className="custom-card p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold mb-0">Overall Collection Rate</h6>
                <span className="badge bg-success-subtle text-success fs-6 px-3 py-2">
                  {Math.round(((report.collectedCount ?? 0) / report.totalRequests) * 100)}%
                </span>
              </div>
              <div className="progress rounded-pill" style={{ height: 16 }}>
                <div
                  className="progress-bar bg-success rounded-pill"
                  style={{ width: `${Math.round(((report.collectedCount ?? 0) / report.totalRequests) * 100)}%` }}
                />
              </div>
              <div className="small text-muted mt-2">
                {report.collectedCount} out of {report.totalRequests} requests collected
              </div>
            </div>
          )}

          <div className="row g-4">
            {/* By Category */}
            {categories.length > 0 && (
              <div className="col-md-6">
                <div className="custom-card p-4 h-100">
                  <h6 className="fw-bold border-bottom pb-3 mb-4">Requests by Category</h6>
                  {categories.map(([cat, count]) => {
                    const pct = Math.round((count / (report.totalRequests || 1)) * 100);
                    const colorMap = {
                      GENERAL: '#64748b', RECYCLABLE: '#0284c7', ORGANIC: '#16a34a',
                      E_WASTE: '#d97706', HAZARDOUS: '#dc2626', CONSTRUCTION: '#9333ea'
                    };
                    return (
                      <div key={cat} className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="small fw-semibold">{cat.replace(/_/g, ' ')}</span>
                          <span className="small text-muted">{count} ({pct}%)</span>
                        </div>
                        <div className="progress rounded-pill" style={{ height: 8 }}>
                          <div className="progress-bar rounded-pill" style={{ width: `${pct}%`, backgroundColor: colorMap[cat] || '#6b7280' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* By Locality */}
            {localities.length > 0 && (
              <div className="col-md-6">
                <div className="custom-card p-4 h-100">
                  <h6 className="fw-bold border-bottom pb-3 mb-4">Top Localities</h6>
                  {localities.map(([loc, count]) => {
                    const maxCount = Math.max(...localities.map(([, c]) => c));
                    const pct = Math.round((count / maxCount) * 100);
                    return (
                      <div key={loc} className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="small fw-semibold">{loc}</span>
                          <span className="small text-muted">{count} requests</span>
                        </div>
                        <div className="progress rounded-pill" style={{ height: 8 }}>
                          <div className="progress-bar bg-info rounded-pill" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Worker Stats */}
          {report.workerStats && report.workerStats.length > 0 && (
            <div className="custom-card p-4 mt-4">
              <h6 className="fw-bold border-bottom pb-3 mb-4">Worker Performance</h6>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="small text-muted fw-semibold">Worker Name</th>
                      <th className="small text-muted fw-semibold">Total Assigned</th>
                      <th className="small text-muted fw-semibold">Collected</th>
                      <th className="small text-muted fw-semibold">Active</th>
                      <th className="small text-muted fw-semibold">Completion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.workerStats.map(w => {
                      const rate = w.totalAssigned > 0 ? Math.round((w.collected / w.totalAssigned) * 100) : 0;
                      return (
                        <tr key={w.workerId}>
                          <td className="fw-semibold">{w.workerName}</td>
                          <td>{w.totalAssigned}</td>
                          <td className="text-success fw-semibold">{w.collected}</td>
                          <td className="text-warning">{w.active}</td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div className="progress flex-grow-1 rounded-pill" style={{ height: 6 }}>
                                <div className="progress-bar bg-success" style={{ width: `${rate}%` }} />
                              </div>
                              <span className="small fw-bold text-success">{rate}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminReports;
