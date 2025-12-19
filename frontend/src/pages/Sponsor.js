import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import api from '../config/api';

const Sponsor = () => {
  const { settings } = useSettings();
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishLists();
  }, []);

  const fetchWishLists = async () => {
    try {
      const response = await api.get('/wishlists/');
      const wishlistsData = response.data;
      if (Array.isArray(wishlistsData)) {
        setWishlists(wishlistsData);
      } else if (wishlistsData && Array.isArray(wishlistsData.results)) {
        setWishlists(wishlistsData.results);
      } else {
        setWishlists([]);
      }
    } catch (error) {
      console.error('Error fetching wish lists:', error);
      setWishlists([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sponsor-page">
      <section className="sponsor-hero" style={{ backgroundColor: settings.accent_color }}>
        <div className="container">
          <h1 style={{ color: '#FFFFFF' }}>Support Our Mission</h1>
          <p className="sponsor-subtitle">
            Your generosity helps us provide compassionate care and support to those on their journey to recovery.
          </p>
        </div>
      </section>

      <section className="sponsor-content section">
        <div className="container">
          <div className="sponsor-grid">
            <div className="sponsor-card">
              <div className="sponsor-icon">🎁</div>
              <h2>Amazon Wishlists</h2>
              <p>
                Help us by purchasing items from our Amazon Wishlists. These items directly support our programs and residents.
              </p>
              {loading ? (
                <p className="no-wishlist">Loading wishlists...</p>
              ) : wishlists.length > 0 ? (
                <div className="wishlists-list">
                  {wishlists.map((wishlist) => (
                    <div key={wishlist.id} className="wishlist-item">
                      {wishlist.description && (
                        <p className="wishlist-description">{wishlist.description}</p>
                      )}
                      <a 
                        href={wishlist.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ backgroundColor: settings.accent_color }}
                      >
                        View {wishlist.name} on Amazon
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-wishlist">
                  Wishlists will be available soon. Please check back later.
                </p>
              )}
            </div>

            <div className="sponsor-card">
              <div className="sponsor-icon">💝</div>
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

          <div className="sponsor-info">
            <h3>Your Impact</h3>
            <p>
              Every sponsorship, whether through our Amazon Wishlist or other means, helps us:
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

export default Sponsor;

