import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import api from '../config/api';

const HousingApplication = () => {
  const { settings } = useSettings();
  const [housingOptions, setHousingOptions] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    preferred_housing: '',
    move_in_date: '',
    current_address: '',
    reason_for_applying: '',
    special_needs: '',
    employment_status: '',
    income_source: '',
    previous_treatment: '',
    additional_info: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchHousingOptions();
  }, []);

  const fetchHousingOptions = async () => {
    try {
      const response = await api.get('/housing/');
      const housingData = response.data;
      if (Array.isArray(housingData)) {
        setHousingOptions(housingData.filter(h => h.is_available));
      } else if (housingData && Array.isArray(housingData.results)) {
        setHousingOptions(housingData.results.filter(h => h.is_available));
      }
    } catch (error) {
      console.error('Error fetching housing options:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      await api.post('/housing-applications/submit/', formData);
      setStatus({
        type: 'success',
        message: 'Thank you for your application! We will review it and get back to you soon.',
      });
      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        preferred_housing: '',
        move_in_date: '',
        current_address: '',
        reason_for_applying: '',
        special_needs: '',
        employment_status: '',
        income_source: '',
        previous_treatment: '',
        additional_info: '',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'There was an error submitting your application. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="housing-application">
      <section className="application-hero" style={{ backgroundColor: settings.accent_color }}>
        <div className="container">
          <h1 style={{ color: '#FFFFFF' }}>Housing Application</h1>
          <p className="application-subtitle">
            Apply for housing at 2nd Chance Recovery. Please fill out all required fields.
          </p>
        </div>
      </section>

      <section className="application-content section">
        <div className="container">
          <form onSubmit={handleSubmit} className="application-form">
            {status.message && (
              <div className={`form-status ${status.type}`}>
                {status.message}
              </div>
            )}

            <div className="form-section">
              <h2>Personal Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="first_name">First Name *</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="last_name">Last Name *</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="date_of_birth">Date of Birth</label>
                  <input
                    type="date"
                    id="date_of_birth"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Emergency Contact</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="emergency_contact_name">Emergency Contact Name</label>
                  <input
                    type="text"
                    id="emergency_contact_name"
                    name="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="emergency_contact_phone">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    id="emergency_contact_phone"
                    name="emergency_contact_phone"
                    value={formData.emergency_contact_phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Application Details</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="preferred_housing">Preferred Housing Option</label>
                  <select
                    id="preferred_housing"
                    name="preferred_housing"
                    value={formData.preferred_housing}
                    onChange={handleChange}
                  >
                    <option value="">Select a housing option</option>
                    {housingOptions.map((housing) => (
                      <option key={housing.id} value={housing.id}>
                        {housing.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="move_in_date">Preferred Move-In Date</label>
                  <input
                    type="date"
                    id="move_in_date"
                    name="move_in_date"
                    value={formData.move_in_date}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="current_address">Current Address</label>
                <textarea
                  id="current_address"
                  name="current_address"
                  value={formData.current_address}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label htmlFor="reason_for_applying">Reason for Applying *</label>
                <textarea
                  id="reason_for_applying"
                  name="reason_for_applying"
                  value={formData.reason_for_applying}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Please explain why you are applying for housing..."
                />
              </div>
              <div className="form-group">
                <label htmlFor="special_needs">Special Needs or Accommodations</label>
                <textarea
                  id="special_needs"
                  name="special_needs"
                  value={formData.special_needs}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Any special needs or accommodations required..."
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Additional Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="employment_status">Employment Status</label>
                  <input
                    type="text"
                    id="employment_status"
                    name="employment_status"
                    value={formData.employment_status}
                    onChange={handleChange}
                    placeholder="e.g., Employed, Unemployed, Student"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="income_source">Income Source</label>
                  <input
                    type="text"
                    id="income_source"
                    name="income_source"
                    value={formData.income_source}
                    onChange={handleChange}
                    placeholder="e.g., Job, Benefits, Family support"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="previous_treatment">Previous Treatment History</label>
                <textarea
                  id="previous_treatment"
                  name="previous_treatment"
                  value={formData.previous_treatment}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Please describe any previous treatment or recovery programs..."
                />
              </div>
              <div className="form-group">
                <label htmlFor="additional_info">Additional Information</label>
                <textarea
                  id="additional_info"
                  name="additional_info"
                  value={formData.additional_info}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Any other information you'd like to share..."
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
                style={{ backgroundColor: settings.accent_color }}
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HousingApplication;

