import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { residentService } from '../../services/api';
import { PlusCircle, MapPin, Calendar, FileText, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

const WASTE_CATEGORIES = [
  { value: 'GENERAL', label: '🗑️ General Waste', desc: 'Household dry waste, non-recyclable items' },
  { value: 'RECYCLABLE', label: '♻️ Recyclable', desc: 'Paper, plastic, metals, glass' },
  { value: 'ORGANIC', label: '🌿 Organic / Food Waste', desc: 'Kitchen waste, food scraps, garden waste' },
  { value: 'E_WASTE', label: '💻 E-Waste', desc: 'Electronics, batteries, cables' },
  { value: 'HAZARDOUS', label: '⚠️ Hazardous', desc: 'Chemicals, paint, medical waste' },
  { value: 'CONSTRUCTION', label: '🧱 Construction Debris', desc: 'Bricks, cement, rubble' },
];

const CreatePickup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    wasteCategory: '',
    address: user?.address || '',
    locality: user?.locality || '',
    preferredDate: '',
    description: '',
    estimatedQuantity: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const localities = [
    'Koramangala', 'Indiranagar', 'Whitefield', 'Jayanagar', 'Malleswaram',
    'Rajajinagar', 'Electronic City', 'HSR Layout', 'Marathahalli', 'Banashankari',
    'BTM Layout', 'JP Nagar', 'Yelahanka', 'Hebbal', 'Sarjapur'
  ];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.wasteCategory) { setError('Please select a waste category.'); return; }
    if (!formData.preferredDate) { setError('Please choose a preferred pickup date.'); return; }

    setLoading(true);
    try {
      const payload = {
        wasteCategory: formData.wasteCategory,
        pickupAddress: formData.address,
        locality: formData.locality,
        preferredPickupDate: formData.preferredDate,
        description: formData.description || (formData.estimatedQuantity ? `Estimated: ${formData.estimatedQuantity}` : 'Standard waste pickup'),
        residentInstructions: formData.estimatedQuantity ? `Quantity: ${formData.estimatedQuantity}` : null,
      };
      await residentService.createRequest(payload);
      setSuccess(true);
      setTimeout(() => navigate('/resident/my-requests'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 400 }}>
        <div className="text-center">
          <div className="bg-success-subtle rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: 80, height: 80 }}>
            <CheckCircle size={40} className="text-success" />
          </div>
          <h4 className="fw-bold mb-2 text-success">Request Submitted!</h4>
          <p className="text-muted">Your pickup request has been received. Redirecting to your requests...</p>
          <div className="spinner-border spinner-border-sm text-success mt-2" role="status" />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
          <PlusCircle size={22} className="text-success" /> New Pickup Request
        </h4>
        <p className="text-muted small">Fill in the details to schedule a waste collection.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="custom-card p-4">
            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 py-2 mb-4">
                <AlertCircle size={16} />
                <span className="small">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} id="create-pickup-form">
              {/* Waste Category Selection */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  <Trash2 size={16} className="text-success me-1" /> Waste Category *
                </label>
                <div className="row g-2">
                  {WASTE_CATEGORIES.map(cat => (
                    <div key={cat.value} className="col-sm-6">
                      <div
                        className={`p-3 rounded-3 border cursor-pointer ${formData.wasteCategory === cat.value ? 'border-success bg-success-subtle' : 'border-light bg-light'}`}
                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                        onClick={() => handleChange({ target: { name: 'wasteCategory', value: cat.value } })}
                      >
                        <div className="fw-semibold small">{cat.label}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{cat.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div className="mb-3">
                <label htmlFor="pickup-address" className="form-label fw-semibold">
                  <MapPin size={16} className="text-success me-1" /> Pickup Address *
                </label>
                <textarea
                  id="pickup-address"
                  name="address"
                  className="form-control"
                  rows="2"
                  placeholder="House No., Street Name, Landmark..."
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                {/* Locality */}
                <div className="col-sm-6">
                  <label htmlFor="pickup-locality" className="form-label fw-semibold">
                    <MapPin size={16} className="text-success me-1" /> Locality *
                  </label>
                  <select
                    id="pickup-locality"
                    name="locality"
                    className="form-select"
                    value={formData.locality}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select locality...</option>
                    {localities.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                {/* Preferred Date */}
                <div className="col-sm-6">
                  <label htmlFor="pickup-date" className="form-label fw-semibold">
                    <Calendar size={16} className="text-success me-1" /> Preferred Date *
                  </label>
                  <input
                    type="date"
                    id="pickup-date"
                    name="preferredDate"
                    className="form-control"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={minDate}
                    required
                  />
                </div>
              </div>

              {/* Estimated Quantity */}
              <div className="mb-3">
                <label htmlFor="pickup-quantity" className="form-label fw-semibold">Estimated Quantity</label>
                <select
                  id="pickup-quantity"
                  name="estimatedQuantity"
                  className="form-select"
                  value={formData.estimatedQuantity}
                  onChange={handleChange}
                >
                  <option value="">Select approximate amount...</option>
                  <option value="Small (1-2 bags)">Small (1-2 bags)</option>
                  <option value="Medium (3-5 bags)">Medium (3-5 bags)</option>
                  <option value="Large (5-10 bags)">Large (5-10 bags)</option>
                  <option value="Very Large (10+ bags)">Very Large (10+ bags)</option>
                </select>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label htmlFor="pickup-description" className="form-label fw-semibold">
                  <FileText size={16} className="text-success me-1" /> Additional Notes
                </label>
                <textarea
                  id="pickup-description"
                  name="description"
                  className="form-control"
                  rows="3"
                  placeholder="Any special instructions, hazard warnings, access information..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="d-flex gap-3">
                <button
                  type="submit"
                  id="submit-pickup-btn"
                  className="btn btn-eco px-5 py-2 d-inline-flex align-items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm" /> Submitting...</>
                  ) : (
                    <><PlusCircle size={18} /> Submit Request</>
                  )}
                </button>
                <button type="button" className="btn btn-outline-secondary px-4 py-2" onClick={() => navigate('/resident/my-requests')}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Panel */}
        <div className="col-lg-4">
          <div className="custom-card p-4 mb-3">
            <h6 className="fw-bold mb-3 text-success">📋 What Happens Next?</h6>
            <ol className="ps-3 text-muted small">
              <li className="mb-2">Your request is submitted and marked <strong>Pending</strong></li>
              <li className="mb-2">Admin reviews and <strong>assigns a worker</strong></li>
              <li className="mb-2">Worker <strong>accepts</strong> and heads to your location</li>
              <li className="mb-2">Collection <strong>in progress</strong> notification</li>
              <li>Marked <strong>Collected</strong> — you can track everything!</li>
            </ol>
          </div>

          <div className="custom-card p-4">
            <h6 className="fw-bold mb-3 text-warning">⚠️ Important Notes</h6>
            <ul className="ps-3 text-muted small">
              <li className="mb-1">Keep waste bags accessible at the pickup address</li>
              <li className="mb-1">Be available on the preferred date</li>
              <li className="mb-1">Separate hazardous waste from general waste</li>
              <li>Cancel 24h in advance if plans change</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePickup;
