import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import api from '../config/api';

const Programs = () => {
  const { settings } = useSettings();
  const [programs, setPrograms] = useState([]);
  const [housing, setHousing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [programsRes, housingRes] = await Promise.all([
        api.get('/programs/'),
        api.get('/housing/'),
      ]);
      setPrograms(programsRes.data);
      setHousing(housingRes.data);
    } catch (error) {
      // Silently handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="programs">
      <section className="section programs-hero" style={{ backgroundColor: settings.background_color }}>
        <div className="container">
          <h1 className="page-title" style={{ color: settings.primary_color }}>
            Programs & Housing
          </h1>
          <p className="page-subtitle" style={{ color: settings.empty_state_color || settings.secondary_color }}>
            Comprehensive recovery programs and safe housing options
          </p>
        </div>
      </section>

      {/* Programs Section */}
      <section className="section programs-section">
        <div className="container">
          <h2 className="section-title" style={{ color: settings.primary_color }}>
            Recovery Programs
          </h2>
          {loading ? (
            <p style={{ textAlign: 'center', color: settings.secondary_color }}>
              Loading programs...
            </p>
          ) : programs.length > 0 ? (
            <div className="programs-grid">
              {programs.map((program) => (
                <div key={program.id} className="program-card">
                  {program.image && (
                    <div className="program-image">
                      <img src={program.image} alt={program.name} />
                    </div>
                  )}
                  <div className="program-content">
                    <h3>{program.name}</h3>
                    {program.duration && (
                      <p className="program-duration">
                        Duration: {program.duration}
                      </p>
                    )}
                    <p className="program-description">{program.description}</p>
                    {program.features && program.features.length > 0 && (
                      <ul className="program-features">
                        {program.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: settings.empty_state_color || settings.secondary_color }}>
              No programs available at this time.
            </p>
          )}
        </div>
      </section>

      {/* Housing Section */}
      <section className="section housing-section" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="container">
          <h2 className="section-title" style={{ color: settings.primary_color }}>
            Housing Options
          </h2>
          {loading ? (
            <p style={{ textAlign: 'center', color: settings.secondary_color }}>
              Loading housing options...
            </p>
          ) : housing.length > 0 ? (
            <div className="housing-grid">
              {housing.map((option) => (
                <div key={option.id} className="housing-card">
                  {option.image && (
                    <div className="housing-image">
                      <img src={option.image} alt={option.name} />
                    </div>
                  )}
                  <div className="housing-content">
                    <h3>{option.name}</h3>
                    {option.capacity && (
                      <p className="housing-capacity">
                        Capacity: {option.capacity} residents
                      </p>
                    )}
                    <p className="housing-description">{option.description}</p>
                    {option.amenities && option.amenities.length > 0 && (
                      <div className="housing-amenities">
                        <h4>Amenities:</h4>
                        <ul>
                          {option.amenities.map((amenity, index) => (
                            <li key={index}>{amenity}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: settings.empty_state_color || settings.secondary_color }}>
              No housing options available at this time.
            </p>
          )}
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link 
              to="/housing-application" 
              className="btn btn-primary"
              style={{ backgroundColor: settings.accent_color }}
            >
              Apply for Housing
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section cta-section" style={{ backgroundColor: settings.accent_color }}>
        <div className="container">
          <h2 style={{ color: '#FFFFFF', textAlign: 'center', marginBottom: '1rem' }}>
            Interested in Our Programs?
          </h2>
          <p style={{ color: '#FFFFFF', textAlign: 'center', marginBottom: '2rem' }}>
            Contact us to learn more and get started on your recovery journey.
          </p>
          <div style={{ textAlign: 'center' }}>
            <Link to="/contact" className="btn btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Programs;
