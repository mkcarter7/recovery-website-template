import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';

const About = () => {
  const { settings } = useSettings();

  return (
    <div className="about">
      <section className="section about-hero" style={{ backgroundColor: settings.background_color }}>
        <div className="container">
          <h1 className="page-title" style={{ color: settings.primary_color }}>
            About {settings.site_name}
          </h1>
        </div>
      </section>

      <section className="section about-content">
        <div className="container">
          <div className="about-text">
            <p className="about-description" style={{ whiteSpace: 'pre-line' }}>
              {settings.about_content || 'Recovery is dedicated to helping individuals overcome addiction and build a foundation for lasting recovery. Our compassionate team provides comprehensive support and evidence-based treatment programs tailored to each individual\'s unique needs.'}
            </p>
          </div>

          <div className="about-features">
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Compassionate Care</h3>
              <p>We understand that recovery is a personal journey, and we're here to support you every step of the way.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Evidence-Based Treatment</h3>
              <p>Our programs are based on proven methods and best practices in addiction recovery.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🏠</div>
              <h3>Safe Housing</h3>
              <p>We provide safe, supportive housing options to help you focus on your recovery.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Community Support</h3>
              <p>Join a community of individuals committed to recovery and supporting each other.</p>
            </div>
          </div>

          <div className="about-mission">
            <h2 style={{ color: settings.primary_color }}>Our Mission</h2>
            <p>
              At {settings.site_name}, we believe that everyone deserves a second chance at life. 
              Our mission is to provide comprehensive, compassionate care that addresses not just 
              the addiction, but the whole person. We're committed to helping individuals rebuild 
              their lives, restore relationships, and achieve lasting recovery.
            </p>
          </div>

          <div className="about-cta">
            <h2 style={{ color: settings.primary_color }}>Ready to Begin Your Journey?</h2>
            <p>Contact us today to learn more about our programs and how we can help.</p>
            <Link to="/contact" className="btn btn-primary">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
