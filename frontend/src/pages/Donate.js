import React from 'react';
import { useSettings } from '../contexts/SettingsContext';

const Donate = () => {
  const { settings } = useSettings();

  return (
    <div className="donate-page">
      <section className="donate-hero" style={{ backgroundColor: settings.accent_color }}>
        <div className="container">
          <h1 style={{ color: '#FFFFFF' }}>Support Our Mission</h1>
          <p className="donate-subtitle">
            Your generosity helps us provide compassionate care and support to those on their journey to recovery.
          </p>
        </div>
      </section>

      <section className="donate-content section">
        <div className="container">
          <div className="donate-grid">
            <div className="donate-card">
              <div className="donate-icon">🎁</div>
              <h2>Amazon Wishlist</h2>
              <p>
                Help us by purchasing items from our Amazon Wishlist. These items directly support our programs and residents.
              </p>
              {settings.amazon_wishlist_url ? (
                <a 
                  href={settings.amazon_wishlist_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ backgroundColor: settings.accent_color }}
                >
                  View Wishlist on Amazon
                </a>
              ) : (
                <p className="no-wishlist">
                  Wishlist URL will be available soon. Please check back later.
                </p>
              )}
            </div>

            <div className="donate-card">
              <div className="donate-icon">💝</div>
              <h2>Other Ways to Help</h2>
              <p>
                There are many ways to support our mission. Contact us to learn about volunteer opportunities, 
                in-kind donations, or other ways to contribute.
              </p>
              <a 
                href="/contact" 
                className="btn btn-outline"
                style={{ borderColor: settings.accent_color, color: settings.accent_color }}
              >
                Contact Us
              </a>
            </div>
          </div>

          <div className="donate-info">
            <h3>Your Impact</h3>
            <p>
              Every donation, whether through our Amazon Wishlist or other means, helps us:
            </p>
            <ul className="impact-list">
              <li>Provide essential supplies and resources to residents</li>
              <li>Support recovery programs and activities</li>
              <li>Maintain safe and comfortable housing facilities</li>
              <li>Offer educational and vocational training opportunities</li>
              <li>Create a supportive community for lasting recovery</li>
            </ul>
            <p className="thank-you">
              Thank you for your generosity and support!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate;
